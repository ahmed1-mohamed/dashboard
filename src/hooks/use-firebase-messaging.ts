import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase-config";

export interface FirebaseMessage {
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export function useFirebaseMessaging() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [message, setMessage] = useState<FirebaseMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || !messaging) return;

    // Store messaging instance to help TypeScript understand it's defined
    const messagingInstance = messaging;

    const requestPermissionAndGetToken = async () => {
      try {
        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          console.log("Notification permission granted.");

          // Get FCM token
          const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
          if (!vapidKey) {
            console.warn("VAPID key not configured");
            return;
          }

          const token = await getToken(messagingInstance, { vapidKey });
          if (token) {
            console.log("FCM Token:", token);
            setFcmToken(token);
          } else {
            console.log("No registration token available.");
          }
        } else {
          console.log("Notification permission denied.");
          setError("Notification permission denied");
        }
      } catch (err) {
        console.error("Error getting FCM token:", err);
        setError(
          err instanceof Error ? err.message : "Failed to get FCM token"
        );
      }
    };

    requestPermissionAndGetToken();

    // Listen for foreground messages
    const unsubscribe = onMessage(messagingInstance, (payload) => {
      console.log("Foreground message received:", payload);
      setMessage(payload as FirebaseMessage);

      // Show browser notification for foreground messages
      if (payload.notification) {
        new Notification(payload.notification.title || "New Message", {
          body: payload.notification.body,
          icon: payload.notification.image || "/next.svg",
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { fcmToken, message, error };
}
