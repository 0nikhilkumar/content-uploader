import { DefaultSession } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        firstname: string;
        lastname: string;
        bio: string;
    }

    interface Session {
        user: {
            id: string;
            firstname: string;
            lastname: string;
            bio: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        firstname: string;
        lastname: string;
        bio: string;
    }
}