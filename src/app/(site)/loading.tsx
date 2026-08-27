import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <Container className="py-16">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-6 h-20 w-full max-w-2xl" />
    </Container>
  );
}
