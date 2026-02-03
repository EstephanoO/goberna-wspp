"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Chat, Message } from "../utils/mockData";
import { useChatMessages } from "../hooks/useChatMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#202c33] px-6 py-4 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f2b32] text-xs font-semibold text-white/70">
            {activeChat?.name
              ? activeChat.name
                  .split(" ")
                  .slice(0, 2)
                  .map((chunk) => chunk[0])
                  .join("")
              : "--"}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {activeChat?.name ?? "Selecciona un chat"}
            </p>
            <p className="text-xs text-white/50">
              {activeChat?.categoryLabel ?? "Sin categoria"} · {demoRecipient}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#1f2b32] px-3 py-1 text-[11px] font-semibold text-white/60">
          En ventana
        </span>
      </div>
      <ScrollArea className="flex-1 bg-[#0b141a] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_60%)] px-6 py-6">
        <div className="space-y-4 pb-6">
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
                    ? "bg-[#005c4b] text-white"
                    : "bg-[#202c33] text-white"
                }`}
              >
                <p>{message.text}</p>
                <p className="mt-2 text-[10px] text-white/60">
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-white/10 bg-[#202c33] px-5 py-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Escribir mensaje"
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            disabled={!activeChat}
            className="h-11 border-white/10 bg-[#111b21] text-xs text-white placeholder:text-white/40 focus-visible:ring-0"
          />
          <Button
            type="button"
            onClick={handleSend}
            disabled={sendStatus === "sending" || !activeChat}
            className="h-11 rounded-xl bg-[#25d366] px-4 text-xs font-semibold text-[#111b21] hover:bg-[#20c45e]"
          >
            {sendStatus === "sending" ? "Enviando" : "Enviar"}
          </Button>
        </div>
        {sendMessage && (
          <p
            className={`mt-2 text-xs ${
              sendStatus === "error" ? "text-rose-300" : "text-emerald-300"
            }`}
          >
            {sendMessage}
          </p>
        )}
      </div>
    </div>
  );
}
