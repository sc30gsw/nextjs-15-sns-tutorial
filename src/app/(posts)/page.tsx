import { Avatar, Card } from '@/components/ui'
import { PostCardContent } from '@/features/posts/components/post-card-content'
import { PostForm } from '@/features/posts/components/post-form'
import { TrendingCard } from '@/features/posts/components/trending-card'
import { currentUser } from '@clerk/nextjs/server'

const Home = async () => {
  const user = await currentUser()

  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-10 md:col-span-8 lg:col-span-7">
        <Card className="h-[calc(100vh-2rem)] flex flex-col">
          <Card.Header className="border-b">
            <div className="flex w-full gap-4">
              <Avatar
                src={user?.imageUrl ? user.imageUrl : 'placeholder.png'}
                alt="avatar"
                initials="A"
              />
              <PostForm />
            </div>
          </Card.Header>
          <Card.Content className="flex-1 overflow-y-auto mt-4">
            <div className="space-y-4">
              <PostCardContent />
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="col-span-3 md:col-span-2 hidden sm:block">
        <TrendingCard />
      </div>
    </div>
  )
}

export default Home
