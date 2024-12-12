import { Avatar } from '@/components/ui/avatar'
import { PostCard } from '@/features/posts/components/post-card'
import { FollowButton } from '@/features/users/components/follow-button'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import { currentUser } from '@clerk/nextjs/server'
import type { InferResponseType } from 'hono'
import { IconLocation, IconPin2 } from 'justd-icons'
import Link from 'next/link'

type ResType = InferResponseType<(typeof client.api.users)[':userId']['$get']>

type ProfilePageParams = {
  params: Promise<{
    userId: string
  }>
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const userId = (await params).userId
  const loggedInUser = await currentUser()

  const url = client.api.users[':userId'].$url({
    param: { userId },
  })

  const res = await fetcher<ResType>(url, {
    next: { tags: ['user'] },
  })

  const followerIdOfFollowing = res.following.map((f) => f.followerId)
  const followerIds = res.followers.map((f) => f.followerId)
  const followingIds = res.followers.map((f) => f.followingId)

  const isFollowing =
    followingIds.includes(loggedInUser?.id ?? '') &&
    followerIds.includes(res.user?.id ?? '')

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <div className="container py-6 md:py-10 lg:py-12">
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div>
              <div className="flex items-center gap-6">
                <Avatar
                  src={res.user?.image ?? '/placeholder-user.jpg'}
                  alt="avatar"
                  className="w-24 h-24 mb-4 md:mb-0"
                />
                <div>
                  <h1 className="text-3xl font-bold">{res.user?.name}</h1>
                  <div className="text-muted-foreground">@{res.user?.id}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-muted-foreground">
                <div>
                  <IconPin2 className="size-4 inline mr-1" />
                  xxxxxxxxx
                </div>
                <div>
                  <IconLocation className="size-4 inline mr-1" />
                  xxxxxx.com
                </div>
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">
                    {res.user?.posts.length}
                  </div>
                  <div className="text-muted-foreground">Posts</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">
                    {res.followers.length}
                  </div>
                  <div className="text-muted-foreground">Followers</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">
                    {res.following.length}
                  </div>
                  <div className="text-muted-foreground">Following</div>
                </div>
              </div>

              <div className="mt-6 h-[500px] overflow-y-auto">
                {res.user?.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div className="sticky top-14 self-start space-y-6">
              {loggedInUser?.id !== res.user?.id && (
                <FollowButton
                  isFollowing={isFollowing}
                  userId={res.user?.id ?? ''}
                />
              )}
              {res.userWithoutMe
                .filter((user) => user.id !== loggedInUser?.id)
                .map((user) => {
                  const isFollowingOfWIthoutMe = followerIdOfFollowing.includes(
                    user.id,
                  )

                  return (
                    <div key={user.id}>
                      <h3 className="text-lg font-bold">Suggested</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/profile/${user.id}`}>
                            <Avatar
                              src={user.image ?? '/placeholder-user.jpg'}
                              alt="avatar"
                              className="w-10 h-10"
                            />
                          </Link>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-muted-foreground text-sm">
                              @{user.id.slice(0, 20)}
                            </div>
                          </div>
                          <FollowButton
                            isFollowing={isFollowingOfWIthoutMe}
                            userId={user.id}
                            isSuggestion={true}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
