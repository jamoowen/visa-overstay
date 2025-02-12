import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-screen min-h-[80vh] px-4">
      <div className="flex flex-col pt-15 space-y-8 items-center justify-center w-full">
        <Skeleton className="h-[50vh] w-[90%] rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[8vh] w-full" />
          <Skeleton className="h-[8vh] w-[80%]" />
        </div>
      </div>
    </div>
  )
}
