'use client';

import { useAccount, useReadContracts } from 'wagmi';
import PersonalOverview from './personal-overview';
import VestingPlans from './vesting-plans';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import { useMemo } from 'react';
import type { VestingSchedule, VestingScheduleWithId } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function UserDashboard() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, error } = useReadContracts({
    contracts: address ? [
      {
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'getBeneficiaryVestingSummary',
        args: [address],
      },
      {
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'getBeneficiaryVestingSchedules',
        args: [address],
      },
    ] : [],
    query: {
        enabled: isConnected && !!address,
    }
  });

  const [summary, schedulesRaw] = data || [null, null];

  const schedules: VestingScheduleWithId[] = useMemo(() => {
    if (!schedulesRaw?.result) return [];
    // The contract doesn't return a unique ID, so we create a pseudo-ID for UI purposes.
    // NOTE: This ID cannot be used for contract interactions.
    return (schedulesRaw.result as VestingSchedule[]).map((schedule, index) => ({
      ...schedule,
      id: `${address}-${index}`,
    }));
  }, [schedulesRaw, address]);


  if (!isConnected) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Wallet className="w-12 h-12 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
          <p className="text-muted-foreground mt-2">Please connect your wallet to view your personal vesting schedules and manage your tokens.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
        <div>
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
        </div>
    )
  }

  if (error) {
    return (
        <Card className="mt-6 border-destructive">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <h3 className="text-xl font-semibold text-destructive">Error Loading Data</h3>
                <p className="text-muted-foreground mt-2">Could not fetch vesting data. Please ensure you are on the correct network.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div>
      <PersonalOverview summary={summary?.result} />
      <div className="mt-8">
        <VestingPlans schedules={schedules} />
      </div>
    </div>
  );
}