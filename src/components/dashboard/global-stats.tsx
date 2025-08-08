'use client';

import { useReadContracts } from 'wagmi';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTokenAmount } from '@/lib/utils';
import { Landmark, Wallet, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({ title, value, icon: Icon, isLoading }: { title: string; value: string; icon: React.ElementType, isLoading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
    </CardContent>
  </Card>
);

export default function GlobalStats() {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'getVestingSchedulesTotalAmount',
      },
      {
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'getVestingSchedulesReleasedAmount',
      },
    ],
  });

  const [totalAmount, releasedAmount] = data || [null, null];

  const total = totalAmount?.result ?? 0n;
  const released = releasedAmount?.result ?? 0n;
  const locked = total - released;
  
  const progress = total > 0n ? Number((released * 10000n) / total) / 100 : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Overall Stats</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Vested" value={`${formatTokenAmount(total, 2)} HZ`} icon={Landmark} isLoading={isLoading} />
        <StatCard title="Total Released" value={`${formatTokenAmount(released, 2)} HZ`} icon={Wallet} isLoading={isLoading} />
        <StatCard title="Release Progress" value={`${progress.toFixed(2)}%`} icon={PieChart} isLoading={isLoading} />
      </div>
    </div>
  );
}
