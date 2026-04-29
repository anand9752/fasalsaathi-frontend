export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: string; // 'weather', 'task', 'system'
    priority: string; // 'high', 'medium', 'low'
    is_read: boolean;
    created_at: string;
}

export interface NotificationUpdate {
    is_read: boolean;
}
