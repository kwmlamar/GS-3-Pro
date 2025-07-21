import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  MessageSquare, 
  Send, 
  Radio,
  Users,
  Mic,
  PhoneCall,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Paperclip
} from 'lucide-react';

const Messaging = () => {
  const [message, setMessage] = useState('');
  const [radioChannel, setRadioChannel] = useState('Channel 1 - Main');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const conversations = [
    {
      id: 1,
      name: 'Site Alpha Team',
      lastMessage: 'All clear on perimeter check. Standing by for next instructions.',
      time: '2 min ago',
      unread: 0,
      type: 'group',
      status: 'online',
      avatar: 'SA'
    },
    {
      id: 2,
      name: 'John Smith (Officer)',
      lastMessage: 'Incident report #IR-0045 submitted for review.',
      time: '15 min ago',
      unread: 2,
      type: 'direct',
      status: 'online',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Emergency Response Channel',
      lastMessage: 'Drill completed successfully. All teams accounted for.',
      time: '1 hour ago',
      unread: 0,
      type: 'emergency',
      status: 'active',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'Management Group',
      lastMessage: 'Weekly operations meeting scheduled for Friday 10 AM.',
      time: '3 hours ago',
      unread: 1,
      type: 'group',
      status: 'online',
      avatar: 'MG'
    }
  ];

  const radioChannels = [
    { id: 1, name: 'Channel 1 - Main Ops', users: 23, status: 'active' },
    { id: 2, name: 'Channel 2 - Emergency', users: 8, status: 'standby' },
    { id: 3, name: 'Channel 3 - Site Bravo', users: 12, status: 'active' },
    { id: 4, name: 'Channel 4 - Management', users: 5, status: 'private' }
  ];

  const messages = [
    { id: 1, sender: 'Sarah Johnson', content: 'Perimeter check complete. All secure.', time: '14:32', type: 'received' },
    { id: 2, sender: 'You', content: 'Copy that. Good work. Any anomalies to report?', time: '14:33', type: 'sent' },
    { id: 3, sender: 'Sarah Johnson', content: 'Negative, all clear. Sector 4 camera seems a bit foggy, might need cleaning.', time: '14:34', type: 'received' },
    { id: 4, sender: 'Mike Rodriguez', content: 'Maintenance crew arriving at 15:00 for camera checks.', time: '14:35', type: 'received' }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your message has been delivered to Site Alpha Team."
    });
    setMessage('');
  };

  const handleRadioTransmit = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleEmergencyBroadcast = () => {
    toast({
      title: "Emergency Broadcast Sent",
      description: "Critical alert dispatched to all active personnel and channels."
    });
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
            <MessageSquare className="w-8 h-8 mr-3 text-blue-400" />
            Real-Time Communications
          </h1>
          <p className="text-gray-400 mt-1">Instant messaging and radio system for seamless operations.</p>
        </div>
        <Button onClick={handleEmergencyBroadcast} className="ios-button bg-red-600 hover:bg-red-700 mt-4 sm:mt-0">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Emergency Broadcast
        </Button>
      </motion.div>

      <Tabs defaultValue="messaging" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="messaging" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Instant Messaging</TabsTrigger>
          <TabsTrigger value="radio" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Radio System</TabsTrigger>
          <TabsTrigger value="emergency_log" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Emergency Log</TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="ios-card h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Conversations</span>
                  </CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search chats..." 
                      className="pl-8 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto scrollbar-hide pr-1">
                  <div className="space-y-2">
                    {conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((conv) => (
                      <div
                        key={conv.id}
                        className="p-3 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 transition-colors cursor-pointer border border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              conv.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-white font-medium text-sm">{conv.name}</span>
                          </div>
                          {conv.unread > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 font-semibold">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs truncate">{conv.lastMessage}</p>
                        <p className="text-gray-500 text-xs mt-0.5 text-right">{conv.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="ios-card h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>Site Alpha Team</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-400">23 online</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-slate-900/30 rounded-lg scrollbar-hide">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-2.5 rounded-xl shadow ${
                          msg.type === 'sent' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-slate-700 text-white rounded-bl-none'
                        }`}>
                          {msg.type === 'received' && (
                            <p className="text-xs text-blue-300 mb-0.5 font-medium">{msg.sender}</p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs opacity-70 mt-1 ${msg.type === 'sent' ? 'text-blue-200' : 'text-slate-400'} text-right`}>{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2 items-center pt-2 border-t border-slate-700">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-400">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="radio" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="ios-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Radio className="w-5 h-5 text-green-400" />
                    <span>Radio Control Panel</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">Push-to-talk and channel management.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 text-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-green-600/20 to-emerald-700/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/40 shadow-lg">
                      <Radio className="w-20 h-20 text-green-400" />
                    </div>
                    <p className="text-white font-semibold text-lg">{radioChannel}</p>
                    <p className="text-gray-400 text-sm -mt-2">{radioChannels.find(c => c.name === radioChannel)?.users || 0} users connected</p>

                    <div className="flex justify-center space-x-4">
                      <Button 
                        onClick={handleRadioTransmit}
                        className="ios-button bg-green-600 hover:bg-green-700 px-8 py-6 text-lg rounded-xl"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Push to Talk
                      </Button>
                      <Button 
                        variant="outline" 
                        className="ios-button border-slate-600 hover:bg-slate-700 p-4 rounded-xl"
                        onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                      >
                        <PhoneCall className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="ios-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>Radio Channels</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">Select an active radio channel.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-y-auto scrollbar-hide max-h-[300px]">
                  <div className="space-y-2.5">
                    {radioChannels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                          channel.name === radioChannel 
                            ? 'bg-green-500/20 border-green-500/40 ring-2 ring-green-500' 
                            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-700/60'
                        }`}
                        onClick={() => setRadioChannel(channel.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium text-sm">{channel.name}</p>
                            <p className="text-gray-400 text-xs">{channel.users} users</p>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <div className={`w-2 h-2 rounded-full ${
                              channel.status === 'active' ? 'bg-green-500' :
                              channel.status === 'standby' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-xs text-gray-400 capitalize">{channel.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="emergency_log" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Emergency Communications Log</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Record of all critical alerts and broadcasts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: 'Drill', message: 'Fire drill completed - All personnel accounted for. Duration: 15 mins.', time: '2 hours ago', status: 'resolved' },
                  { type: 'Alert', message: 'Severe weather warning issued for Sector Gamma. Secure outdoor equipment immediately.', time: '1 day ago', status: 'resolved' },
                  { type: 'Incident', message: 'Medical emergency reported at Building A, Floor 3. EMS dispatched.', time: '3 days ago', status: 'active_monitoring' }
                ].map((comm, index) => (
                  <div key={index} className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2.5 mb-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            comm.type === 'Drill' ? 'bg-blue-500/20 text-blue-400' :
                            comm.type === 'Alert' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {comm.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${comm.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {comm.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white text-sm">{comm.message}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5 ml-3 whitespace-nowrap">{comm.time}</p>
                    </div>
                  </div>
                ))}
                 {messages.length === 0 && <p className="text-center text-gray-500 py-4">No emergency communications logged yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messaging;