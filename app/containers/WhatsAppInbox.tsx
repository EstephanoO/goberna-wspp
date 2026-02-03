"use client";

import CategoryList from "../components/CategoryList";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import InboxHeader from "../components/InboxHeader";
import { useChatSelection } from "../hooks/useChatSelection";
import { categories, chats, messages } from "../utils/mockData";

export default function WhatsAppInbox() {
  const {
    activeCategoryId,
    activeChatId,
    filteredChats,
    activeChat,
    setActiveCategoryId,
    setActiveChatId,
  } = useChatSelection({ categories, chats });

  return (
    <div className="min-h-screen bg-[#f1efe9] text-slate-900">
      <div className="flex w-full flex-col gap-6 px-0 py-10">
        <InboxHeader
          title="Chats organizados por categoria"
          subtitle="Inbox WhatsApp"
          actionLabel="Nueva etiqueta"
        />

        <section className="grid gap-6 lg:grid-cols-[220px_320px_1fr]">
          <CategoryList
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
          <ChatList
            chats={filteredChats}
            activeChatId={activeChatId}
            onSelect={setActiveChatId}
          />
          <ChatWindow activeChat={activeChat} messages={messages} />
        </section>
      </div>
    </div>
  );
}
