'use client';

import { useAccount, useReadContract } from 'wagmi';
import PersonalOverview from './personal-overview';
import VestingPlans from './vesting-plans';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import type { VestingScheduleWithId } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function UserDashboard() {
  const { address, isConnected } = useAccount();

  // 1. Get all schedules for the beneficiary
  const { data: schedulesResult, isLoading: isLoadingSchedules } = useReadContract({
    address: contractConfig.testnet.vestingAddress,
    abi: vestingContractAbi,
    functionName: 'getBeneficiaryVestingSchedules',
    args: [address!],
    query: {
        enabled: isConnected && !!address,
    }
  });

  // 2. Get the beneficiary summary
  const { data: summaryResult, isLoading: isLoadingSummary, error } = useReadContract({
    address: contractConfig.testnet.vestingAddress,
    abi: vestingContractAbi,
    functionName: 'getBeneficiaryVestingSummary',
    args: [address!],
    query: {
        enabled: isConnected && !!address,
    }
  });
  
  // 3. Process the schedules data
  const schedules: VestingScheduleWithId[] = (schedulesResult ?? [])
    .map((result: any) => ({
      id: result.id,
      ...result.schedule
    }))
    .filter((s): s is VestingScheduleWithId => s !== null);

  const isLoading = isLoadingSchedules || isLoadingSummary;

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
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  if (error) {
    return (
        <Card className="mt-6 border-destructive">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <h3 className="text-xl font-semibold text-destructive">Error Loading Data</h3>
                <p className="text-muted-foreground mt-2">Could not fetch vesting data. {error.message}</p>
            </CardContent>
        </Card>
    )
  }
  
  if (schedules.length === 0 && !isLoading) {
    return (
      <>
        <PersonalOverview summary={summaryResult} />
        <div className="mt-8">
            <VestingPlans schedules={[]} />
        </div>
      </>
    )
  }

  return (
    <div>
      <PersonalOverview summary={summaryResult} />
      <div className="mt-8">
        <VestingPlans schedules={schedules} />
      </div>
    </div>
  );
}
