import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { CalendarDays, Plus, Search, Users, CheckSquare, CalendarCheck2 } from 'lucide-react';
import ScheduleItem from '@/components/scheduling/ScheduleItem';
import OnboardingQueueItem from '@/components/scheduling/OnboardingQueueItem';
import YearlyEventItem from '@/components/scheduling/YearlyEventItem';
import ComplianceCheckCard from '@/components/scheduling/ComplianceCheckCard';

const Scheduling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const schedules = [
    { id: 1, officer: 'John Smith', site: 'Corporate HQ Alpha', shift: 'Day Shift', time: '08:00 - 16:00', date: '2025-07-15', status: 'Confirmed', compliance: 'Qualified' },
    { id: 2, officer: 'Sarah Johnson', site: 'Metro Hospital East', shift: 'Night Shift', time: '20:00 - 06:00', date: '2025-07-15', status: 'Pending', compliance: 'Training Due' },
    { id: 3, officer: 'Mike Rodriguez', site: 'Retail Plaza Central', shift: 'Evening Shift', time: '16:00 - 00:00', date: '2025-07-16', status: 'Confirmed', compliance: 'Qualified' }
  ];

  const yearlyEvents = [
    { id: 1, title: 'Annual Security Refresher Training', type: 'Training', date: '2025-09-15', duration: '3 days', participants: 'All Officers', status: 'Scheduled' },
    { id: 2, title: 'ISO 18788 Compliance Audit', type: 'Audit', date: '2025-11-20', duration: '2 days', participants: 'Management Team', status: 'Scheduled' },
    { id: 3, title: 'Emergency Response Full-Scale Drill', type: 'Drill', date: '2026-01-10', duration: '1 day', participants: 'Site Teams & ERT', status: 'Planned' }
  ];

  const onboardingQueue = [
    { id: 1, name: 'Alex Thompson', position: 'Security Officer', startDate: '2025-07-20', trainingStatus: 'In Progress', credentialsStatus: 'Pending', canSchedule: false },
    { id: 2, name: 'Maria Garcia', position: 'Site Supervisor', startDate: '2025-07-18', trainingStatus: 'Completed', credentialsStatus: 'Approved', canSchedule: true },
    { id: 3, name: 'David Lee', position: 'Security Officer', startDate: '2025-07-22', trainingStatus: 'Scheduled', credentialsStatus: 'Pending', canSchedule: false }
  ];

  const handleCreateSchedule = () => {
    toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const handleScheduleOfficer = (officerId, canSchedule) => {
    if (!canSchedule) {
      toast({ variant: "destructive", title: "Cannot Schedule Officer", description: "Officer must complete all training and credentials before scheduling." });
    } else {
      toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    }
  };

  const iosTabsListStyle = "bg-transparent p-0 space-x-1";
  const iosTabsTriggerStyle = "text-gray-400 data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 border-b-2 border-transparent rounded-none px-4 py-2.5 hover:text-blue-300 transition-all duration-200 text-sm font-medium";
  const iosTabsActiveTriggerStyle = "data-[state=active]:bg-transparent data-[state=active]:shadow-none";

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <CalendarDays className="w-8 h-8 mr-3 text-blue-400" />
            Scheduling System
          </h1>
          <p className="text-gray-400 mt-1">Manage employee schedules with integrated compliance verification.</p>
        </div>
        <Button onClick={handleCreateSchedule} className="ios-button bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create New Schedule
        </Button>
      </motion.div>

      <Tabs defaultValue="schedules" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="schedules" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Current Schedules</TabsTrigger>
          <TabsTrigger value="onboarding" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Onboarding Queue</TabsTrigger>
          <TabsTrigger value="yearly" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Yearly Events</TabsTrigger>
          <TabsTrigger value="compliance" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Compliance Check</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <CalendarCheck2 className="w-5 h-5 text-blue-400" />
                  <span>Active Schedules</span>
                </CardTitle>
                <div className="relative mt-3 sm:mt-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search schedules (officer, site)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <CardDescription className="text-gray-400 mt-1">Overview of all current and upcoming employee schedules.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.filter(s => s.officer.toLowerCase().includes(searchTerm.toLowerCase()) || s.site.toLowerCase().includes(searchTerm.toLowerCase())).map((schedule) => (
                  <ScheduleItem key={schedule.id} schedule={schedule} />
                ))}
                 {schedules.length === 0 && <p className="text-center text-gray-500 py-4">No active schedules found.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Onboarding & Qualification Queue</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Track new hires through the onboarding and qualification process.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingQueue.map((person) => (
                  <OnboardingQueueItem key={person.id} person={person} onSchedule={handleScheduleOfficer} />
                ))}
                {onboardingQueue.length === 0 && <p className="text-center text-gray-500 py-4">Onboarding queue is empty.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <CalendarDays className="w-5 h-5 text-green-400" />
                <span>Annual Event Scheduler</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Plan and manage yearly recurring events and compliance deadlines.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {yearlyEvents.map((event) => (
                  <YearlyEventItem key={event.id} event={event} />
                ))}
                {yearlyEvents.length === 0 && <p className="text-center text-gray-500 py-4">No annual events scheduled.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceCheckCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduling;