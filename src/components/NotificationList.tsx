import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useNotification } from '../context/NotificationContext';
import { Check, Trash2, X, CloudRain, CheckSquare, Bell } from 'lucide-react';

const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    const colorClass = colors[priority as keyof typeof colors] || colors.low;
    
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colorClass}`}>
            {priority}
        </span>
    );
};

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'weather': return <CloudRain className="w-5 h-5 text-blue-500" />;
        case 'task': return <CheckSquare className="w-5 h-5 text-green-500" />;
        default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

export const NotificationList = ({ onClose }: { onClose: () => void }) => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotification();
    const [filter, setFilter] = useState('all');

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        return n.type === filter;
    });

    return (
        <div className="flex flex-col h-[500px] max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={markAllAsRead}
                        className="text-xs text-gray-500 hover:text-green-600 transition-colors font-medium flex items-center gap-1"
                        title="Mark all as read"
                    >
                        <Check className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only">Mark all read</span>
                    </button>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Tabs.Root value={filter} onValueChange={setFilter} className="flex flex-col flex-1 overflow-hidden">
                <Tabs.List className="flex border-b border-gray-100 px-2">
                    {['all', 'weather', 'task'].map(tab => (
                        <Tabs.Trigger 
                            key={tab} 
                            value={tab}
                            className={`flex-1 py-3 text-sm font-medium capitalize outline-none transition-colors border-b-2 ${filter === tab ? 'text-green-600 border-green-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {tab}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                <ScrollArea.Root className="flex-1 overflow-hidden bg-white">
                    <ScrollArea.Viewport className="w-full h-full p-0">
                        {filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <Bell className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">No notifications found.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {filteredNotifications.map(notification => (
                                    <li 
                                        key={notification.id} 
                                        className={`p-4 transition-colors hover:bg-gray-50 group ${notification.is_read ? 'opacity-70' : 'bg-green-50/30'}`}
                                        onMouseEnter={() => !notification.is_read && markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <TypeIcon type={notification.type} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className={`text-sm font-semibold truncate ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <PriorityBadge priority={notification.priority} />
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {formatRelativeTime(notification.created_at)}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5">
                        <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            </Tabs.Root>
        </div>
    );
};
