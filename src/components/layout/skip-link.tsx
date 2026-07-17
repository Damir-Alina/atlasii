export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground opacity-0 transition-all duration-150 focus:translate-y-0 focus:opacity-100"
    >
      Перейти к содержимому
    </a>
  );
}
