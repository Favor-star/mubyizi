import { Skeleton } from "@workspace/ui/components/skeleton";

export default function WorkplacesPage() {
  return (
    <section>
      <div className="grid grid-cols-4 h-40 gap-5">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="grid grid-cols-[1fr_350px] gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-50" />
        <Skeleton className="h-20" />
        <Skeleton className="h-50" />
      </div>
    </section>
  );
}
