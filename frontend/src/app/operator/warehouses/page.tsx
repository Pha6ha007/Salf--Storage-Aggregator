'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Building2, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { warehousesApi } from '@/lib/api/warehouses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WarehouseStatusBadge } from '@/components/operator/WarehouseStatusBadge';
import { EmptyState } from '@/components/EmptyState';
import type { WarehouseStatus } from '@/types/warehouse';

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_moderation', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

export default function OperatorWarehousesPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | WarehouseStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['operatorWarehouses', { status: statusFilter, search: searchQuery, page }],
    queryFn: () =>
      warehousesApi.listOwn({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
        page,
        per_page: 12,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: warehousesApi.delete,
    onSuccess: () => {
      toast.success('Warehouse deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['operatorWarehouses'] });
    },
    onError: () => {
      toast.error('Failed to delete warehouse');
    },
  });

  const handleDelete = (id: number | string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Warehouses</h1>
          <p className="mt-2 text-text-secondary">
            {data?.data.length || 0} warehouses
          </p>
        </div>
        <Link href="/operator/warehouses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Warehouse
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
        >
          <TabsList>
            {statusFilters.map((filter) => (
              <TabsTrigger key={filter.value} value={filter.value}>
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-text-secondary">Loading warehouses...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Failed to load warehouses. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          {searchQuery ? (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)' }}>
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No warehouses match &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-sm text-gray-500">Try a different search term or clear the filter.</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                <Building2 className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>
                Add your first warehouse
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
                List your storage facility, add available units with pricing, and start receiving bookings from customers across UAE.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/operator/warehouses/new"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }}>
                  <Plus className="h-4 w-4" /> Add Warehouse
                </Link>
                <Link href="/how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  How it works
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm text-center">
                {[
                  { n: '01', label: 'Add warehouse details & photos' },
                  { n: '02', label: 'Get verified within 24h' },
                  { n: '03', label: 'Receive bookings from UAE customers' },
                ].map(({ n, label }) => (
                  <div key={n}>
                    <div className="text-2xl font-bold text-gray-200 mb-1"
                      style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>{n}</div>
                    <p className="text-xs text-gray-400 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Warehouses Grid */}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.data.map((warehouse) => (
              <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {warehouse.name}
                        </h3>
                        <WarehouseStatusBadge status={warehouse.status} />
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {warehouse.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-border">
                    <div>
                      <p className="text-xs text-text-secondary">Total Boxes</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {warehouse.total_boxes || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Available</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {warehouse.available_boxes || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Rating</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {warehouse.rating ? Number(warehouse.rating).toFixed(1) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/warehouse/${warehouse.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link
                      href={`/operator/warehouses/${warehouse.id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(warehouse.id, warehouse.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.data.length > 0 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-text-secondary">
                Page {page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.data.length || data.data.length < 12}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
