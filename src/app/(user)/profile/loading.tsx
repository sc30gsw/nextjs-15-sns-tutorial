import { Skeleton } from '@/components/ui'

const ProfileLoading = () => {
  return (
    <div className="flex items-center gap-6 mt-10">
      <Skeleton shape="circle" className="size-24" />
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="h-8 w-2/6" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export default ProfileLoading
