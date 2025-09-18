import { cn } from "@/lib/utils";

function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-gray-200 border-t-brand-400",
        sizeClasses[size],
        className
      )}
    />
  );
}

export { Spinner };
