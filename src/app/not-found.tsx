import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content" className="flex-1">
      <Container className="py-24">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">404</p>
        <h1 className="mt-4 font-heading text-4xl tracking-tight">Page not found</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
          The requested page does not exist or is not published.
        </p>
        <div className="mt-8">
          <Button href="/">Return home</Button>
        </div>
      </Container>
    </main>
  );
}
