'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettingsPage(): React.ReactElement {
  const [portalName, setPortalName] = useState('Placement Admin');
  const [supportEmail, setSupportEmail] = useState('placement@naikcollege.org');
  const [contactNumber, setContactNumber] = useState('+91 240-2481743');

  return (
    <section className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
        <p className='text-sm text-muted-foreground'>Configure portal-level details and communication preferences.</p>
      </div>

      <Tabs defaultValue='general' className='space-y-4'>
        <TabsList className='grid w-full max-w-md grid-cols-3'>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>

        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage branding and default contact details for the placement portal.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='portalName'>Portal Name</Label>
                <Input id='portalName' value={portalName} onChange={(e) => setPortalName(e.target.value)} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='supportEmail'>Support Email</Label>
                <Input id='supportEmail' value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='contactNumber'>Contact Number</Label>
                <Input id='contactNumber' value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              </div>
              <Button onClick={() => toast.success('General settings updated')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control which events trigger admin notifications.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between rounded-md border p-3'>
                <span className='text-sm'>New company registration alert</span>
                <Button variant='outline' size='sm' onClick={() => toast.success('Preference saved')}>
                  Enabled
                </Button>
              </div>
              <div className='flex items-center justify-between rounded-md border p-3'>
                <span className='text-sm'>Selection confirmation email</span>
                <Button variant='outline' size='sm' onClick={() => toast.success('Preference saved')}>
                  Enabled
                </Button>
              </div>
              <div className='flex items-center justify-between rounded-md border p-3'>
                <span className='text-sm'>Daily summary report</span>
                <Button variant='outline' size='sm' onClick={() => toast.success('Preference saved')}>
                  Disabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure session and role protection controls.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between rounded-md border p-3'>
                <span className='text-sm'>Session timeout (minutes)</span>
                <Input defaultValue='30' className='w-24' />
              </div>
              <div className='flex items-center justify-between rounded-md border p-3'>
                <span className='text-sm'>Two-factor authentication</span>
                <Button variant='outline' size='sm' onClick={() => toast.success('2FA preference updated')}>
                  Optional
                </Button>
              </div>
              <Button onClick={() => toast.success('Security settings saved')}>Update Security</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
