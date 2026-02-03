import type { Chat } from "../utils/mockData";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatListProps = {
  chats: Chat[];
  activeChatId: string;
  onSelect: (id: string) => void;
};

export default function ChatList({
  chats,
  activeChatId,
  onSelect,
}: ChatListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 rounded-xl bg-[#202c33] px-3 py-2">
        <span className="text-xs text-white/40">🔎</span>
        <Input
          placeholder="Buscar o iniciar un chat"
          className="h-9 border-0 bg-transparent text-xs text-white/80 placeholder:text-white/40 focus-visible:ring-0"
        />
      </div>
      <ScrollArea className="mt-3 h-full">
        <div className="space-y-1 pb-4">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelect(chat.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  isActive
                    ? "bg-[#2a3942]"
                    : "hover:bg-[#202c33]"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2b32] text-xs font-semibold text-white/70">
                  {chat.name
                    .split(" ")
                    .slice(0, 2)
                    .map((chunk) => chunk[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      {chat.name}
                    </span>
                    <span className="text-[11px] text-white/40">{chat.time}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-white/50">{chat.preview}</p>
                    {chat.unread > 0 && (
                      <span className="rounded-full bg-[#25d366] px-2 py-0.5 text-[10px] font-semibold text-[#111b21]">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {chat.categoryLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
