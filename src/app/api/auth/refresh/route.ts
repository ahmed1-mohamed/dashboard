import { refreshAccessToken } from "@/lib/refresh-token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh_token")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token found" },
                { status: 401 }
            );
        }

        const refreshed = await refreshAccessToken(refreshToken);

        if (refreshed.refreshToken !== refreshToken) {
            cookieStore.set("refresh_token", refreshed.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
                maxAge: refreshed.refresh_expires_in ?? 60 * 60 * 24,
            });
        }

        return NextResponse.json({
            accessToken: refreshed.accessToken,
            expires_at: refreshed.expires_at,
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Token refresh failed" },
            { status: 401 }
        );
    }
}
