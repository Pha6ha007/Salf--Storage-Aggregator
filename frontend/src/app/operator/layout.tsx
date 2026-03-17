import { ProtectedRoute } from '@/components/ProtectedRoute';
import { OperatorSidebar } from '@/components/operator/OperatorSidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['operator', 'admin']}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <OperatorSidebar />
          <main className="flex-1 bg-gray-50/50 p-6 md:p-8">{children}</main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
