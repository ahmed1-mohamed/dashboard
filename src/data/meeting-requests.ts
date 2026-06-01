// src/data/backend-comms/meeting-requests.ts
export async function confirmMeetingRequest(
  id: number | string,
  token: string,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/meeting-requests/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ status: "active" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // adjust if using NextAuth
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to confirm meeting request");
  }

  return res;
}

export async function cancelMeetingRequest(id: number | string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/meeting-requests/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to cancel meeting request");
  }

  return res;
}
