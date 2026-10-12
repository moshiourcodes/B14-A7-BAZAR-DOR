import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongodbUrl = process.env.BETTER_AUTH_MONGODB_URL;

if (!mongodbUrl) {
  throw new Error("BETTER_AUTH_MONGODB_URL is missing in .env");
}

const client = new MongoClient(mongodbUrl);
const db = client.db("bazar-dor");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.BAZAR_DOR_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.BAZAR_DOR_GOOGLE_CLIENT_SECRET!,
    },

    github: {
      clientId: process.env.BAZAR_DOR_GITHUB_CLIENT_ID!,
      clientSecret: process.env.BAZAR_DOR_GITHUB_CLIENT_SECRET!,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      disableImplicitLinking: false,
      trustedProviders: ["google", "github"],
    },
  },
});
