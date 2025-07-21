import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, AlertTriangle, CheckCircle, AlertCircle, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

const MIN_WIDTH = 250;
const MIN_HEIGHT = 100;
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

const PerformanceTicker = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 370, y: 50 });
  const [size, setSize] = useState({ width: 350, height: 180 });
  const [alerts, setAlerts] = useState([]);
  const { toast } = useToast();
  const tickerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, message, type, ticker_status, created_at')
          .in('ticker_status', ['red', 'yellow', 'orange', 'green'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching ticker alerts:", error);
          toast({ variant: "destructive", title: "Ticker Error", description: "Could not load alerts." });
          return;
        }
        
        const formattedAlerts = data.map(alert => {
          let icon = AlertCircle;
          let color = 'bg-slate-700/80 hover:bg-slate-600/80';
          switch (alert.ticker_status) {
            case 'red':
              icon = AlertCircle;
              color = 'bg-red-500/80 hover:bg-red-400/80';
              break;
            case 'yellow':
            case 'orange':
              icon = AlertTriangle;
              color = 'bg-yellow-500/80 hover:bg-yellow-400/80';
              break;
            case 'green':
              icon = CheckCircle;
              color = 'bg-green-500/80 hover:bg-green-400/80';
              break;
            default:
              icon = AlertCircle;
          }
          return { ...alert, icon, color };
        });
        setAlerts(formattedAlerts);

      } catch (err) {
        console.error("Ticker fetch exception:", err);
        toast({ variant: "destructive", title: "Ticker Exception", description: "An error occurred while fetching alerts." });
      }
    };

    fetchAlerts();
    
    const channel = supabase.channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleAlertClick = (alert) => {
    toast({
      title: `Alert: ${alert.type || 'Notification'}`,
      description: alert.message,
      variant: alert.ticker_status === 'red' ? 'destructive' : 'default',
    });
  };

  const handleDragResize = (event, info) => {
    if (!isResizing) return;
    setSize(prevSize => ({
      width: Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, prevSize.width + info.delta.x)),
      height: Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, prevSize.height + info.delta.y))
    }));
  };
  
  const handleDragHeader = (event, info) => {
    setPosition(prevPos => ({
      x: Math.max(0, Math.min(window.innerWidth - size.width, prevPos.x + info.delta.x)),
      y: Math.max(0, Math.min(window.innerHeight - size.height, prevPos.y + info.delta.y))
    }));
  };

  if (!isVisible) return null;

  return (
    <motion.div
      ref={tickerRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 1000,
      }}
      className="glass-effect rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-700/50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.div
        drag
        dragConstraints={{ left: 0, top: 0, right: window.innerWidth - size.width, bottom: window.innerHeight - size.height }}
        dragMomentum={false}
        onDrag={handleDragHeader}
        className="flex items-center justify-between p-2.5 border-b border-slate-700/30 bg-slate-800/50 cursor-move"
      >
        <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Live Alerts</span>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 text-slate-400 hover:text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 text-slate-400 hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 p-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        <AnimatePresence>
          {alerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-slate-500 text-xs"
            >
              <CheckCircle className="w-6 h-6 mb-1" />
              No active alerts.
            </motion.div>
          )}
          {alerts.slice(0, isExpanded ? 10 : Math.floor((size.height - 60) / 40) || 1).map((alert, index) => (
            <motion.div
              key={alert.id || index} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: index * 0.05 }}
              className={cn(
                "flex items-center space-x-2 p-1.5 rounded-md mb-1.5 cursor-pointer transition-all duration-150 ease-in-out",
                alert.color,
                "text-white shadow-sm hover:shadow-md"
              )}
              onClick={() => handleAlertClick(alert)}
            >
              <alert.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs truncate" title={alert.message}>{alert.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={() => setIsResizing(true)}
        onDragEnd={() => setIsResizing(false)}
        onDrag={handleDragResize}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-center justify-center text-slate-500 hover:text-sky-300"
        title="Resize Ticker"
      >
        <GripVertical className="w-3 h-3 transform rotate-45" />
      </motion.div>
    </motion.div>
  );
};

export default PerformanceTicker;