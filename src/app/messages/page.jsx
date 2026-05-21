"use client";

import { useState, useEffect, useRef } from "react";
import useUser from "@/utils/useUser";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import VerificationGate from "../../components/VerificationGate";

export default function MessagesPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        window.location.href = "/account/signin";
      } else {
        fetchProfile();
      }
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (profile) {
      fetchConversations();

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        if (userId) {
          startConversation(userId);
        }
      }
    }
  }, [profile]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      const myProfile = data.profiles?.find((p) => p.user_id === user.id);

      if (!myProfile) {
        window.location.href = "/onboarding";
        return;
      }

      setProfile(myProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchConversations() {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) throw new Error("Failed to fetch conversations");

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }

  async function fetchMessages() {
    if (!selectedConversation) return;

    try {
      const response = await fetch(
        `/api/messages?conversation_id=${selectedConversation.conversation_id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  async function startConversation(otherUserId) {
    try {
      const existingConv = conversations.find(
        (c) => c.other_profile_id === parseInt(otherUserId),
      );

      if (existingConv) {
        setSelectedConversation(existingConv);
        return;
      }

      const response = await fetch(`/api/profiles/${otherUserId}`);
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      const otherProfile = data.profile;

      const newConv = {
        conversation_id: `${profile.id}_${otherProfile.id}`,
        other_profile_id: otherProfile.id,
        other_name: otherProfile.name,
        other_username: otherProfile.x_username,
        last_message: null,
        last_message_time: null,
        unread_count: 0,
      };

      setSelectedConversation(newConv);
      setConversations([newConv, ...conversations]);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver_id: selectedConversation.other_profile_id,
          message: newMessage.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setNewMessage("");
      await fetchMessages();
      await fetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <VerificationGate>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
        <div className="h-screen flex flex-col">
          <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <a
                  href="/dashboard"
                  className="mr-4 text-[#667085] dark:text-white/60 hover:text-[#1DA1F2]"
                >
                  <ArrowLeft size={24} />
                </a>
                <h1 className="text-2xl font-extrabold text-[#111418] dark:text-white">
                  Messages
                </h1>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex">
              <div className="w-80 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="w-12 h-12 text-[#667085] dark:text-white/40 mx-auto mb-3" />
                    <p className="text-[#667085] dark:text-white/60 text-sm">
                      No conversations yet
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.conversation_id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 border-b border-gray-200 dark:border-white/10 hover:bg-[#F8F9FB] dark:hover:bg-[#1E1E1E] transition-colors text-left ${
                        selectedConversation?.conversation_id ===
                        conv.conversation_id
                          ? "bg-[#F8F9FB] dark:bg-[#1E1E1E]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-lg mr-3 flex-shrink-0">
                          {conv.other_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-[#111418] dark:text-white truncate">
                              {conv.other_name}
                            </h3>
                            {conv.unread_count > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-[#1DA1F2] text-white text-xs rounded-full">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#667085] dark:text-white/60 truncate">
                            @{conv.other_username}
                          </p>
                          {conv.last_message && (
                            <p className="text-sm text-[#667085] dark:text-white/40 truncate mt-1">
                              {conv.last_message}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="flex-1 flex flex-col bg-white dark:bg-[#0A0A0A]">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold mr-3">
                          {selectedConversation.other_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111418] dark:text-white">
                            {selectedConversation.other_name}
                          </h3>
                          <p className="text-sm text-[#667085] dark:text-white/60">
                            @{selectedConversation.other_username}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageCircle className="w-12 h-12 text-[#667085] dark:text-white/40 mx-auto mb-3" />
                          <p className="text-[#667085] dark:text-white/60">
                            No messages yet. Start the conversation!
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isMe = msg.sender_id === profile.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-md px-4 py-3 rounded-2xl ${
                                  isMe
                                    ? "bg-[#1DA1F2] text-white"
                                    : "bg-[#F8F9FB] dark:bg-[#1E1E1E] text-[#111418] dark:text-white"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {msg.message}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isMe
                                      ? "text-white/70"
                                      : "text-[#667085] dark:text-white/40"
                                  }`}
                                >
                                  {new Date(msg.created_at).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form
                      onSubmit={sendMessage}
                      className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]"
                    >
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/10 rounded-full bg-[#F8F9FB] dark:bg-[#1E1E1E] text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-semibold rounded-full transition-colors flex items-center"
                        >
                          <Send size={20} className="mr-2" />
                          {sending ? "..." : "Send"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-[#667085] dark:text-white/40 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">
                        No conversation selected
                      </h3>
                      <p className="text-[#667085] dark:text-white/60">
                        Select a conversation to start messaging
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </VerificationGate>
  );
}
