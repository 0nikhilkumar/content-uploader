import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password");
                }

                try {
                    await connectToDatabase();
                    const user = await User.findOne({email: credentials.email});
                    console.log(user);

                    if(!user){
                        throw new Error("No User found")
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if(!isValid){
                        throw new Error("Invalid password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        bio: user.bio,
                    };

                } catch (error) {
                    throw error;
                }
            },
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.bio = user.bio;
            }
            return token;
        },
        async session({session, token}){
            if(session.user) {
                session.user.id = token.id as string;
                session.user.firstname = token.firstname as string;
                session.user.lastname = token.lastname as string;
                session.user.bio = token.bio as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}
