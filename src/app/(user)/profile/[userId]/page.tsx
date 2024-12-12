import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/features/posts/components/post-card'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'

type ResType = InferResponseType<(typeof client.api.users)[':userId']['$get']>

type ProfilePageParams = {
  params: Promise<{
    userId: string
  }>
}

const ProfilePage = async ({ params }: ProfilePageParams) => {
  const userId = (await params).userId

  const url = client.api.users[':userId'].$url({
    param: { userId },
  })

  const res = await fetcher<ResType>(url, {
    next: { tags: ['user'] },
  })

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
                  <MapPinIcon className="w-4 h-4 mr-1 inline" />
                  xxxxxxxxx
                </div>
                <div>
                  <LinkIcon className="w-4 h-4 mr-1 inline" />
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
              <Button className="w-full">
                Follow
                <PlusIcon className="w-4 h-4" />
              </Button>
              <div>
                <h3 className="text-lg font-bold">Suggested</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={'/placeholder-user.jpg'}
                      alt="avatar"
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-medium">Acme Inc</div>
                      <div className="text-muted-foreground text-sm">
                        @acmeinc
                      </div>
                    </div>
                    <Button
                      size="square-petite"
                      appearance="outline"
                      className="ml-auto"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={'/placeholder-user.jpg'}
                      alt="avatar"
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-medium">Acme Inc</div>
                      <div className="text-muted-foreground text-sm">
                        @acmeinc
                      </div>
                    </div>
                    <Button
                      size="square-petite"
                      appearance="outline"
                      className="ml-auto"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={'/placeholder-user.jpg'}
                      alt="avatar"
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-medium">Acme Inc</div>
                      <div className="text-muted-foreground text-sm">
                        @acmeinc
                      </div>
                    </div>
                    <Button
                      size="square-petite"
                      appearance="outline"
                      className="ml-auto"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// biome-ignore lint/suspicious/noExplicitAny: This is a generated component
const LinkIcon = (props: any) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: This is an icon from installing Sample
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

// biome-ignore lint/suspicious/noExplicitAny: This is a generated component
const MapPinIcon = (props: any) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: This is an icon from installing Sample
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// biome-ignore lint/suspicious/noExplicitAny: This is a generated component
const PlusIcon = (props: any) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: This is an icon from installing Sample
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

export default ProfilePage
