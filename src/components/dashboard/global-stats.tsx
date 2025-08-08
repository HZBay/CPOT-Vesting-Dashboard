'use client';

import { useReadContracts } from 'wagmi';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTokenAmount } from '@/lib/utils';
import { Landmark, Wallet, PieChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';

const StatCard = ({ title, value, unit, icon: Icon, isLoading }: { title: string; value: string; unit?: string, icon: React.ElementType, isLoading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
        {isLoading ? (
            <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-xl font-bold">
            <span className="break-all">{value}</span>
            {unit && <span className="text-base font-medium ml-1">{unit}</span>}
          </div>
        )}
    </CardContent>
  </Card>
);

export default function GlobalStats() {
  const t = useTranslations('GlobalStats');

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
  
  const progress = total > 0n ? Number((released * 10000n) / total) / 100 : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">{t('title')}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title={t('totalVested')} value={formatTokenAmount(total, 1)} unit="CPOT" icon={Landmark} isLoading={isLoading} />
        <StatCard title={t('totalReleased')} value={formatTokenAmount(released, 1)} unit="CPOT" icon={Wallet} isLoading={isLoading} />
        <StatCard title={t('releaseProgress')} value={`${progress.toFixed(1)}%`} icon={PieChart} isLoading={isLoading} />
      </div>
    </div>
  );
}
