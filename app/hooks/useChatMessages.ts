"use client";

import { useEffect, useMemo, useState } from "react";

import type { Message } from "../utils/mockData";

type UseChatMessagesProps = {
  chatId: string | null;
  initialMessages: Message[];
};

type UseChatMessages = {
  messages: Message[];
  appendMessage: (message: Message) => void;
  setMessages: (nextMessages: Message[]) => void;
};

const storagePrefix = "wspp_chat_messages_";

export function useChatMessages({
  chatId,
  initialMessages,
}: UseChatMessagesProps): UseChatMessages {
  const storageKey = useMemo(() => {
    return chatId ? `${storagePrefix}${chatId}` : "";
  }, [chatId]);

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    if (!storageKey) {
      setMessages(initialMessages);
      return;
    }
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setMessages(initialMessages);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Message[];
      setMessages(parsed);
    } catch {
      setMessages(initialMessages);
    }
  }, [initialMessages, storageKey]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  const appendMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  return { messages, appendMessage, setMessages };
}
