import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Simple file-based user storage (for personal use)
// In production, use a proper database
const DATA_DIR = process.env.DATA_DIR || '/tmp';
const USERS_FILE = join(DATA_DIR, 'users.json');
const HOUSEHOLDS_FILE = join(DATA_DIR, 'households.json');

function getUsers() {
  try {
    if (existsSync(USERS_FILE)) {
      return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function saveUsers(users) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

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

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' }, // 'login' or 'signup'
        householdCode: { label: 'Household Code', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, name, action, householdCode } = credentials;
        const users = getUsers();
        const households = getHouseholds();

        if (action === 'signup') {
          // Check if user already exists
          const existingUser = users.find(u => u.email === email);
          if (existingUser) {
            throw new Error('User already exists');
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          let householdId;

          if (householdCode) {
            // Join existing household
            const household = households.find(h => h.code === householdCode);
            if (!household) {
              throw new Error('Invalid household code');
            }
            householdId = household.id;
            household.members.push(email);
            saveHouseholds(households);
          } else {
            // Create new household
            householdId = `hh_${Date.now()}`;
            const newHouseholdCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            households.push({
              id: householdId,
              code: newHouseholdCode,
              members: [email],
              createdAt: new Date().toISOString(),
              data: {
                accounts: [],
                debts: [],
                budgets: {},
                plaidConnections: [],
                partnershipData: { name: 'Investment Partnership', ownershipPct: 0, quarterlyReports: [] },
                monthlyIncome: 0,
              }
            });
            saveHouseholds(households);
          }

          // Create user
          const newUser = {
            id: `user_${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            password: hashedPassword,
            householdId,
            createdAt: new Date().toISOString(),
          };
          users.push(newUser);
          saveUsers(users);

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            householdId: newUser.householdId,
          };
        } else {
          // Login
          const user = users.find(u => u.email === email);
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            householdId: user.householdId,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.householdId = user.householdId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.householdId = token.householdId;

      // Get household info
      const households = getHouseholds();
      const household = households.find(h => h.id === token.householdId);
      if (household) {
        session.user.householdCode = household.code;
        session.user.householdMembers = household.members;
      }

      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-in-production',
});

export { handler as GET, handler as POST };
