import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserSidebar } from '@/components/user/UserSidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <UserSidebar />
          <main className="flex-1 bg-surface p-6 md:p-8">{children}</main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
