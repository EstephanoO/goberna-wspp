import type { Chat } from "../utils/mockData";

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
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_50px_-35px_rgba(15,15,15,0.35)] backdrop-blur">
      <div className="flex items-center gap-3">
        <input
          placeholder="Buscar chat"
          className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600"
        />
      </div>
      <div className="mt-4 space-y-3">
        {chats.map((chat) => {
          const isActive = chat.id === activeChatId;
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelect(chat.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{chat.name}</span>
                <span
                  className={`text-xs ${
                    isActive ? "text-white/70" : "text-slate-400"
                  }`}
                >
                  {chat.time}
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${
                  isActive ? "text-white/70" : "text-slate-500"
                }`}
              >
                {chat.preview}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
                <span className={isActive ? "text-white/70" : "text-slate-400"}>
                  {chat.categoryLabel}
                </span>
                {chat.unread > 0 && (
                  <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
