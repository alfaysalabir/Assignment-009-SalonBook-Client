import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME || "salonbook");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),

  emailAndPassword: { enabled: true, minPasswordLength: 6 },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      // input:false -> nobody can send these fields from the browser (no self-made admins!)
      role: { type: "string", required: false, defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      phone: { type: "string", required: false },
    },
  },

  // Password rule: at least one uppercase and one lowercase letter (also checked on the server)
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password || "";
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain an uppercase and a lowercase letter",
          });
        }
      }
    }),
  },

  plugins: [
    // Creates the JWT that the Express server verifies
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.BETTER_AUTH_URL,
        expirationTime: "1h",
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
    nextCookies(), // keep this last
  ],
});
