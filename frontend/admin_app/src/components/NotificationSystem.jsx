import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Bell, X } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8001';

export default function NotificationSystem({ role }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notif) => {
        const id = Date.now();
        setNotifications(prev => [{ ...notif, id }, ...prev]);

        // Auto remove after 10 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 10000);
    }, []);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to Notification Socket');
            socket.emit('join', { role });
        });

        socket.on('notification', (data) => {
            console.log('New Notification:', data);
            addNotification(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [role, addNotification]);

    const removeNotif = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="notification-container" style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 350
        }}>
            <style>{`
        .notif-card {
          background: #1e293b;
          color: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #10b981;
          display: flex;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
            {notifications.map(n => (
                <div key={n.id} className="notif-card">
                    <div style={{ color: '#10b981' }}><Bell size={20} /></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: 4 }}>System Alert</div>
                        <div style={{ fontSize: '13px', opacity: 0.9 }}>{n.message}</div>
                    </div>
                    <button onClick={() => removeNotif(n.id)} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.5, cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
