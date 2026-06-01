import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD;

export interface Message {
  message_id?: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  message_type: string;
  created_at: string;
  updated_at?: string;
  read_at?: string | null;
}

export interface MessageData {
  sender_id: number;
  receiver_id: number;
  message_text: string;
  message_type: string;
  entity_type?: string;
  entity_id?: number;
}

export interface ChatContact {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  profile_picture?: string | null;
  last_message?: Message;
  unread_count?: number;
}

export interface MessageSender {
  sender_id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
}

export interface MessageReceiver {
  receiver_id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
}

export interface AllChatMessage {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  message_type: string;
  attachment_url: string | null;
  is_read: number;
  created_at: string;
  updated_at: string;
  sent_at: string;
  entity_type: string;
  entity_id: number;
  is_deleted: number;
  deleted_at: string | null;
  role_sender_name: string;
  role_receiver_name: string;
  sender: MessageSender;
  receiver: MessageReceiver;
  last_message: null;
}

export interface allchats {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  profile_picture?: string | null;
  last_message?: Message;
  unread_count?: number;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

// Fetch chat history (contacts) for the admin
export async function fetchChatHistory(
  adminId: string | number,
  token: string
): Promise<ChatContact[]> {
  try {
    const response = await axios.get(`${API_URL}/chat/contacts/${adminId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}

// Fetch messages between admin and a specific client
export async function fetchChatClientHistory(
  adminId: string | number,
  clientId: number,
  token: string
): Promise<Message[]> {
  try {
    const response = await axios.get(
      `${API_URL}/chat/history/${adminId}/${clientId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data || response.data || [];
  } catch (error) {
    console.error("Error fetching client messages:", error);
    throw error;
  }
}

// Send a new message
export async function sendMessage(
  token: string,
  messageData: MessageData
): Promise<Message> {
  try {
    const response = await axios.post(`${API_URL}/chat/send`, messageData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Mark messages as read
export async function markAsRead(
  clientId: number,
  adminId: string | number,
  token: string
): Promise<void> {
  try {
    await axios.post(
      `${API_URL}/chat/mark-as-read/${clientId}/${adminId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
}

// Fetch all chats history for admins
export const fetchAllChatsHistory = async (
  token: string
): Promise<allchats[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/chat/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = (await response.json()) as ApiResponse<AllChatMessage[]>;

    if (data.status !== "success") {
      throw new Error(data.message || "Failed to fetch chat history");
    }

    // Transform messages into contacts
    const contactsMap = new Map<number, allchats>();

    data.data.forEach((msg) => {
      // Determine the contact (the other person in the conversation)
      const contact = msg.sender.role !== "admin" ? msg.sender : msg.receiver;
      const contactId =
        msg.sender.role !== "admin" ? msg.sender_id : msg.receiver_id;

      if (!contactsMap.has(contactId)) {
        // Split name into first and last name
        const nameParts = contact.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        contactsMap.set(contactId, {
          user_id: contactId,
          first_name: firstName,
          last_name: lastName,
          email: contact.email,
          phone_number: null,
          profile_picture: contact.avatar,
          last_message: {
            message_id: msg.message_id,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            message_text: msg.message_text,
            message_type: msg.message_type,
            created_at: msg.created_at,
            updated_at: msg.updated_at,
            read_at: msg.is_read ? msg.updated_at : null,
          },
          unread_count: 0,
        });
      } else {
        // Update with the latest message if this one is newer
        const existing = contactsMap.get(contactId)!;
        if (
          new Date(msg.created_at) > new Date(existing.last_message!.created_at)
        ) {
          existing.last_message = {
            message_id: msg.message_id,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            message_text: msg.message_text,
            message_type: msg.message_type,
            created_at: msg.created_at,
            updated_at: msg.updated_at,
            read_at: msg.is_read ? msg.updated_at : null,
          };
        }
      }

      // Count unread messages
      if (msg.is_read === 0 && msg.sender.role !== "admin") {
        const contact = contactsMap.get(contactId)!;
        contact.unread_count = (contact.unread_count || 0) + 1;
      }
    });

    return Array.from(contactsMap.values());
  } catch (error) {
    throw new Error(
      `Chat history fetch failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
