import * as React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { commonRoutePaths } from "@/app/config/route-paths.config";

interface ErrorFallbackProps {
  className?: string;
  error?: Error;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
  variant?: "default" | "minimal" | "fullscreen";
}

const ErrorFallback = React.forwardRef<HTMLDivElement, ErrorFallbackProps>(
  (
    {
      className,
      error,
      title = "Something went wrong",
      message = "An unexpected error occurred. Please try again.",
      showRetry = true,
      showHome = true,
      onRetry = () => {
        window.location.reload();
      },
      onGoHome = () => {
        window.location.href = commonRoutePaths.home;
      },
      variant = "default",
      ...props
    },
    ref
  ) => {
    const isFullscreen = variant === "fullscreen";
    const isMinimal = variant === "minimal";

    const containerClasses = cn(
      "flex flex-col items-center justify-center text-center",
      isFullscreen && "fixed inset-0 z-50 bg-white",
      isMinimal && "p-4",
      !isFullscreen && !isMinimal && "p-8",
      className
    );

    const iconSize = isMinimal ? "w-8 h-8" : "w-16 h-16";
    const titleSize = isMinimal ? "text-lg" : "text-2xl";
    const messageSize = isMinimal ? "text-sm" : "text-base";

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {/* Error Icon */}
        <div className="mb-4">
          <AlertTriangle className={cn("text-destructive", iconSize)} />
        </div>

        {/* Error Title */}
        <h2 className={cn("font-semibold text-foreground mb-2", titleSize)}>
          {title}
        </h2>

        {/* Error Message */}
        <p className={cn("text-muted-foreground mb-6 max-w-md", messageSize)}>
          {message}
        </p>

        {/* Error Details (only in development or when error is provided) */}
        {error && process.env.NODE_ENV === "development" && (
          <details className="mb-6 max-w-2xl w-full">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Error Details
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-md text-xs text-left overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {showRetry && (
            <Button
              variant="default"
              onClick={onRetry}
              leadingIcon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          )}

          {showHome && (
            <Button
              variant="outline"
              onClick={onGoHome}
              leadingIcon={<Home className="w-4 h-4" />}
            >
              Go Home
            </Button>
          )}
        </div>
      </div>
    );
  }
);

ErrorFallback.displayName = "ErrorFallback";

export { ErrorFallback };
