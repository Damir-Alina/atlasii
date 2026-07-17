import Image from "next/image";

import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-base",
  xl: "h-24 w-24 text-2xl",
} as const;

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
  ring?: boolean;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({
  src,
  name,
  size = "md",
  className,
  ring = false,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-muted font-display font-semibold text-primary",
        SIZE_CLASSES[size],
        ring && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
