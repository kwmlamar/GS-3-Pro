import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Video, 
  Plus, 
  QrCode, 
  Users,
  Play,
  Square,
  Mic,
  Camera,
  Share2,
  MessageSquare,
  FileQuestion,
  BookOpen
} from 'lucide-react';

const LiveClasses = () => {
  const [isLive, setIsLive] = useState(false);
  const [participants, setParticipants] = useState(0);
  const { toast } = useToast();

  const liveClasses = [
    {
      id: 1,
      title: 'Advanced Threat Assessment Techniques',
      instructor: 'Sarah Johnson',
      participants: 23,
      status: 'Live',
      startTime: '2:00 PM',
      duration: '2 hours'
    },
    {
      id: 2,
      title: 'Emergency Response Protocols Update',
      instructor: 'Mike Rodriguez',
      participants: 0,
      status: 'Scheduled',
      startTime: '4:00 PM',
      duration: '1.5 hours'
    },
    {
      id: 3,
      title: 'Latest Security Technology Briefing',
      instructor: 'Lisa Chen',
      participants: 0,
      status: 'Scheduled',
      startTime: 'Tomorrow 10:00 AM',
      duration: '1 hour'
    }
  ];

  const handleStartClass = () => {
    setIsLive(true);
    setParticipants(Math.floor(Math.random() * 30) + 5);
    toast({
      title: "Live Class Started!",
      description: "Students can now join using the QR code or link."
    });
  };

  const handleEndClass = () => {
    setIsLive(false);
    setParticipants(0);
    toast({
      title: "Class Ended",
      description: "Recording saved to class library. Attendance logged."
    });
  };

  const handleGenerateQR = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleSendQuiz = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
            Live Training Classes
          </h1>
          <p className="text-gray-400 mt-1">Conduct real-time training sessions with interactive features.</p>
        </div>
        <Button onClick={isLive ? handleEndClass : handleStartClass} className={`ios-button mt-4 sm:mt-0 ${isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isLive ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isLive ? 'End Current Class' : 'Start New Class'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-red-400" />
                  <span>Live Stream Control Panel</span>
                </div>
                {isLive && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-sm font-medium">LIVE</span>
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your ongoing or upcoming live session.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="aspect-video bg-slate-900 rounded-lg border-2 border-slate-700 flex items-center justify-center">
                  {isLive ? (
                    <div className="text-center p-4">
                      <Video className="w-16 h-16 text-red-400 mx-auto mb-3" />
                      <p className="text-white font-medium text-lg">Live Stream Active</p>
                      <p className="text-gray-400 text-sm">{participants} participants connected</p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Camera className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">Camera Preview / Waiting Room</p>
                      <p className="text-gray-500 text-sm">Click "Start New Class" to begin broadcasting.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <Button variant="outline" className="ios-button border-slate-600 hover:bg-slate-700">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="ios-button border-slate-600 hover:bg-slate-700">
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="ios-button border-slate-600 hover:bg-slate-700" onClick={handleGenerateQR}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                   <Button variant="outline" className="ios-button border-slate-600 hover:bg-slate-700" onClick={() => toast({ title: "🚧 Feature Not Implemented" })}>
                    <Users className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <QrCode className="w-5 h-5 text-purple-400" />
                <span>Student Access</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div className="w-36 h-36 bg-white p-2 rounded-lg mx-auto flex items-center justify-center">
                  <img  alt="QR Code for Live Class" className="w-full h-full" src="https://images.unsplash.com/photo-1626682561113-d1db402cc866" />
                </div>
                <div>
                  <p className="text-white font-medium">Scan to Join Live Class</p>
                  <p className="text-gray-400 text-xs mt-1">Or share direct link: secureops.pro/live/classXYZ</p>
                </div>
                <Button 
                  onClick={handleGenerateQR} 
                  className="w-full ios-button bg-purple-600 hover:bg-purple-700" 
                >
                  Generate New Access Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileQuestion className="w-5 h-5 text-yellow-400" />
                <span>Interactive Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <Button 
                  onClick={handleSendQuiz} 
                  className="w-full ios-button bg-yellow-600 hover:bg-yellow-700 justify-start"
                >
                  <FileQuestion className="w-4 h-4 mr-2" />
                  Send Pop Quiz
                </Button>
                <Button 
                  onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} 
                  className="w-full ios-button bg-blue-600 hover:bg-blue-700 justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Open Q&A Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Video className="w-5 h-5 text-blue-400" />
              <span>Scheduled & Upcoming Classes</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Manage your planned live training sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveClasses.map((classItem) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-1.5">
                        <h3 className="text-white font-semibold">{classItem.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          classItem.status === 'Live' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {classItem.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                        <span>Instructor: {classItem.instructor}</span>
                        <span>•</span>
                        <span>Start: {classItem.startTime}</span>
                        <span>•</span>
                        <span>Duration: {classItem.duration}</span>
                        {classItem.status === 'Live' && (
                          <>
                            <span>•</span>
                            <span>{classItem.participants} participants</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                        className="ios-button border-slate-600 hover:bg-slate-700"
                      >
                        {classItem.status === 'Live' ? 'Join Session' : 'Manage Class'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LiveClasses;