import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        "fcm-token": { label: "FCM Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const fcmToken = credentials?.["fcm-token"] || "";
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Context": "dashboard",
                "fcm-token": fcmToken,
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
                "fcm-token": fcmToken,
              }),
            },
          );

          const response = await res.json();
          if (!res.ok) throw new Error(response.message || "Login failed");

          const userData = response.data;

          return {
            id: String(userData?.user_id),
            email: userData?.email,
            name: `${userData?.first_name} ${userData?.last_name}`,
            accessToken: userData?.access_token,
            refreshToken: userData?.refresh_token,
            expires_in: Number(userData?.expires_in),
            refresh_expires_in: Number(userData?.refresh_expires_in),

            role_id: userData?.role?.role_id,
            role_name: userData?.role?.role_name,
            expert_id: userData?.user_expert_relationship?.expert_id,

            profile_picture: userData?.profile_picture,
            phone_number: userData?.phone_number,

            user_developer_relationship: userData?.user_developer_relationship,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Login failed",
          );
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (account && user) {
        const cookieStore = await cookies();

        if (user.refreshToken) {
          cookieStore.set("refresh_token", user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: user.refresh_expires_in ?? 60 * 60 * 24,
          });
        }

        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,

          expires_at: Math.floor(Date.now() / 1000) + (user.expires_in ?? 3600),

          name: user.name,
          email: user.email,

          role_id: user.role_id,
          role_name: user.role_name,
          expert_id: user.expert_id,

          profile_picture: user.profile_picture,
          phone_number: user.phone_number,

          user_developer_relationship: user.user_developer_relationship,
        };
      }

      if (trigger === "update" && session) {
        return {
          ...token,
          accessToken: session.user?.accessToken ?? token.accessToken,
          expires_at: session.user?.expires_at ?? token.expires_at,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error as string;
        return session;
      }

      session.user = {
        id: token.id as string,
        accessToken: token.accessToken as string,

        expires_at: token.expires_at as number,

        role_id: token.role_id as number,
        role_name: token.role_name as string,
        expert_id: token.expert_id as number,

        name: token.name as string,
        email: token.email as string,

        profile_picture: token.profile_picture as string,
        phone_number: token.phone_number as string,

        user_developer_relationship: token.user_developer_relationship,
      };

      if (token.expires_at) {
        session.expires = new Date(
          Number(token.expires_at) * 1000,
        ).toISOString();
      }

      return session;
    },
  },
  events: {
    async signOut() {
      const cookieStore = await cookies();
      cookieStore.delete("refresh_token");
    },
  },
};
