"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="flex-1">
      <Container className="py-24">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Error</p>
        <h1 className="mt-4 font-heading text-4xl tracking-tight">Something went wrong</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
          The page could not be loaded. Retry the request, or return home.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <Button href="/" variant="outline">
            Home
          </Button>
        </div>
      </Container>
    </main>
  );
}
