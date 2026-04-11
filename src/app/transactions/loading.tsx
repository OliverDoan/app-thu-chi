import { SkeletonList } from '@/components/common/skeleton-list'

export default function Loading() {
  return (
    <div className="max-w-lg mx-auto pt-14">
      <SkeletonList count={8} />
    </div>
  )
}
