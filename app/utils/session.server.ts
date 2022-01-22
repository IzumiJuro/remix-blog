import { db } from "./db.server";
import bcrypt from 'bcrypt'
import { createCookieSessionStorage, redirect } from "remix";
import { URLSearchParams } from 'url';
// Login user

export async function login(username: string, password: string) {
  let user = await db.user.findUnique({
    where: {
      username,
    },
  })

  if(!user) return null;

  // Check password
  let isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if(!isCorrectPassword) return null;

  return user;
}

// Register new user
export async function register({username, password}: {username: string, password: string}) {
  let passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
    }
  })
}

let sessionSecret = process.env.SESSION_SECRET;
if(!sessionSecret) {
  throw new Error('No Session Secret');
}

// Create session storage

let storage = createCookieSessionStorage({
  cookie: {
    name: 'remixblog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets:[sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true
  }
})

// Create session
export async function createUserSession(userId:string, redirectTo: string) {
  let session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    }
  })

}

// Get user session
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

// Get logged in user
export async function getUser(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get('userId');
  if(!userId || typeof userId !== 'string') {
    return null;
  }
  try {
    let user = await db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user;
  } catch (error) {
    return null;
  }
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if(!userId || typeof userId !== "string") {
    let searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ]);
    throw redirect(`/auth/login?${searchParams}`);
  }
  return userId;
}

// Log out user and destroy session
export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/auth/logout', {
    headers: {
    'Set-Cookie': await storage.destroySession(session),
    },
  })
}
