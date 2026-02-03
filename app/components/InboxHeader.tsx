type InboxHeaderProps = {
  title: string;
  subtitle: string;
};

export default function InboxHeader({
  title,
  subtitle,
}: InboxHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#25d366] text-center text-xs font-semibold leading-10 text-[#111b21]">
          W
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            {subtitle}
          </p>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      </div>
    </header>
  );
}
