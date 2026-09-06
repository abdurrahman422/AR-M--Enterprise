import { Container } from "@/components/ui/container";

export default function ProductsLoading() {
  return (
    <Container className="py-16 sm:py-24" aria-busy="true" aria-label="Loading products">
      <div className="h-4 w-28 animate-pulse bg-border" />
      <div className="mt-6 h-12 max-w-2xl animate-pulse bg-border" />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden border-t border-border">
            <div className="aspect-[5/4] animate-pulse bg-surface-elevated" />
            <div className="mt-5 h-5 w-3/4 animate-pulse bg-border" />
            <div className="mt-3 h-3 w-1/2 animate-pulse bg-border" />
          </div>
        ))}
      </div>
    </Container>
  );
}
