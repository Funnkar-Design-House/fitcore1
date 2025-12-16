import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Bell,
  Palette,
  Shield,
  Database,
  Mail,
  CreditCard,
  Clock,
  Globe,
  Save,
} from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: 'Settings saved',
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your gym settings and preferences
          </p>
        </div>

        <Tabs defaultValue="gym" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="gym" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Gym Info</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Gym Information */}
          <TabsContent value="gym" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gym Information
                </CardTitle>
                <CardDescription>
                  Update your gym's basic information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gym-name">Gym Name</Label>
                    <Input id="gym-name" placeholder="FitCore Gym" defaultValue="FitCore Gym" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gym-email">Email Address</Label>
                    <Input id="gym-email" type="email" placeholder="info@fitcore.com" defaultValue="info@fitcore.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gym-phone">Phone Number</Label>
                    <Input id="gym-phone" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gym-website">Website</Label>
                    <Input id="gym-website" placeholder="www.fitcore.com" defaultValue="www.fitcore.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gym-address">Address</Label>
                  <Textarea
                    id="gym-address"
                    placeholder="Enter gym address"
                    defaultValue="123 Fitness Street, Mumbai, Maharashtra 400001"
                    rows={3}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="opening-time">Opening Time</Label>
                      <Input id="opening-time" type="time" defaultValue="06:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-time">Closing Time</Label>
                      <Input id="closing-time" type="time" defaultValue="22:00" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="weekly-off">Weekly Off Days</Label>
                    <Select defaultValue="none">
                      <SelectTrigger id="weekly-off">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Weekly Off</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="sunday-monday">Sunday & Monday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => handleSave('Gym Information')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="expiry-alerts">Membership Expiry Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when memberships are about to expire
                      </p>
                    </div>
                    <Switch id="expiry-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-reminders">Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send payment reminders to members
                      </p>
                    </div>
                    <Switch id="payment-reminders" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-member-alerts">New Member Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new members join
                      </p>
                    </div>
                    <Switch id="new-member-alerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="daily-summary">Daily Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily summary of gym activities
                      </p>
                    </div>
                    <Switch id="daily-summary" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Alert Timing</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-days">Expiry Alert (Days Before)</Label>
                      <Select defaultValue="7">
                        <SelectTrigger id="expiry-days">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="5">5 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary-time">Daily Summary Time</Label>
                      <Input id="summary-time" type="time" defaultValue="20:00" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Mail className="h-5 w-5" />
                    Communication Channels
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via email
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via SMS
                        </p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications via WhatsApp
                        </p>
                      </div>
                      <Switch id="whatsapp-notifications" />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Notification')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Display
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">₹ INR (Indian Rupee)</SelectItem>
                      <SelectItem value="usd">$ USD (US Dollar)</SelectItem>
                      <SelectItem value="eur">€ EUR (Euro)</SelectItem>
                      <SelectItem value="gbp">£ GBP (British Pound)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Dashboard Display</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-animations">Enable Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Show animated transitions and effects
                        </p>
                      </div>
                      <Switch id="show-animations" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-view">Compact View</Label>
                        <p className="text-sm text-muted-foreground">
                          Display more information in less space
                        </p>
                      </div>
                      <Switch id="compact-view" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-sidebar">Show Sidebar Labels</Label>
                        <p className="text-sm text-muted-foreground">
                          Display text labels in the navigation sidebar
                        </p>
                      </div>
                      <Switch id="show-sidebar" defaultChecked />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Appearance')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access Control
                </CardTitle>
                <CardDescription>
                  Manage your security settings and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Access Control</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="session-timeout">Auto Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after period of inactivity
                        </p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="timeout-duration">Timeout Duration</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="timeout-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 Minutes</SelectItem>
                        <SelectItem value="30">30 Minutes</SelectItem>
                        <SelectItem value="60">1 Hour</SelectItem>
                        <SelectItem value="120">2 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-encryption">Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">
                          Encrypt sensitive member data
                        </p>
                      </div>
                      <Switch id="data-encryption" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="activity-logging">Activity Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Keep logs of all system activities
                        </p>
                      </div>
                      <Switch id="activity-logging" defaultChecked />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Security')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Advanced configuration and data management options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <CreditCard className="h-5 w-5" />
                    Payment Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-cash">Accept Cash Payments</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow cash payment method
                        </p>
                      </div>
                      <Switch id="enable-cash" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-card">Accept Card Payments</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow debit/credit card payments
                        </p>
                      </div>
                      <Switch id="enable-card" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enable-upi">Accept UPI Payments</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow UPI payment method
                        </p>
                      </div>
                      <Switch id="enable-upi" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" placeholder="fitcore@paytm" defaultValue="fitcore@paytm" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Database className="h-5 w-5" />
                    Data Management
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-backup">Automatic Backups</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically backup data daily
                        </p>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-time">Backup Time</Label>
                      <Input id="backup-time" type="time" defaultValue="02:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention">Data Retention Period</Label>
                      <Select defaultValue="12">
                        <SelectTrigger id="retention">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                          <SelectItem value="60">5 Years</SelectItem>
                          <SelectItem value="0">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Export Data</Button>
                      <Button variant="outline">Import Data</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <Globe className="h-5 w-5" />
                    API & Integrations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="api-access">Enable API Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow external integrations via API
                        </p>
                      </div>
                      <Switch id="api-access" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex gap-2">
                        <Input id="api-key" type="password" value="••••••••••••••••" readOnly />
                        <Button variant="outline">Regenerate</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Advanced')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
