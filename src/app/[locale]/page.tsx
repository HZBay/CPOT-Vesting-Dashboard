import Header from '@/components/dashboard/header';
import GlobalStats from '@/components/dashboard/global-stats';
import UserDashboard from '@/components/dashboard/user-dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <GlobalStats />
        <div className="mt-8">
          <UserDashboard />
        </div>
      </main>
    </div>
  );
}
