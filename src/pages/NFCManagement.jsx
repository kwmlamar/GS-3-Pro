import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Nfc, 
  Plus, 
  Search, 
  MapPin,
  Camera,
  Mic,
  FileText,
  Navigation,
  Smartphone,
  Tag,
  CheckCircle,
  ListFilter
} from 'lucide-react';

const NFCManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const nfcTags = [
    {
      id: 1,
      tagId: 'NFC-001-ALPHA',
      location: 'Main Entrance - Building A',
      site: 'Corporate HQ Alpha',
      status: 'Active',
      lastScan: '2 hours ago',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      tagId: 'NFC-002-BETA',
      location: 'Emergency Exit - East Wing',
      site: 'Metro Hospital East',
      status: 'Active',
      lastScan: '45 minutes ago',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 3,
      tagId: 'NFC-003-GAMMA',
      location: 'Security Checkpoint C',
      site: 'Retail Plaza Central',
      status: 'Inactive',
      lastScan: '3 days ago',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    }
  ];

  const gpsLocations = [
    {
      id: 1,
      name: 'Perimeter Point Alpha (North Gate)',
      site: 'Corporate HQ Alpha',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      radius: 50,
      status: 'Active',
      lastCheck: '1 hour ago'
    },
    {
      id: 2,
      name: 'Parking Lot Patrol Zone 3',
      site: 'Metro Hospital East',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      radius: 100,
      status: 'Active',
      lastCheck: '30 minutes ago'
    }
  ];

  const handleAddNFCTag = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleScanTag = (tagId) => {
    toast({
      title: "NFC Tag Scanned",
      description: `Tag ${tagId} scanned successfully. Location and time logged.`
    });
  };

  const handleAddGPSLocation = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleAttachMedia = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
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
            <Nfc className="w-8 h-8 mr-3 text-blue-400" />
            NFC & GPS Management
          </h1>
          <p className="text-gray-400 mt-1">Manage NFC tags and GPS locations for automated check-ins and patrols.</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button onClick={handleAddNFCTag} className="ios-button bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add NFC Tag
          </Button>
          <Button onClick={handleAddGPSLocation} variant="outline" className="ios-button border-slate-600 hover:bg-slate-700">
            <MapPin className="w-4 h-4 mr-2" />
            Add GPS Location
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="nfc_tags" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="nfc_tags" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>NFC Tags</TabsTrigger>
          <TabsTrigger value="gps_locations" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>GPS Locations</TabsTrigger>
          <TabsTrigger value="mobile_scanner" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Mobile Scanner</TabsTrigger>
          <TabsTrigger value="media_attachments" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Media Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="nfc_tags" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Tag className="w-5 h-5 text-blue-400" />
                  <span>NFC Tag Registry</span>
                </CardTitle>
                <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                  <Button variant="outline" size="sm" className="glass-button text-xs">
                    <ListFilter className="w-3.5 h-3.5 mr-1.5" /> Filter by Site
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search NFC tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-400 mt-1">Manage all deployed NFC tags for patrol verification.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nfcTags.filter(tag => tag.tagId.toLowerCase().includes(searchTerm.toLowerCase()) || tag.location.toLowerCase().includes(searchTerm.toLowerCase())).map((tag) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex-1 mb-3 sm:mb-0">
                        <div className="flex items-center space-x-3 mb-1.5">
                          <h3 className="text-white font-semibold">{tag.tagId}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tag.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tag.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{tag.location}</span>
                          </div>
                          <span>•</span>
                          <span>{tag.site}</span>
                          <span>•</span>
                          <span>Last scan: {tag.lastScan}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScanTag(tag.tagId)}
                          className="ios-button border-slate-600 hover:bg-slate-700"
                        >
                          <Nfc className="w-4 h-4 mr-1" />
                          Log Scan
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                          className="ios-button border-slate-600 hover:bg-slate-700"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gps_locations" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Navigation className="w-5 h-5 text-green-400" />
                <span>GPS "Air Tag" Locations</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Manage geofenced GPS locations for automated check-ins.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gpsLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex-1 mb-3 sm:mb-0">
                        <div className="flex items-center space-x-3 mb-1.5">
                          <h3 className="text-white font-semibold">{location.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            location.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {location.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                          <span>{location.site}</span>
                          <span>•</span>
                          <span>Radius: {location.radius}m</span>
                          <span>•</span>
                          <span>Last check: {location.lastCheck}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Coords: {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({ title: "GPS location marked as visited", description: "Automatic check-in logged for officer." })}
                          className="ios-button border-slate-600 hover:bg-slate-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Manual Check-In
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile_scanner" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <span>Mobile NFC Scanner Interface</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Simulated mobile scanner for NFC tag interactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6 p-6 rounded-lg bg-slate-800/40 border border-slate-700">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-600/20 to-purple-700/30 rounded-full flex items-center justify-center border-4 border-blue-500/40 shadow-xl">
                  <Nfc className="w-24 h-24 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Ready to Scan</h3>
                  <p className="text-gray-400 text-sm">Hold your device near an NFC tag to automatically log location and time.</p>
                </div>
                <Button className="ios-button bg-purple-600 hover:bg-purple-700 px-8 py-3 text-base" onClick={() => handleScanTag('DEMO-TAG-001')}>
                  Simulate Scan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media_attachments" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Camera className="w-5 h-5 text-yellow-400" />
                <span>Media Attachments to Scans</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Attach photos, audio, or notes to NFC/GPS check-ins.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Camera, label: 'Take Photo', color: 'blue' },
                    { icon: FileText, label: 'Add Note', color: 'green' },
                    { icon: Mic, label: 'Record Audio', color: 'purple' },
                    { icon: MapPin, label: 'Confirm GPS', color: 'yellow' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-6 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/30 hover:bg-${item.color}-500/20 transition-colors cursor-pointer text-center flex flex-col items-center justify-center h-36`}
                      onClick={handleAttachMedia}
                    >
                      <item.icon className={`w-8 h-8 text-${item.color}-400 mb-2`} />
                      <h3 className="text-white font-medium text-sm">{item.label}</h3>
                    </motion.div>
                  ))}
                </div>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 bg-slate-800/30">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-white font-medium mb-1">Attach Media to Location Scan</h3>
                    <p className="text-gray-400 text-sm mb-3">Enhance patrol reports with visual or audio context.</p>
                    <Button onClick={handleAttachMedia} className="ios-button bg-yellow-600 hover:bg-yellow-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Media to Last Scan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFCManagement;