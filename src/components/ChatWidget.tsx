"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETINGS = [
  "Spring slots are filling up. Is your pool opening scheduled yet?",
  "Pool season is almost here. Is your pool ready?",
  "Hey! We're booking pool openings now. Spots go fast once it warms up.",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show proactive greeting after 4 seconds
  useEffect(() => {
    const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(g);

    const timer = setTimeout(() => {
      setShowGreetingBubble(true);
    }, 4000);

    // Auto-hide greeting after 10 seconds
    const hideTimer = setTimeout(() => {
      setShowGreetingBubble(false);
    }, 14000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Listen for external open-chat events
  useEffect(() => {
    const handler = (e: Event) => {
      const context = (e as CustomEvent).detail?.context;
      if (context === "quote") {
        setMessages([
          {
            role: "assistant",
            content:
              "Let's get you a quote. What service do you need — pool opening, weekly cleaning, or something else?",
          },
        ]);
      }
      setOpen(true);
    };
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setShowGreetingBubble(false);
      // Add greeting as first message if no messages yet
      if (messages.length === 0) {
        setMessages([{ role: "assistant", content: greeting }]);
      }
    }
  }, [open, greeting, messages.length]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Whoops, something went sideways. Give Brandon a call at (302) 496-6367 — he's got you.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Proactive greeting bubble */}
      {showGreetingBubble && !open && (
        <button
          onClick={() => setOpen(true)}
          className="max-w-[260px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm text-gray-800 shadow-lg border border-gray-100 text-left animate-fade-in cursor-pointer hover:shadow-xl transition-shadow"
        >
          <p>{greeting}</p>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-700 to-cyan-600 px-4 py-3 flex items-center gap-3">
            <Image
              src="/images/logo-mascot.jpg"
              alt="Pool Cleaning Dude"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-white/30"
            />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                Pool Cleaning Dude
              </p>
              <p className="text-sky-200 text-xs">
                Your Pool Dude, at Your Service
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white p-1"
              aria-label="Close chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Image
                    src="/images/logo-mascot.jpg"
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full mr-2 mt-1 shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sky-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <Image
                  src="/images/logo-mascot.jpg"
                  alt=""
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full mr-2 mt-1 shrink-0"
                />
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="border-t border-gray-100 px-3 py-2 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about pool service..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-full bg-sky-600 p-2 text-white hover:bg-sky-700 transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Mascot bubble button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-16 h-16 rounded-full shadow-lg border-2 border-white overflow-hidden hover:scale-110 transition-transform ${open ? "ring-2 ring-sky-400" : ""}`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <Image
          src="/images/logo-mascot.jpg"
          alt="Chat with Pool Cleaning Dude"
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
