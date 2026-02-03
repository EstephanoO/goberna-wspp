type InboxHeaderProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
};

export default function InboxHeader({
  title,
  subtitle,
  actionLabel,
}: InboxHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          {subtitle}
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h1>
      </div>
      <button
        type="button"
        className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
      >
        {actionLabel}
      </button>
    </header>
  );
}
