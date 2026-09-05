import { Handler } from "@netlify/functions";
import * as crypto from "crypto";

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  is_active: boolean;
}

interface AuthRequest {
  action: "login" | "logout" | "session" | "register";
  email?: string;
  password?: string;
  token?: string;
}

// In production, store sessions in Netlify Durable Objects or a database
// For now, we'll use in-memory sessions (note: this will be lost on function restart)
const sessions = new Map<string, { user: AdminUser; expiresAt: number }>();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function createSession(user: AdminUser): string {
  const token = generateToken();
  sessions.set(token, {
    user,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  return token;
}

function verifySession(token: string): AdminUser | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.user;
}

export const handler: Handler = async (event) => {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const action = body.action || "session";

    switch (action) {
      case "login": {
        const { email, password } = body;

        if (!email || !password) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Email and password required" }),
          };
        }

        // TODO: In production, query the database for the admin user
        // For demo purposes, we're using a hardcoded credential
        const adminEmail = process.env.ADMIN_EMAIL || "admin@cherokee-works.local";
        const adminPasswordHash =
          process.env.ADMIN_PASSWORD_HASH ||
          hashPassword("changeme123");

        if (email !== adminEmail || hashPassword(password) !== adminPasswordHash) {
          return {
            statusCode: 401,
            body: JSON.stringify({ error: "Invalid credentials" }),
          };
        }

        // Create mock admin user
        const user: AdminUser = {
          id: "admin-001",
          email: adminEmail,
          name: "Site Administrator",
          role: "admin",
          is_active: true,
        };

        const token = createSession(user);

        return {
          statusCode: 200,
          headers: {
            "Set-Cookie": `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
          },
          body: JSON.stringify({
            success: true,
            token,
            user,
          }),
        };
      }

      case "logout": {
        const token = event.headers.authorization?.replace("Bearer ", "");
        if (token) {
          sessions.delete(token);
        }

        return {
          statusCode: 200,
          headers: {
            "Set-Cookie": "admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
          },
          body: JSON.stringify({ success: true }),
        };
      }

      case "session": {
        const token =
          event.headers.authorization?.replace("Bearer ", "") ||
          event.headers.cookie?.split("admin_token=")[1]?.split(";")[0];

        if (!token) {
          return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized" }),
          };
        }

        const user = verifySession(token);
        if (!user) {
          return {
            statusCode: 401,
            body: JSON.stringify({ error: "Session expired" }),
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ user, authenticated: true }),
        };
      }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid action" }),
        };
    }
  } catch (error) {
    console.error("Auth error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
