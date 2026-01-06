import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, FileCheck, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  confirmedCount: number
  expressedInterestCount: number
  formCompletedCount: number
  capacity: number
}

export function StatsCards({
  confirmedCount,
  expressedInterestCount,
  formCompletedCount,
  capacity,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Confirmați',
      value: confirmedCount,
      subtitle: `din ${capacity} locuri`,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Exprimat interes',
      value: expressedInterestCount,
      subtitle: 'în așteptare',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Formular completat',
      value: formCompletedCount,
      subtitle: 'din toți participanții',
      icon: FileCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Rata de ocupare',
      value: `${Math.round((confirmedCount / capacity) * 100)}%`,
      subtitle: 'completat',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
