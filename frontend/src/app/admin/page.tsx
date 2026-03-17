"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Users, Building2, CheckCircle, XCircle, Clock, Eye, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import api from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "operators" | "warehouses";

interface Operator {
  id: string;
  userId: string;
  companyName: string;
  isVerified: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; role: string };
  _count?: { warehouses: number };
}

interface Warehouse {
  id: string;
  name: string;
  status: string;
  emirate: string;
  address: string;
  createdAt: string;
  operator: { companyName: string; user: { email: string } };
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("operators");

  useEffect(() => {
    if (isAuthenticated === false) router.push("/auth/login");
    if (user && user.role !== "admin") router.push("/");
  }, [user, isAuthenticated, router]);

  const { data: operators, isLoading: loadingOps } = useQuery({
    queryKey: ["admin-operators"],
    queryFn: async () => {
      const r = await api.get<any>("/admin/operators?limit=50");
      return (r.data?.data ?? r.data ?? []) as Operator[];
    },
    enabled: !!user && user.role === "admin",
  });

  const { data: warehouses, isLoading: loadingWh } = useQuery({
    queryKey: ["admin-warehouses"],
    queryFn: async () => {
      const r = await api.get<any>("/admin/warehouses?limit=50");
      return (r.data?.data ?? r.data ?? []) as Warehouse[];
    },
    enabled: !!user && user.role === "admin",
  });

  const verifyOperator = useMutation({
    mutationFn: (id: string) => api.post(`/admin/operators/${id}/verify`),
    onSuccess: () => { toast.success("Operator verified"); queryClient.invalidateQueries({ queryKey: ["admin-operators"] }); },
    onError: () => toast.error("Failed to verify operator"),
  });

  const approveWarehouse = useMutation({
    mutationFn: (id: string) => api.post(`/admin/warehouses/${id}/approve`),
    onSuccess: () => { toast.success("Warehouse approved"); queryClient.invalidateQueries({ queryKey: ["admin-warehouses"] }); },
    onError: () => toast.error("Failed to approve warehouse"),
  });

  const rejectWarehouse = useMutation({
    mutationFn: (id: string) => api.post(`/admin/warehouses/${id}/reject`, { reason: "Does not meet requirements" }),
    onSuccess: () => { toast.success("Warehouse rejected"); queryClient.invalidateQueries({ queryKey: ["admin-warehouses"] }); },
    onError: () => toast.error("Failed to reject warehouse"),
  });

  if (!user || user.role !== "admin") return null;

  const pendingOps = operators?.filter(o => !o.isVerified) ?? [];
  const verifiedOps = operators?.filter(o => o.isVerified) ?? [];
  const pendingWh = warehouses?.filter(w => w.status === "pending_moderation") ?? [];
  const activeWh = warehouses?.filter(w => w.status === "active") ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage operators and warehouses</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Operators", value: operators?.length ?? 0, icon: Users, color: "blue" },
            { label: "Pending Operators", value: pendingOps.length, icon: Clock, color: "amber" },
            { label: "Total Warehouses", value: warehouses?.length ?? 0, icon: Building2, color: "green" },
            { label: "Pending Review", value: pendingWh.length, icon: AlertTriangle, color: "red" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center mb-2`}>
                <Icon className={`h-4 w-4 text-${color}-600`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {(["operators", "warehouses"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t}
              {t === "operators" && pendingOps.length > 0 && (
                <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingOps.length}</span>
              )}
              {t === "warehouses" && pendingWh.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingWh.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Operators Tab */}
        {tab === "operators" && (
          <div className="space-y-4">
            {loadingOps && <p className="text-gray-500 text-sm">Loading...</p>}
            {!loadingOps && operators?.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">No operators yet</div>
            )}
            {pendingOps.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Pending Verification ({pendingOps.length})
                </h2>
                <div className="space-y-3">
                  {pendingOps.map(op => (
                    <div key={op.id} className="bg-white rounded-xl p-4 shadow-sm border border-amber-200 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{op.companyName}</p>
                        <p className="text-sm text-gray-500">{op.user?.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {op.user?.firstName} {op.user?.lastName} • {new Date(op.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                        onClick={() => verifyOperator.mutate(op.id)}
                        disabled={verifyOperator.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Verify
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {verifiedOps.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Verified ({verifiedOps.length})
                </h2>
                <div className="space-y-2">
                  {verifiedOps.map(op => (
                    <div key={op.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{op.companyName}</p>
                        <p className="text-sm text-gray-500">{op.user?.email}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium shrink-0">Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warehouses Tab */}
        {tab === "warehouses" && (
          <div className="space-y-4">
            {loadingWh && <p className="text-gray-500 text-sm">Loading...</p>}
            {!loadingWh && warehouses?.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100">No warehouses yet</div>
            )}
            {pendingWh.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Pending Review ({pendingWh.length})
                </h2>
                <div className="space-y-3">
                  {pendingWh.map(wh => (
                    <div key={wh.id} className="bg-white rounded-xl p-4 shadow-sm border border-red-200 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{wh.name}</p>
                        <p className="text-sm text-gray-500">{wh.address}, {wh.emirate}</p>
                        <p className="text-xs text-gray-400 mt-1">{wh.operator?.companyName} • {wh.operator?.user?.email}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/warehouse/${wh.id}`} target="_blank"><Eye className="h-4 w-4" /></a>
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approveWarehouse.mutate(wh.id)} disabled={approveWarehouse.isPending}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectWarehouse.mutate(wh.id)} disabled={rejectWarehouse.isPending}>
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeWh.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Active ({activeWh.length})
                </h2>
                <div className="space-y-2">
                  {activeWh.map(wh => (
                    <div key={wh.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{wh.name}</p>
                        <p className="text-sm text-gray-500">{wh.emirate} • {wh.operator?.companyName}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium shrink-0">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
