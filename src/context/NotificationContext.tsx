import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types/notification';
import { notificationApi } from '../services/api';
import { toast } from 'sonner';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: number) => void;
    fetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const fetchNotifications = async () => {
        try {
            const data = await notificationApi.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        fetchNotifications();

        // Determine WS URL
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8000/api/v1';
        const wsBaseUrl = apiBaseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
        
        const websocket = new WebSocket(`${wsBaseUrl}/notifications/ws?token=${token}`);

        websocket.onopen = () => {
            console.log('Connected to notification websocket');
        };

        websocket.onmessage = (event) => {
            try {
                const newNotification: Notification = JSON.parse(event.data);
                setNotifications(prev => [newNotification, ...prev]);
                
                // Show toast for new notification
                if (newNotification.priority === 'high') {
                    toast.error(newNotification.title, {
                        description: newNotification.message,
                        duration: 6000,
                    });
                } else {
                    toast(newNotification.title, {
                        description: newNotification.message,
                        duration: 4000,
                    });
                }
            } catch (e) {
                console.error("Error parsing notification msg", e);
            }
        };

        websocket.onclose = () => {
            console.log('Disconnected from notification websocket');
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await notificationApi.markAsRead(id, { is_read: true });
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        for (const id of unreadIds) {
            await markAsRead(id);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await notificationApi.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
