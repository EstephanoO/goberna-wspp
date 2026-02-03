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
    <div className="min-h-screen bg-[#0d1418] text-slate-900">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-[360px] flex-col border-r border-white/10 bg-[#111b21] text-white lg:flex">
          <div className="border-b border-white/10 px-5 py-4">
            <InboxHeader
              title="Inbox"
              subtitle="WhatsApp"
            />
          </div>
          <div className="px-4 py-3">
            <CategoryList
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={setActiveCategoryId}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <ChatList
              chats={filteredChats}
              activeChatId={activeChatId}
              onSelect={setActiveChatId}
            />
          </div>
        </aside>
        <main className="flex flex-1 flex-col bg-[#0b141a]">
          <ChatWindow activeChat={activeChat} messages={messages} />
        </main>
      </div>
    </div>
  );
}
