import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;

      accessToken: string;

      expires_at?: number;

      role_id: number;
      role_name?: string;
      expert_id?: number;

      profile_picture?: string;
      phone_number?: string;

      user_developer_relationship?: {
        user_id: number;
        developer_id: number;
        role: string;
        created_at: string;
        updated_at: string;
      } | null;
    } & DefaultSession["user"];

    expires: string;
    error?: string;
  }

  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;

    expires_in?: number;
    refresh_expires_in?: number;

    expires_at?: number;

    role_id?: number;
    role_name?: string;
    expert_id?: number;

    profile_picture?: string;
    phone_number?: string;

    user_developer_relationship?: {
      user_id: number;
      developer_id: number;
      role: string;
      created_at: string;
      updated_at: string;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;

    accessToken?: string;
    refreshToken?: string;

    expires_at?: number;

    role_id?: number;
    role_name?: string;

    profile_picture?: string;
    phone_number?: string;

    user_developer_relationship?: {
      user_id: number;
      developer_id: number;
      role: string;
      created_at: string;
      updated_at: string;
    } | null;

    error?: string;
  }
}
