'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTokenAmount } from '@/lib/utils';
import { PiggyBank, HandCoins, KeyRound, Lock, List } from 'lucide-react';

type BeneficiarySummary = {
  totalAmount: bigint;
  releasedAmount: bigint;
  releasableAmount: bigint;
  lockedAmount: bigint;
  scheduleCount: bigint;
} | undefined;

const StatCard = ({ title, value, unit, icon: Icon }: { title: string; value: string; unit?: string, icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-xl font-bold">
        <span className="break-all">{value}</span>
        {unit && <span className="text-base font-medium ml-1">{unit}</span>}
      </div>
    </CardContent>
  </Card>
);

export default function PersonalOverview({ summary }: { summary: BeneficiarySummary }) {

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Dashboard</h2>
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Allocated" value={formatTokenAmount(summary?.totalAmount, 2)} unit="CPOT" icon={PiggyBank} />
        <StatCard title="Already Released" value={formatTokenAmount(summary?.releasedAmount, 2)} unit="CPOT" icon={HandCoins} />
        <StatCard title="Currently Releasable" value={formatTokenAmount(summary?.releasableAmount, 2)} unit="CPOT" icon={KeyRound} />
        <StatCard title="Still Locked" value={formatTokenAmount(summary?.lockedAmount, 2)} unit="CPOT" icon={Lock} />
        <StatCard title="Vesting Schedules" value={summary?.scheduleCount?.toString() ?? '0'} icon={List} />
      </div>
    </div>
  );
}
