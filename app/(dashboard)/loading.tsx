import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col space-y-8 w-[80vw] max-w-7xl">
        <Skeleton className="h-[60vh] w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[8vh] w-full" />
          <Skeleton className="h-[8vh] w-[80%]" />
        </div>
      </div>
    </div>
  )
}
