'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function OperatorSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="mt-2 text-text-secondary">Manage your operator account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Notification preferences and account configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary">
            Settings configuration is coming soon. To update your business profile, visit the{' '}
            <a href="/operator/profile" className="text-primary-600 hover:underline">
              Profile page
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
