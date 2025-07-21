import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ onMenuClick, userRole }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate(0);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Search Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  }

  const handleNotifications = () => {
    toast({
      title: "🚧 Notifications Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  }

  const handleProfile = () => {
    toast({
      title: "🚧 Profile Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="glass-effect border-b border-slate-700/50 px-4 sm:px-6 py-3 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Global Search..."
              className="pl-10 w-64 md:w-80 bg-slate-700/30 border-slate-600 text-white placeholder:text-slate-400 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
            />
          </form>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotifications}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50 relative rounded-full"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800 animate-pulse"></span>
          </Button>
          
          {userRole === 'admin' && (
            <Link to="/admin-settings">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-full"
                title="Admin Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          )}

          <div className="flex items-center space-x-2">
            <Avatar onClick={handleProfile} className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-xs">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            {userRole && <span className="text-xs text-slate-400 hidden md:inline">{userRole.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-slate-300 hover:text-red-400 hover:bg-red-500/20 rounded-full"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;