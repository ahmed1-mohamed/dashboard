"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  MessageSquare,
  Shield,
} from "lucide-react";
import {
  fetchChatHistory,
  fetchChatClientHistory,
  fetchAllChatsHistory,
  sendMessage,
  markAsRead,
  Message,
  MessageData,
  ChatContact,
  allchats,
} from "@/services/msgchat";
import { format } from "date-fns";

const avatarColors = [
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-cyan-500",
];

export default function ChatPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"my" | "admin">("my");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);

  const adminId = session?.user?.id as string;
  const token = session?.user?.accessToken as string;

  // Fetch contacts
  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ["chatHistory", adminId],
    queryFn: () => fetchChatHistory(adminId, token),
    enabled: !!adminId && !!token && activeTab === "my",
  });

  // Fetch admin chats
  const { data: adminChats = [], isLoading: isLoadingAdminChats } = useQuery({
    queryKey: ["allChatsHistory", token],
    queryFn: () => fetchAllChatsHistory(token),
    enabled: !!token && activeTab === "admin",
  });

  // Fetch messages for selected client
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chatClientHistory", adminId, selectedClientId],
    queryFn: () => fetchChatClientHistory(adminId, selectedClientId!, token),
    enabled: !!adminId && !!selectedClientId && !!token,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: MessageData) => sendMessage(token, messageData),
    onSuccess: (sentMessage) => {
      queryClient.setQueryData(
        ["chatClientHistory", adminId, selectedClientId],
        (old: Message[] = []) => [
          ...old,
          {
            ...sentMessage,
            created_at: new Date().toISOString(),
          },
        ]
      );

      queryClient.setQueryData(
        ["chatHistory", adminId],
        (old: ChatContact[] = []) => {
          return old.map((contact) =>
            contact.user_id === selectedClientId
              ? { ...contact, last_message: sentMessage }
              : contact
          );
        }
      );
      setMessageInput("");
    },
  });

  // Real-time Pusher integration
  useEffect(() => {
    if (!selectedClientId || !adminId || !token) return;

    try {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
        channelAuthorization: {
          endpoint: `${process.env.NEXT_PUBLIC_API_URL_WITHOUT_DASHBOARD}/broadcasting/auth`,
          transport: "ajax",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      });

      const minId = Math.min(Number(selectedClientId), Number(adminId));
      const maxId = Math.max(Number(selectedClientId), Number(adminId));
      const channelName = `private-chat-${minId}-${maxId}`;

      const channel = pusher.subscribe(channelName);

      channel.bind("message.sent", (msg: Message) => {
        if (Number(msg.sender_id) !== Number(adminId)) {
          queryClient.setQueryData(
            ["chatClientHistory", adminId, selectedClientId],
            (old: Message[] = []) => [...old, msg]
          );

          queryClient.setQueryData(
            ["chatHistory", adminId],
            (old: ChatContact[] = []) => {
              return old.map((contact) =>
                contact.user_id === msg.sender_id
                  ? { ...contact, last_message: msg }
                  : contact
              );
            }
          );
        }
      });

      pusherRef.current = pusher;

      return () => {
        if (pusherRef.current) {
          pusherRef.current.disconnect();
          pusherRef.current = null;
        }
      };
    } catch (error) {
      console.error("Pusher Error:", error);
    }
  }, [adminId, token, queryClient, selectedClientId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedClientId) return;

    sendMessageMutation.mutate({
      sender_id: Number(adminId),
      receiver_id: selectedClientId,
      message_text: messageInput,
      message_type: "text",
      entity_type: "developer",
      entity_id: 3,
    });
  };

  const handleContactSelect = async (contactId: number) => {
    setSelectedClientId(contactId);
    if (token) {
      try {
        await markAsRead(contactId, adminId, token);
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm");
    } catch {
      return "";
    }
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages?.forEach((message: Message) => {
      const date = format(new Date(message.created_at), "MMM d, yyyy");
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const selectedContact = contacts.find((c) => c.user_id === selectedClientId);
  const selectedAdminContact = adminChats.find(
    (c) => c.user_id === selectedClientId
  );
  const messageGroups = groupMessagesByDate();
  const getAvatarColor = (index: number) =>
    avatarColors[index % avatarColors.length];

  // Get current contacts based on active tab
  const currentContacts = activeTab === "admin" ? adminChats : contacts;
  const currentLoading =
    activeTab === "admin" ? isLoadingAdminChats : isLoadingContacts;

  // Filter contacts based on search
  const filteredContacts = currentContacts.filter(
    (contact) =>
      `${contact.first_name} ${contact.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-full overflow-hidden">
      {/* Header with tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat</h1>
          <div className="flex gap-6 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("my");
                setSelectedClientId(null);
              }}
              className={`pb-3 px-1 relative flex items-center gap-2 ${activeTab === "my"
                  ? "text-teal-600 font-medium"
                  : "text-gray-600"
                }`}
            >
              <MessageSquare className="h-4 w-4" />
              My Chat
              {activeTab === "my" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("admin");
                setSelectedClientId(null);
              }}
              className={`pb-3 px-1 relative flex items-center gap-2 ${activeTab === "admin"
                  ? "text-teal-600 font-medium"
                  : "text-gray-600"
                }`}
            >
              <Shield className="h-4 w-4" />
              Admins Chat
              {activeTab === "admin" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Chats</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {currentLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading contacts...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No contacts found
              </div>
            ) : (
              filteredContacts.map((contact, index) => (
                <button
                  key={contact.user_id}
                  onClick={() => handleContactSelect(contact.user_id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedClientId === contact.user_id ? "bg-gray-50" : ""
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`h-10 w-10 rounded-full ${getAvatarColor(
                        index
                      )} flex items-center justify-center text-white text-xs font-semibold`}
                    >
                      {contact.first_name?.[0]}
                      {contact.last_name?.[0]}
                    </div>
                    {contact.unread_count && contact.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center">
                        {contact.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {contact.first_name} {contact.last_name}
                      </h4>
                      {contact.last_message && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(contact.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1 truncate">
                      {contact.email}
                    </p>
                    {contact.last_message && (
                      <p className="text-xs text-gray-600 truncate">
                        {contact.last_message.message_text}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContact || selectedAdminContact ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-10 w-10 rounded-full ${avatarColors[0]} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
                >
                  {(selectedContact || selectedAdminContact)?.first_name?.[0]}
                  {(selectedContact || selectedAdminContact)?.last_name?.[0]}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {(selectedContact || selectedAdminContact)?.first_name}{" "}
                    {(selectedContact || selectedAdminContact)?.last_name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {(selectedContact || selectedAdminContact)?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <>
                  {Object.entries(messageGroups).map(([date, msgs]) => (
                    <div key={date} className="space-y-4">
                      <div className="text-center">
                        <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                          {date}
                        </span>
                      </div>
                      {msgs.map((message: Message, idx) => {
                        const isOwn =
                          Number(message.sender_id) === Number(adminId);
                        return (
                          <div
                            key={message.message_id || `msg-${idx}`}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"
                              }`}
                          >
                            <div className="max-w-md">
                              {!isOwn && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-900">
                                    {
                                      (selectedContact || selectedAdminContact)
                                        ?.first_name
                                    }
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(message.created_at)}
                                  </span>
                                </div>
                              )}
                              <div
                                className={`rounded-lg px-4 py-2.5 ${isOwn
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                  }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">
                                  {message.message_text}
                                </p>
                              </div>
                              {isOwn && (
                                <div className="flex items-center justify-end gap-2 mt-1">
                                  <span className="text-xs font-medium text-gray-900">
                                    You
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(message.created_at)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <form onSubmit={handleSendMessage}>
                <div className="mb-3">
                  <Input
                    placeholder="Write a reply ..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Bold className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Italic className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Underline className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <List className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Code className="h-3.5 w-3.5" />
                    </Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <LinkIcon className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ImageIcon className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      !messageInput.trim() || sendMessageMutation.isPending
                    }
                    className="bg-teal-600 hover:bg-teal-700 text-white gap-2 h-8"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
