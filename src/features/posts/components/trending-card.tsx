import { Card } from '@/components/ui'

const TRENDING = [
  { name: '#technology', count: '12.3K' },
  { name: '#travel', count: '8.7K' },
  { name: '#fashion', count: '6.2K' },
  { name: '#food', count: '9.5K' },
]

export const TrendingCard = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Trending Topics</Card.Title>
      </Card.Header>
      <Card.Content>
        <ul className="flex flex-col gap-2">
          {TRENDING.map((trend) => (
            <li key={trend.name} className="flex justify-between items-center">
              <p className="text-base">{trend.name}</p>
              <span className="text-sm text-muted-foreground text-neutral-600 bg-neutral-300 opacity-90 px-2 py-1 rounded">
                {trend.count}
              </span>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  )
}
