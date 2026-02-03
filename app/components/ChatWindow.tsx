"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Chat, Message } from "../utils/mockData";
import { useChatMessages } from "../hooks/useChatMessages";

type ChatWindowProps = {
  activeChat: Chat | null;
  messages: Message[];
};

const demoRecipient = "+51955135507";

export default function ChatWindow({ activeChat, messages }: ChatWindowProps) {
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [sendMessage, setSendMessage] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const replyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatId = activeChat?.id ?? null;
  const initialMessages = useMemo(() => messages, [messages]);
  const { messages: localMessages, appendMessage, setMessages } =
    useChatMessages({ chatId, initialMessages });

  useEffect(() => {
    if (!chatId) {
      setMessages(messages);
    }
  }, [chatId, messages, setMessages]);

  useEffect(() => {
    return () => {
      if (replyTimeout.current) {
        clearTimeout(replyTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!chatId) {
      return;
    }
    const poll = async () => {
      try {
        const response = await fetch(
          `/api/messages?to=${encodeURIComponent(demoRecipient)}`
        );
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { messages?: Message[] };
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch {
        return;
      }
    };
    poll();
    const interval = setInterval(poll, 2500);
    return () => clearInterval(interval);
  }, [chatId, setMessages]);

  const handleSend = async () => {
    if (sendStatus === "sending") {
      return;
    }
    const trimmed = messageInput.trim();
    if (!trimmed) {
      setSendStatus("error");
      setSendMessage("Escribi un mensaje primero.");
      return;
    }
    setSendStatus("sending");
    setSendMessage("");
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          recipients: [demoRecipient],
        }),
      });
      if (!response.ok) {
        setSendStatus("error");
        setSendMessage("No se pudo enviar el mensaje.");
        return;
      }
      const nowTime = new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      appendMessage({
        id: `m-${Date.now()}`,
        from: "me",
        text: trimmed,
        time: nowTime,
      });
      setSendStatus("success");
      setSendMessage(`Mensaje enviado a ${demoRecipient}.`);
      setMessageInput("");
    } catch (error) {
      setSendStatus("error");
      setSendMessage(
        error instanceof Error ? error.message : "Error inesperado."
      );
    }
  };

  return (
    <div className="flex flex-col rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_50px_-35px_rgba(15,15,15,0.35)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {activeChat?.name ?? "Selecciona un chat"}
          </p>
          <p className="text-xs text-slate-500">
            {activeChat?.categoryLabel ?? "Sin categoria"} · {demoRecipient}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          En ventana
        </span>
      </div>
      <div className="flex-1 space-y-4 px-5 py-6">
        {localMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                message.from === "me"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`mt-2 text-[11px] ${
                  message.from === "me" ? "text-white/70" : "text-slate-400"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <input
            placeholder="Escribir mensaje"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            disabled={!activeChat}
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sendStatus === "sending" || !activeChat}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            {sendStatus === "sending" ? "Enviando" : "Enviar"}
          </button>
        </div>
        {sendMessage && (
          <p
            className={`mt-3 text-xs ${
              sendStatus === "error" ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {sendMessage}
          </p>
        )}
      </div>
    </div>
  );
}
