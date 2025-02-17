import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role: String;
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        role: String;
    }
}