"use client";
import { useEffect } from "react";
import ErrorView from "@/components/ui/ErrorView";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <ErrorView message={error.message} onRetry={unstable_retry} />;
}
