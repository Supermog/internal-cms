import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface LoadingScreenProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  message?: string;
}

const LoadingScreen = React.forwardRef<HTMLDivElement, LoadingScreenProps>(
  ({ className, size = "md", message, ...props }, ref) => {
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
          <Spinner size={size} />

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
