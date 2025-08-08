'use client';

import { useState, useMemo, useEffect } from 'react';
import type { VestingScheduleWithId, VestingProgress } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AllocationCategoryMapping, VestingTypeMapping } from '@/lib/types';
import { formatTokenAmount, formatDuration } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, HandCoins, KeyRound, Lock, PiggyBank } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useQueryClient } from 'wagmi';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import { parseEther } from 'viem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Skeleton } from '../ui/skeleton';

export default function ScheduleCard({ schedule }: { schedule: VestingScheduleWithId }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [releaseAmount, setReleaseAmount] = useState('');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: progress, isLoading: isLoadingProgress } = useReadContract({
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'getVestingProgress',
        args: [schedule.id],
        query: {
            // Refetch every 10 seconds
            refetchInterval: 10000,
        },
    });

    const vestingProgress = progress as VestingProgress | undefined;
    const releasableBigInt = vestingProgress?.releasableAmount ?? 0n;
    const releasableFormatted = formatTokenAmount(releasableBigInt, 18);

    const { data: hash, isPending, writeContract } = useWriteContract({
        mutation: {
            onSuccess: () => {
                toast({ title: "Transaction Sent", description: "Your release transaction has been broadcasted." });
            },
            onError: (error) => {
                const message = error.message.includes('User rejected the request') 
                    ? 'Transaction rejected by user.' 
                    : error.message;
                toast({ title: "Transaction Failed", description: message, variant: 'destructive' });
            }
        }
    });

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
        hash,
        onSuccess(data) {
            toast({ title: "Transaction Confirmed", description: "Your tokens have been released successfully." });
            setReleaseAmount('');
            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['getVestingProgress'] });
            queryClient.invalidateQueries({ queryKey: ['getBeneficiaryVestingSummary'] });
            queryClient.invalidateQueries({ queryKey: ['getBeneficiaryVestingSchedules'] });
        },
    });

    const handleRelease = () => {
        if (!vestingProgress) return;
        const amountToRelease = releaseAmount.trim() === '' ? vestingProgress.releasableAmount : parseEther(releaseAmount);

        if (amountToRelease <= 0n) {
            toast({ title: 'Invalid Amount', description: 'Please enter a positive amount to release.', variant: 'destructive' });
            return;
        }

        if (amountToRelease > vestingProgress.releasableAmount) {
            toast({ title: 'Amount Exceeds Releasable', description: 'You cannot release more tokens than currently available.', variant: 'destructive' });
            return;
        }

        writeContract({
            address: contractConfig.testnet.vestingAddress,
            abi: vestingContractAbi,
            functionName: 'release',
            args: [schedule.id, amountToRelease]
        });
    };

    const status = useMemo(() => {
        if (schedule.revoked) return { text: 'Revoked', color: 'bg-red-500' };
        if (vestingProgress && vestingProgress.totalAmount > 0n && vestingProgress.releasedAmount === vestingProgress.totalAmount) return { text: 'Completed', color: 'bg-gray-500' };
        return { text: 'Active', color: 'bg-green-500' };
    }, [schedule, vestingProgress]);

    const releaseProgressPercent = useMemo(() => {
        if (!vestingProgress || vestingProgress.totalAmount === 0n) return 0;
        return Number((vestingProgress.releasedAmount * 10000n) / vestingProgress.totalAmount) / 100;
    }, [vestingProgress]);

    const timeProgress = useMemo(() => {
        if (schedule.duration === 0n) return 100;
        const timeSinceStart = BigInt(Math.floor(now.getTime() / 1000)) - schedule.start;
        if (timeSinceStart <= 0) return 0;
        if (timeSinceStart >= schedule.duration) return 100;
        return Number((timeSinceStart * 10000n) / schedule.duration) / 100;
    }, [schedule, now]);

    const remainingTime = useMemo(() => {
        const endTime = Number(schedule.start + schedule.duration);
        const nowSeconds = Math.floor(now.getTime() / 1000);
        return endTime > nowSeconds ? endTime - nowSeconds : 0;
    }, [schedule, now]);

    const canRelease = (vestingProgress?.releasableAmount ?? 0n) > 0n && !isPending && !isConfirming;

    const renderStat = (icon: React.ElementType, title: string, value: string | undefined, unit: string, isLoading: boolean) => (
        <>
            <div className="flex items-center text-sm">
                {React.createElement(icon, { className: "w-4 h-4 mr-2 text-muted-foreground" })}
                {title}:
            </div>
            {isLoading ? <Skeleton className="h-5 w-24" /> : <div className="text-right font-mono text-sm font-semibold">{value ?? '...'} {unit}</div>}
        </>
    );

    return (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center text-xl">
                        <span className="mr-2">Plan Details</span>
                         <Badge variant="outline">{AllocationCategoryMapping[schedule.category]}</Badge>
                    </CardTitle>
                    <CardDescription>Type: {VestingTypeMapping[schedule.vestingType]}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span className="text-sm font-medium">{status.text}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
            <div className="text-sm">
                <div className="flex justify-between">
                    <span>Release Progress</span>
                    <span>{releaseProgressPercent.toFixed(2)}%</span>
                </div>
                <Progress value={releaseProgressPercent} className="mt-1 h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{formatTokenAmount(vestingProgress?.releasedAmount, 2)}</span>
                    <span>{formatTokenAmount(vestingProgress?.totalAmount, 2)} CPOT</span>
                </div>
            </div>
            
            <div className="text-sm">
                <div className="flex justify-between">
                    <span>Time Elapsed</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(remainingTime)} remaining</span>
                    </div>
                </div>
                <Progress value={timeProgress} className="mt-1 h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{new Date(Number(schedule.start) * 1000).toLocaleDateString()}</span>
                    <span>{new Date(Number(schedule.start + schedule.duration) * 1000).toLocaleDateString()}</span>
                </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center col-span-2 text-muted-foreground"><Calendar className="w-4 h-4 mr-2"/>Cliff ends: {new Date(Number(schedule.start + schedule.cliff) * 1000).toLocaleString()}</div>
                {renderStat(PiggyBank, "Total", formatTokenAmount(vestingProgress?.totalAmount, 2), "CPOT", isLoadingProgress)}
                {renderStat(HandCoins, "Released", formatTokenAmount(vestingProgress?.releasedAmount, 2), "CPOT", isLoadingProgress)}
                {renderStat(KeyRound, "Releasable", formatTokenAmount(vestingProgress?.releasableAmount, 4), "CPOT", isLoadingProgress)}
                {renderStat(Lock, "Locked", formatTokenAmount(vestingProgress?.lockedAmount, 2), "CPOT", isLoadingProgress)}
            </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 flex flex-col sm:flex-row items-center gap-2">
             <div className="w-full relative">
                <Input 
                    placeholder={`Max: ${releasableFormatted}`} 
                    className="bg-background pr-20"
                    value={releaseAmount}
                    onChange={(e) => setReleaseAmount(e.target.value)}
                    disabled={!canRelease}
                    type="number"
                />
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                    onClick={() => setReleaseAmount(releasableFormatted)}
                    disabled={!canRelease}
                >
                    Max
                </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <span className="w-full sm:w-auto">
                        <Button 
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={handleRelease}
                            disabled={!canRelease}
                        >
                            {(isPending || isConfirming) ? 'Releasing...' : 'Release Tokens'}
                        </Button>
                    </span>
                </TooltipTrigger>
                {!canRelease && releasableBigInt === 0n && !isLoadingProgress && (
                  <TooltipContent>
                    <p>No tokens are currently releasable for this schedule.</p>
                  </TooltipContent>
                )}
                 {!canRelease && (isPending || isConfirming) && (
                  <TooltipContent>
                    <p>A release transaction is already in progress.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
        </CardFooter>
    </Card>
    );
}
