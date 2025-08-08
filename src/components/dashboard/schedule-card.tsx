'use client';

import { useState, useMemo, useEffect } from 'react';
import type { VestingScheduleWithId } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AllocationCategoryMapping, VestingTypeMapping } from '@/lib/types';
import { formatTokenAmount, formatDuration } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, HandCoins } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useQueryClient } from 'wagmi';
import { contractConfig, vestingContractAbi } from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';
import { parseEther } from 'viem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function ScheduleCard({ schedule }: { schedule: VestingScheduleWithId }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [releaseAmount, setReleaseAmount] = useState('');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: computedReleasable } = useReadContract({
        address: contractConfig.testnet.vestingAddress,
        abi: vestingContractAbi,
        functionName: 'computeReleasableAmount',
        args: [schedule.id as `0x${string}`],
        query: {
            // Refetch every 30 seconds
            refetchInterval: 30000,
        },
    });

    const releasableBigInt = computedReleasable ?? 0n;
    const releasableFormatted = formatTokenAmount(releasableBigInt, 18);

    const { data: hash, isPending, writeContract } = useWriteContract({
        mutation: {
            onSuccess: () => {
                toast({ title: "Transaction Sent", description: "Your release transaction has been broadcasted." });
            },
            onError: (error) => {
                toast({ title: "Transaction Failed", description: error.message, variant: 'destructive' });
            }
        }
    });

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
        hash,
        onSuccess(data) {
            toast({ title: "Transaction Confirmed", description: "Your tokens have been released successfully." });
            setReleaseAmount('');
            // Invalidate queries to refetch data
            queryClient.invalidateQueries();
        },
    });

    const handleRelease = () => {
        const amountToRelease = releaseAmount.trim() === '' ? releasableBigInt : parseEther(releaseAmount);

        if (amountToRelease <= 0n) {
            toast({ title: 'Invalid Amount', description: 'Please enter a positive amount to release.', variant: 'destructive' });
            return;
        }

        if (amountToRelease > releasableBigInt) {
            toast({ title: 'Amount Exceeds Releasable', description: 'You cannot release more tokens than currently available.', variant: 'destructive' });
            return;
        }

        writeContract({
            address: contractConfig.testnet.vestingAddress,
            abi: vestingContractAbi,
            functionName: 'release',
            args: [schedule.id as `0x${string}`, amountToRelease]
        });
    };
    
    useEffect(() => {
      if (isConfirmed) {
        // Reset or refetch data after confirmation
      }
    }, [isConfirmed]);

    const status = useMemo(() => {
        if (schedule.revoked) return { text: 'Revoked', color: 'bg-red-500' };
        if (schedule.released === schedule.amountTotal) return { text: 'Completed', color: 'bg-gray-500' };
        return { text: 'Active', color: 'bg-green-500' };
    }, [schedule]);

    const releaseProgress = schedule.amountTotal > 0n ? Number((schedule.released * 10000n) / schedule.amountTotal) / 100 : 100;

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

    const canRelease = releasableBigInt > 0n && !isPending && !isConfirming;

    return (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center">
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
                    <span>Vested</span>
                    <span>{formatTokenAmount(schedule.released)} / {formatTokenAmount(schedule.amountTotal)} CPOT</span>
                </div>
                <Progress value={releaseProgress} className="mt-1 h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{releaseProgress.toFixed(2)}% Released</span>
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
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-muted-foreground"/>Cliff ends:</div>
                <div className="text-right font-mono">{new Date(Number(schedule.start + schedule.cliff) * 1000).toLocaleString()}</div>
                <div className="flex items-center"><HandCoins className="w-4 h-4 mr-2 text-muted-foreground"/>Releasable:</div>
                <div className="text-right font-mono text-primary font-bold">{formatTokenAmount(releasableBigInt, 6)} CPOT</div>
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
                {!canRelease && releasableBigInt === 0n && (
                  <TooltipContent>
                    <p>No tokens are currently releasable for this schedule.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
        </CardFooter>
    </Card>
    );
}
