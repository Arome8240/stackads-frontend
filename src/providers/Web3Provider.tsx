"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  // QueryClient must be created inside the component to avoid sharing state between requests
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
