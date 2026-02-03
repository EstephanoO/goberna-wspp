"use client";

import { useMemo, useState } from "react";

import type { Chat, Category } from "../utils/mockData";

type UseChatSelectionProps = {
  categories: Category[];
  chats: Chat[];
};

export type ChatSelection = {
  activeCategoryId: string;
  activeChatId: string;
  filteredChats: Chat[];
  activeChat: Chat | null;
  setActiveCategoryId: (id: string) => void;
  setActiveChatId: (id: string) => void;
};

export function useChatSelection({
  categories,
  chats,
}: UseChatSelectionProps): ChatSelection {
  const initialCategory = categories[0]?.id ?? "all";
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategory);
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id ?? "");

  const filteredChats = useMemo(() => {
    if (activeCategoryId === "all") {
      return chats;
    }
    return chats.filter((chat) => chat.categoryId === activeCategoryId);
  }, [activeCategoryId, chats]);

  const activeChat = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId) ?? null;
  }, [activeChatId, chats]);

  return {
    activeCategoryId,
    activeChatId,
    filteredChats,
    activeChat,
    setActiveCategoryId,
    setActiveChatId,
  };
}
