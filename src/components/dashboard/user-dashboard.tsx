'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import PersonalOverview from './personal-overview';
import VestingPlans from './vesting-plans';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import type { VestingSchedule, VestingScheduleWithId } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function UserDashboard() {
  const { address, isConnected } = useAccount();
  const t = useTranslations('UserDashboard');

  // 1. Get all schedule contents for the beneficiary
  const { data: schedulesResult, isLoading: isLoadingSchedules, error: schedulesError } = useReadContract({
    address: contractConfig.testnet.vestingAddress,
    abi: vestingContractAbi,
    functionName: 'getBeneficiaryVestingSchedules',
    args: [address!],
    query: {
        enabled: isConnected && !!address,
    }
  });

  const schedules = (schedulesResult || []) as VestingSchedule[];

  // 2. Create contracts to compute schedule IDs for each schedule
  const computeIdContracts = useMemo(() => {
    if (!address || schedules.length === 0) return [];
    return schedules.map((_, index) => ({
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'computeVestingScheduleIdForAddressAndIndex',
        args: [address, BigInt(index)],
    }));
  }, [address, schedules]);

  // 3. Fetch all schedule IDs
  const { data: scheduleIdsResult, isLoading: isLoadingIds } = useReadContracts({
      contracts: computeIdContracts,
      query: {
          enabled: computeIdContracts.length > 0,
      },
  });

  // 4. Combine schedules with their IDs
  const schedulesWithIds: VestingScheduleWithId[] = useMemo(() => {
    if (!schedules || !scheduleIdsResult) return [];
    return schedules.map((schedule, index) => {
      const idResult = scheduleIdsResult[index];
      return {
        schedule,
        id: (idResult?.result as `0x${string}`) ?? '0x',
      };
    }).filter(item => item.id !== '0x');
  }, [schedules, scheduleIdsResult]);
  
  // 5. Get the beneficiary summary
  const { data: summaryResult, isLoading: isLoadingSummary, error: summaryError } = useReadContract({
    address: contractConfig.testnet.vestingAddress,
    abi: vestingContractAbi,
    functionName: 'getBeneficiaryVestingSummary',
    args: [address!],
    query: {
        enabled: isConnected && !!address,
    }
  });
  
  const isLoading = isLoadingSchedules || isLoadingIds || isLoadingSummary;
  const error = schedulesError || summaryError;

  if (!isConnected) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Wallet className="w-12 h-12 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold">{t('connectWalletTitle')}</h3>
          <p className="text-muted-foreground mt-2">{t('connectWalletMessage')}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && schedulesWithIds.length === 0) {
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
                <h3 className="text-xl font-semibold text-destructive">{t('errorLoading')}</h3>
                <p className="text-muted-foreground mt-2">{t('errorFetching')} {error.message}</p>
            </CardContent>
        </Card>
    )
  }
  
  if (schedulesWithIds.length === 0 && !isLoadingSchedules && !isLoadingIds) {
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
        <VestingPlans schedules={schedulesWithIds} />
      </div>
    </div>
  );
}
