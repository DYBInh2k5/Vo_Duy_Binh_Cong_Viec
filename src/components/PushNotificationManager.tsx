import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../lib/firebase';
import { Bell, X } from 'lucide-react';

export default function PushNotificationManager() {
  const [token, setToken] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!messaging) return;

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });

    return () => unsubscribe();
  }, []);

  const requestPermission = async () => {
    if (!messaging) return;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // Cần lấy từ Firebase Console > Project Settings > Cloud Messaging
        });
        if (currentToken) {
          setToken(currentToken);
          console.log('FCM Token:', currentToken);
          setShowPrompt(false);
        }
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
    }
  };

  useEffect(() => {
    const hasPrompted = localStorage.getItem('fcm_prompted');
    if (!hasPrompted) {
      setTimeout(() => setShowPrompt(true), 5000);
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[60] bg-bauhaus-yellow border-4 border-black p-6 hard-shadow max-w-sm animate-bounce-subtle">
      <button 
        onClick={() => {
          setShowPrompt(false);
          localStorage.setItem('fcm_prompted', 'true');
        }}
        className="absolute -top-3 -right-3 bg-bauhaus-red text-white p-1 border-2 border-black"
      >
        <X size={16} />
      </button>
      <div className="flex gap-4 items-center">
        <div className="bg-black text-white p-3 rotate-3">
          <Bell size={24} />
        </div>
        <div>
          <p className="font-black uppercase text-xs tracking-widest mb-1">Stay Synchronized</p>
          <p className="text-sm font-bold leading-tight mb-3">Enable BAUHAUS push notifications for lab updates?</p>
          <button 
            onClick={requestPermission}
            className="w-full bg-black text-white py-2 font-black uppercase text-xs tracking-widest hover:bg-bauhaus-blue transition-colors"
          >
            Enable Access
          </button>
        </div>
      </div>
    </div>
  );
}
