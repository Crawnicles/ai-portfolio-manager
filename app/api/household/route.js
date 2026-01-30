import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = process.env.DATA_DIR || '/tmp';
const HOUSEHOLDS_FILE = join(DATA_DIR, 'households.json');
const USERS_FILE = join(DATA_DIR, 'users.json');

function getHouseholds() {
  try {
    if (existsSync(HOUSEHOLDS_FILE)) {
      return JSON.parse(readFileSync(HOUSEHOLDS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function saveHouseholds(households) {
  writeFileSync(HOUSEHOLDS_FILE, JSON.stringify(households, null, 2));
}

function getUsers() {
  try {
    if (existsSync(USERS_FILE)) {
      return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
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
