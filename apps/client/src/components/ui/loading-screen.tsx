import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  message?: string;
}

const LoadingScreen = React.forwardRef<HTMLDivElement, LoadingScreenProps>(
  ({ className, size = "md", message, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-white",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div
            className={cn(
              "animate-spin rounded-full border-4 border-gray-200 border-t-brand-400",
              sizeClasses[size]
            )}
          />

          {/* Loading message */}
          {message && (
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    );
  }
);

LoadingScreen.displayName = "LoadingScreen";

export { LoadingScreen };
