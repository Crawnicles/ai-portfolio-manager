import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Use a more persistent location - create .data folder in project root for local dev
// On Vercel, we'll rely on client-side sync mechanism
const DATA_DIR = process.env.DATA_DIR || (process.env.VERCEL ? '/tmp' : join(process.cwd(), '.data'));
const HOUSEHOLDS_FILE = join(DATA_DIR, 'households.json');
const USERS_FILE = join(DATA_DIR, 'users.json');

// Ensure data directory exists
try {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.error('Failed to create data directory:', e);
}

// In-memory cache for serverless environments
let householdsCache = null;
let usersCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

function getHouseholds() {
  try {
    // Check cache first
    if (householdsCache && Date.now() - lastCacheTime < CACHE_TTL) {
      return householdsCache;
    }

    if (existsSync(HOUSEHOLDS_FILE)) {
      householdsCache = JSON.parse(readFileSync(HOUSEHOLDS_FILE, 'utf-8'));
      lastCacheTime = Date.now();
      return householdsCache;
    }
  } catch (e) {
    console.error('Error reading households:', e);
  }
  return householdsCache || [];
}

function saveHouseholds(households) {
  try {
    writeFileSync(HOUSEHOLDS_FILE, JSON.stringify(households, null, 2));
    householdsCache = households;
    lastCacheTime = Date.now();
  } catch (e) {
    console.error('Error saving households:', e);
    // Still update cache even if file write fails
    householdsCache = households;
    lastCacheTime = Date.now();
  }
}

function getUsers() {
  try {
    if (usersCache && Date.now() - lastCacheTime < CACHE_TTL) {
      return usersCache;
    }

    if (existsSync(USERS_FILE)) {
      usersCache = JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
      return usersCache;
    }
  } catch (e) {
    console.error('Error reading users:', e);
  }
  return usersCache || [];
}

// GET - Retrieve household data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const householdId = searchParams.get('householdId');

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 });
    }

    const households = getHouseholds();
    const household = households.find(h => h.id === householdId);

    if (!household) {
      return NextResponse.json({ error: 'Household not found' }, { status: 404 });
    }

    // Get member names
    const users = getUsers();
    const members = household.members.map(email => {
      const user = users.find(u => u.email === email);
      return {
        email,
        name: user?.name || email.split('@')[0],
        id: user?.id,
      };
    });

    return NextResponse.json({
      id: household.id,
      code: household.code,
      members,
      data: household.data || {},
      createdAt: household.createdAt,
    });
  } catch (error) {
    console.error('Household GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Update household data
export async function POST(request) {
  try {
    const { householdId, data, field } = await request.json();

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID required' }, { status: 400 });
    }

    const households = getHouseholds();
    const householdIndex = households.findIndex(h => h.id === householdId);

    if (householdIndex === -1) {
      return NextResponse.json({ error: 'Household not found' }, { status: 404 });
    }

    // Initialize data object if it doesn't exist
    if (!households[householdIndex].data) {
      households[householdIndex].data = {};
    }

    // Update specific field or merge all data
    if (field) {
      households[householdIndex].data[field] = data;
    } else {
      households[householdIndex].data = {
        ...households[householdIndex].data,
        ...data,
      };
    }

    households[householdIndex].updatedAt = new Date().toISOString();

    saveHouseholds(households);

    return NextResponse.json({
      success: true,
      data: households[householdIndex].data,
    });
  } catch (error) {
    console.error('Household POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove member from household (for leaving)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const householdId = searchParams.get('householdId');
    const email = searchParams.get('email');

    if (!householdId || !email) {
      return NextResponse.json({ error: 'Household ID and email required' }, { status: 400 });
    }

    const households = getHouseholds();
    const householdIndex = households.findIndex(h => h.id === householdId);

    if (householdIndex === -1) {
      return NextResponse.json({ error: 'Household not found' }, { status: 404 });
    }

    // Remove member
    households[householdIndex].members = households[householdIndex].members.filter(m => m !== email);

    // If no members left, delete household
    if (households[householdIndex].members.length === 0) {
      households.splice(householdIndex, 1);
    }

    saveHouseholds(households);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Household DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
