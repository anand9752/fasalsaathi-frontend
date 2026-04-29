import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useNotification } from '../context/NotificationContext';
import { NotificationList } from './NotificationList';
import { motion } from 'framer-motion';

export const NotificationBell = () => {
    const { unreadCount } = useNotification();
    const [open, setOpen] = useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button 
                    className="fixed bottom-6 left-6 p-4 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors z-50 focus:outline-none focus:ring-4 focus:ring-green-300"
                    aria-label="Notifications"
                >
                    <motion.div
                        animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
                    >
                        <Bell className="w-6 h-6" />
                    </motion.div>
                    
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -mt-1 -mr-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content 
                    className="z-[100] w-80 md:w-96 ml-6 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden" 
                    sideOffset={10} 
                    side="top" 
                    align="start"
                >
                    <NotificationList onClose={() => setOpen(false)} />
                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
