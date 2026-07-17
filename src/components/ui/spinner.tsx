import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
} as const;

export interface SpinnerProps {
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Загрузка"
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent opacity-90",
        SIZE_CLASSES[size],
        className,
      )}
    />
  );
}
