"use client";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0e1012] text-[#f3f1ec]">
        <main className="mx-auto max-w-3xl px-6 py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[#b8956a]">Error</p>
          <h1 className="mt-4 text-4xl tracking-tight">Application error</h1>
          <p className="mt-4 text-sm text-[#9aa3ad]">
            {error.message || "The application failed to render."}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 h-11 bg-[#b8956a] px-5 text-sm font-medium text-[#14110d]"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
