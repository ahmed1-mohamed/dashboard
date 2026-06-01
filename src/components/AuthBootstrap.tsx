"use client";

import { apiClient } from "@/lib/apiClient";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Loading from "@/app/loading";

export default function AuthBootstrap({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status, update } = useSession();
    const [isTokenReady, setIsTokenReady] = useState(false);

    const initializedTokenRef = useRef<string | null>(null);

    const sessionRef = useRef(session);
    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    useEffect(() => {
        if (status === "unauthenticated") {
            apiClient.clearAuthToken();
            initializedTokenRef.current = null;
            setIsTokenReady(true);
            return;
        }

        if (status !== "authenticated") {
            setIsTokenReady(false);
            return;
        }

        if (
            session?.user?.accessToken &&
            session.user.accessToken === initializedTokenRef.current
        ) {
            setIsTokenReady(true);
            return;
        }

        const initializeToken = async () => {
            const accessToken = session?.user?.accessToken;
            const expiresAt = session?.user?.expires_at;

            if (!accessToken || !expiresAt) {
                apiClient.clearAuthToken();
                await signOut({ redirect: false });
                window.location.href = "/";
                return;
            }

            // Ensure apiClient has the current token before marking ready
            apiClient.setAuthToken(accessToken, expiresAt);

            apiClient.setSessionUpdateCallback(
                async ({ accessToken: newToken, expiresAt: newExpiry }) => {
                    initializedTokenRef.current = newToken;
                    await update({
                        ...sessionRef.current,
                        user: {
                            ...sessionRef.current?.user,
                            accessToken: newToken,
                            expires_at: newExpiry,
                        },
                    });
                },
            );

            setIsTokenReady(true);
        };

        initializeToken();
    }, [session?.user?.accessToken, session?.user?.expires_at, status]);

    if (status === "loading" || !isTokenReady) {
        return <Loading/>;
    }

    return <>{ children } </>;
}
