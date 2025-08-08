'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllocationCategory, AllocationCategoryMapping } from '@/lib/types';
import ScheduleCard from './schedule-card';
import type { VestingScheduleWithId } from '@/lib/types';
import { Package, FileText } from 'lucide-react';

const categories = [
    AllocationCategory.MINING,
    AllocationCategory.ECOSYSTEM,
    AllocationCategory.TEAM,
    AllocationCategory.CORNERSTONE
];

export default function VestingPlans({ schedules }: { schedules: VestingScheduleWithId[] }) {

  const filteredSchedules = (category: AllocationCategory) => {
    return schedules.filter(s => s.schedule.category === category);
  }

  if (schedules.length === 0) {
    return (
        <div className="text-center p-10 bg-card rounded-lg border border-dashed">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Vesting Schedules Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                There are no vesting schedules associated with this wallet address.
            </p>
        </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Your Vesting Plans</h2>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat.toString()}>{AllocationCategoryMapping[cat]}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {schedules.map((schedule) => <ScheduleCard key={schedule.id} schedule={{...schedule.schedule, id: schedule.id}} />)}
          </div>
        </TabsContent>
        {categories.map(cat => (
          <TabsContent key={cat} value={cat.toString()} className="mt-4">
             {filteredSchedules(cat).length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredSchedules(cat).map((schedule) => <ScheduleCard key={schedule.id} schedule={{...schedule.schedule, id: schedule.id}} />)}
                </div>
             ) : (
                <div className="text-center p-10 bg-card rounded-lg border border-dashed">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Schedules in this Category</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You do not have any vesting schedules in the {AllocationCategoryMapping[cat]} category.
                    </p>
                </div>
             )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
