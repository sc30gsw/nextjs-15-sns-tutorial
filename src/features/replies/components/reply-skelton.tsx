import { Skeleton } from '@/components/ui'

export const ReplySkelton = () => {
  return (
    <div className="flex w-full gap-4 items-center">
      <Skeleton shape="circle" className="h-10 w-10 rounded-full" />
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
