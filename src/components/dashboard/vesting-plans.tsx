'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllocationCategory, AllocationCategoryMapping } from '@/lib/types';
import ScheduleCard from './schedule-card';
import type { VestingScheduleWithId } from '@/lib/types';
import { Package, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

const categories = [
    AllocationCategory.MINING,
    AllocationCategory.ECOSYSTEM,
    AllocationCategory.TEAM,
    AllocationCategory.CORNERSTONE
];

export default function VestingPlans({ schedules }: { schedules: VestingScheduleWithId[] }) {
  const t = useTranslations('VestingPlans');
  const tCat = useTranslations('AllocationCategory');

  const getCategoryName = (category: AllocationCategory) => {
    const key = AllocationCategoryMapping[category];
    return tCat(key as any);
  };

  const filteredSchedules = (category: AllocationCategory) => {
    return schedules.filter(s => s.schedule.category === category);
  }

  if (schedules.length === 0) {
    return (
        <div className="text-center p-10 bg-card rounded-lg border border-dashed">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('noSchedules')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                {t('noSchedulesMessage')}
            </p>
        </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">{t('title')}</h2>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat.toString()}>{getCategoryName(cat)}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {schedules.map((scheduleWithId) => <ScheduleCard key={scheduleWithId.id} schedule={{...scheduleWithId.schedule, id: scheduleWithId.id}} />)}
          </div>
        </TabsContent>
        {categories.map(cat => (
          <TabsContent key={cat} value={cat.toString()} className="mt-4">
             {filteredSchedules(cat).length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredSchedules(cat).map((scheduleWithId) => <ScheduleCard key={scheduleWithId.id} schedule={{...scheduleWithId.schedule, id: scheduleWithId.id}} />)}
                </div>
             ) : (
                <div className="text-center p-10 bg-card rounded-lg border border-dashed">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">{t('noSchedulesInCategory')}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('noSchedulesInCategoryMessage', { categoryName: getCategoryName(cat) })}
                    </p>
                </div>
             )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
