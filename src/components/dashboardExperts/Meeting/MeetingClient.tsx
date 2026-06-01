"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import AC, { AgoraChat } from "agora-chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  User,
  CircleStop,
  Circle,
  MessageSquare,
  X,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { useToken } from "@/contexts/SessionProviderWrapper";

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const AGORA_CHAT_APP_KEY = process.env.NEXT_PUBLIC_AGORA_CHAT_APP_KEY!;

interface RemoteUser {
  uid: string | number;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
  hasVideo: boolean;
  hasAudio: boolean;
}
interface ChatMessage {
  id: string;
  from: string;
  text: string;
  isMine: boolean;
  timestamp: number;
}

function RemoteVideoTile({ user }: { user: RemoteUser }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (user.videoTrack && containerRef.current)
      user.videoTrack.play(containerRef.current);
    return () => {
      user.videoTrack?.stop();
    };
  }, [user.videoTrack, user.uid]);

  return (
    <div className="w-full h-full bg-zinc-900 rounded-xl overflow-hidden relative">
      <div ref={containerRef} className="w-full h-full" />
      {!user.hasVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <span className="text-sm">Camera off</span>
        </div>
      )}
    </div>
  );
}

function LocalVideoPreview({
  track,
  isVideoOn,
}: {
  track: ICameraVideoTrack | null;
  isVideoOn: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (track && containerRef.current && isVideoOn)
      track.play(containerRef.current);
    return () => {
      track?.stop();
    };
  }, [track, isVideoOn]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-zinc-800 rounded-xl overflow-hidden relative flex items-center justify-center"
    >
      {!isVideoOn && (
        <div className="flex flex-col items-center gap-2 text-zinc-400">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <span className="text-xs">You (camera off)</span>
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
        You
      </span>
    </div>
  );
}

function ChatPanel({
  messages,
  onSend,
  onClose,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    const text = draft.trim();
    console.log("Submitting chat message:", text);
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <div className="flex flex-col w-80 bg-zinc-900 border-l border-zinc-800 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 flex-shrink-0">
        <span className="text-sm font-medium text-white">In-call chat</span>
        <Button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-zinc-500 text-center mt-8">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 ${msg.isMine ? "items-end" : "items-start"}`}
          >
            <span className="text-xs text-zinc-500">
              {msg.isMine ? "You" : msg.from}
            </span>
            <div
              className={`px-3 py-2 rounded-2xl text-sm max-w-[90%] break-words ${
                msg.isMine
                  ? "bg-violet-600 text-white rounded-tr-sm"
                  : "bg-zinc-700 text-zinc-100 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-3 border-t border-zinc-800 flex-shrink-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder="Message…"
          className="flex-1 bg-zinc-800 text-sm text-white placeholder-zinc-500 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500"
        />
        <Button
          onClick={submit}
          disabled={!draft.trim()}
          className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
        >
          <Send className="w-4 h-4 text-white" />
        </Button>
      </div>
    </div>
  );
}

export default function MeetingClient() {
  const params = useParams();
  const router = useRouter();
  const channelName = params?.channel as string;

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<ICameraVideoTrack | null>(null);

  const chatClientRef = useRef<AgoraChat.Connection | null>(null);
  const chatUserIdRef = useRef<string>("");
  const chatGroupIdRef = useRef<string>("");

  const { userId } = useToken();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [connectionState, setConnectionState] = useState<string>("CONNECTING");
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawIntervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Chat helpers
  const appendMessage = useCallback((msg: Omit<ChatMessage, "id">) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `${Date.now()}-${Math.random()}` },
    ]);
  }, []);

  const initChat = useCallback(
    async (chatToken: string, userId: string) => {
      if (!AGORA_CHAT_APP_KEY || !AGORA_CHAT_APP_KEY.includes("#")) {
        console.error("Invalid AppKey format. Should be OrgName#AppName");
        return;
      }

      chatUserIdRef.current = String(userId);
      chatGroupIdRef.current = channelName;

      const conn = new AC.connection({ appKey: AGORA_CHAT_APP_KEY });
      chatClientRef.current = conn;

      conn.addEventHandler("MEETING_CHAT", {
        onTextMessage: (message) => {
          if (message.from && message.from !== String(userId)) {
            chatGroupIdRef.current = String(message.from);
          }
          appendMessage({
            from: message.from ?? "Participant",
            text: (message as any).msg ?? "",
            isMine: false,
            timestamp: Date.now(),
          });
          setIsChatOpen((open) => {
            return open;
          });
        },
        onError: (err) => {
          console.error("Agora Chat error", err);
          toast.error("Chat error: " + JSON.stringify(err));
        },
      });

      try {
        await conn.open({ user: userId, agoraToken: chatToken });
        console.log("Chat connected as:", userId);
      } catch (err) {
        console.error("Chat login failed:", err);
        toast.error("Chat login failed");
      }
    },
    [channelName, appendMessage],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const conn = chatClientRef.current;

      const targetId = chatGroupIdRef.current;

      if (!conn || !conn.isOpened()) {
        toast.error("Chat not connected");
        return;
      }

      if (!targetId || remoteUsers.length === 0) {
        appendMessage({
          from: "System",
          text: "Error: No user is currently in the meeting to receive your message.",
          isMine: false,
          timestamp: Date.now(),
        });
        return;
      }

      const msg = AC.message.create({
        type: "txt",
        msg: text,
        to: String(targetId),
        chatType: "singleChat",
      });

      try {
        await conn.send(msg);
        appendMessage({
          from: chatUserIdRef.current,
          text,
          isMine: true,
          timestamp: Date.now(),
        });
      } catch (err) {
        toast.error("Failed to send message");
      }
    },
    [appendMessage, remoteUsers],
  );

  useEffect(() => {
    let isCancelled = false;

    const join = async () => {
      if (!channelName) {
        setError("Invalid meeting link — no channel specified.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await DashboardExpertService.agoraCall(channelName);
        const { token, chatToken } = res.data as {
          token: string;
          chatToken: string;
        };

        if (!token) throw new Error("No token returned from server");
        if (isCancelled) return;

        // RTC setup
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
        clientRef.current = client;

        client.on("connection-state-change", (cur) => setConnectionState(cur));

        client.on("user-published", async (user, mediaType) => {
          try {
            await client.subscribe(user, mediaType);
          } catch {}
          if (!chatGroupIdRef.current) {
            chatGroupIdRef.current = String(user.uid);
          }
          setRemoteUsers((prev) => {
            const existing = prev.find((u) => u.uid === user.uid);
            if (existing) {
              return prev.map((u) =>
                u.uid === user.uid
                  ? {
                      ...u,
                      videoTrack:
                        mediaType === "video" ? user.videoTrack : u.videoTrack,
                      audioTrack:
                        mediaType === "audio" ? user.audioTrack : u.audioTrack,
                      hasVideo: mediaType === "video" ? true : u.hasVideo,
                      hasAudio: mediaType === "audio" ? true : u.hasAudio,
                    }
                  : u,
              );
            }
            return [
              ...prev,
              {
                uid: user.uid,
                videoTrack: mediaType === "video" ? user.videoTrack : undefined,
                audioTrack: mediaType === "audio" ? user.audioTrack : undefined,
                hasVideo: mediaType === "video",
                hasAudio: mediaType === "audio",
              },
            ];
          });
          if (mediaType === "audio") user.audioTrack?.setVolume(100);
        });

        client.on("user-unpublished", (user, mediaType) => {
          setRemoteUsers((prev) =>
            prev.map((u) =>
              u.uid === user.uid
                ? {
                    ...u,
                    videoTrack:
                      mediaType === "video" ? undefined : u.videoTrack,
                    audioTrack:
                      mediaType === "audio" ? undefined : u.audioTrack,
                    hasVideo: mediaType === "video" ? false : u.hasVideo,
                    hasAudio: mediaType === "audio" ? false : u.hasAudio,
                  }
                : u,
            ),
          );
        });

        client.on("user-left", (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          if (chatGroupIdRef.current === String(user.uid)) {
            chatGroupIdRef.current = "";
          }
          toast.info("The other participant has left the call.");
        });

        await client.join(AGORA_APP_ID, channelName, token, userId || null);

        if (client.remoteUsers.length >= 1) {
          const currentRemoteUsers = client.remoteUsers;
          if (currentRemoteUsers.length > 1) {
            setError("This meeting is full (maximum 2 participants).");
            await client.leave();
            setLoading(false);
            return;
          }
        }

        if (client.remoteUsers.length > 0) {
          chatGroupIdRef.current = String(client.remoteUsers[0].uid);
        }

        for (const remoteUser of client.remoteUsers) {
          if (remoteUser.videoTrack)
            await client.subscribe(remoteUser, "video");
          if (remoteUser.audioTrack)
            await client.subscribe(remoteUser, "audio");
        }

        const [micTrack, camTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks(
            {
              AEC: true,
              ANS: true,
              AGC: true,
              encoderConfig: "speech_standard",
            },
            {
              encoderConfig: {
                width: 1280,
                height: 720,
                frameRate: 30,
                bitrateMin: 1000,
                bitrateMax: 3000,
              },
            },
          );

        micTrack.setEnabled(false);
        camTrack.setEnabled(false);

        localAudioRef.current = micTrack;
        localVideoRef.current = camTrack;
        await client.publish([micTrack, camTrack]);

        // initialize chat
        if (chatToken && userId && !isCancelled) {
          await initChat(chatToken, String(userId));

          // also, if remote user exists, override chatGroupIdRef
          if (client.remoteUsers.length > 0) {
            chatGroupIdRef.current = String(client.remoteUsers[0].uid);
          }
        }
      } catch (err: any) {
        if (isCancelled) return;
        if (err?.code === "PERMISSION_DENIED") {
          setError(
            "Camera/microphone access denied. Please allow permissions and try again.",
          );
        } else {
          setError(err?.message ?? "Failed to start video call.");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    join();

    return () => {
      isCancelled = true;
      localAudioRef.current?.close();
      localVideoRef.current?.close();
      clientRef.current?.leave();
      clientRef.current = null;
      chatClientRef.current?.close();
      chatClientRef.current = null;
    };
  }, [channelName, initChat]);

  // Recording
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const localVideo = document.createElement("video");
    const remoteVideo = document.createElement("video");
    if (localVideoRef.current) {
      localVideo.srcObject = new MediaStream([
        localVideoRef.current.getMediaStreamTrack(),
      ]);
      localVideo.muted = true;
      localVideo.play();
    }
    if (remoteUsers[0]?.videoTrack) {
      remoteVideo.srcObject = new MediaStream([
        remoteUsers[0].videoTrack.getMediaStreamTrack(),
      ]);
      remoteVideo.play();
    }
    const draw = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (remoteVideo.readyState >= 2)
        ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height);
      if (localVideo.readyState >= 2)
        ctx.drawImage(
          localVideo,
          canvas.width - 320,
          canvas.height - 180,
          300,
          170,
        );
    };
    drawIntervalRef.current = window.setInterval(draw, 33);
    const canvasStream = canvas.captureStream(30);
    const audioContext = new AudioContext();
    const dest = audioContext.createMediaStreamDestination();
    remoteUsers.forEach((u) => {
      if (u.audioTrack) {
        const source = audioContext.createMediaStreamSource(
          new MediaStream([u.audioTrack.getMediaStreamTrack()]),
        );
        source.connect(dest);
      }
    });
    if (localAudioRef.current) {
      const source = audioContext.createMediaStreamSource(
        new MediaStream([localAudioRef.current.getMediaStreamTrack()]),
      );
      source.connect(dest);
    }
    const combined = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);
    const recorder = new MediaRecorder(combined, {
      mimeType: "video/webm;codecs=vp8,opus",
    });
    recordedChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meeting-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    toast.success("Recording started");
  };

  const stopRecording = () => {
    if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    toast.success("Recording saved");
  };

  // Media toggles
  const toggleMic = async () => {
    if (!localAudioRef.current) return;
    await localAudioRef.current.setEnabled(!isMicOn);
    setIsMicOn((v) => !v);
  };

  const toggleVideo = async () => {
    if (!localVideoRef.current) return;
    await localVideoRef.current.setEnabled(!isVideoOn);
    setIsVideoOn((v) => !v);
  };

  const confirmLeave = () => setShowLeaveDialog(true);

  const leaveCall = async () => {
    setShowLeaveDialog(false);
    localAudioRef.current?.close();
    localVideoRef.current?.close();
    await clientRef.current?.leave();
    chatClientRef.current?.close();
    router.push("/setting-profile?tab=sessions");
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
        <p className="text-zinc-400 text-sm">Connecting to session…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-red-400 text-sm text-center max-w-sm">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/setting-profile?tab=sessions")}
          className="text-black bg-white"
        >
          Go back
        </Button>
      </div>
    );
  }

  const primaryRemoteUser = remoteUsers[0];

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      <canvas ref={canvasRef} width={1280} height={720} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/80 backdrop-blur border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`text-xs capitalize border-0 ${connectionState === "CONNECTED" ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block" />
            {connectionState === "CONNECTED" ? "Live" : connectionState}
          </Badge>
        </div>
        <span className="text-xs text-zinc-500">
          {remoteUsers.length} participant{remoteUsers.length !== 1 ? "s" : ""}{" "}
          connected
        </span>
      </div>

      {/* Media controls */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 relative p-4 flex gap-4 overflow-hidden">
          <div className="flex-1 rounded-2xl overflow-hidden bg-zinc-900 relative">
            {primaryRemoteUser ? (
              <RemoteVideoTile user={primaryRemoteUser} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                <User className="w-16 h-16" />
                <p className="text-sm">Waiting for the consultant to join…</p>
              </div>
            )}
          </div>

          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 ${
              isPiP
                ? "absolute bottom-8 right-8 w-44 h-32 cursor-pointer z-20"
                : "w-56 h-44 flex-shrink-0"
            }`}
            onClick={() => isPiP && setIsPiP(false)}
          >
            <LocalVideoPreview
              track={localVideoRef.current}
              isVideoOn={isVideoOn}
            />
          </div>

          <button
            onClick={() => setIsPiP((v) => !v)}
            className="absolute top-6 right-6 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition z-10"
            title={isPiP ? "Expand local video" : "Minimise local video"}
          >
            {isPiP ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>

          {remoteUsers.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {remoteUsers.slice(1).map((u) => (
                <div
                  key={u.uid}
                  className="w-28 h-20 rounded-xl overflow-hidden border border-zinc-700 shadow-lg"
                >
                  <RemoteVideoTile user={u} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Chat panel */}
        {isChatOpen && (
          <ChatPanel
            messages={messages}
            onSend={sendMessage}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-6 py-5 bg-zinc-900/80 backdrop-blur border-t border-zinc-800">
        {/* recording button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
              : "bg-zinc-700 hover:bg-zinc-600 text-white"
          }`}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? (
            <CircleStop className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* microphone button */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isMicOn
              ? "bg-zinc-700 hover:bg-zinc-600 text-white"
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
          title={isMicOn ? "Mute" : "Unmute"}
        >
          {isMicOn ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </button>

        {/* video button */}
        <button
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isVideoOn
              ? "bg-zinc-700 hover:bg-zinc-600 text-white"
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
          title={isVideoOn ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </button>

        {/* chat button */}
        <button
          onClick={isChatOpen ? () => setIsChatOpen(false) : openChat}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isChatOpen
              ? "bg-violet-600 hover:bg-violet-500 text-white"
              : "bg-zinc-700 hover:bg-zinc-600 text-white"
          }`}
          title="Toggle chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* leave call button */}
        <button
          onClick={confirmLeave}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-lg shadow-red-900/30"
          title="Leave call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Leave the meeting?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              You will be disconnected from the current session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
              Stay
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={leaveCall}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
