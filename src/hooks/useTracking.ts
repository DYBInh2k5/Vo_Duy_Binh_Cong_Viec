import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SESSION_KEY = 'cody_analytics_session_id';

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};

export const useTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const handlePageView = async () => {
      const pagePath = location.pathname;
      const pageTitle = document.title || 'coDY Portfolio';
      const sessionId = getSessionId();
      const referrer = typeof document !== 'undefined' ? document.referrer || 'none' : 'none';

      // Generate a clean valid document ID
      const viewId = 'view_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

      try {
        await setDoc(doc(db, 'page_views', viewId), {
          pagePath,
          pageTitle,
          timestamp: serverTimestamp(),
          sessionId,
          referrer,
        });
      } catch (error) {
        // Handle firestore constraint validation tracking errors silently on client to avoid blocking user flow
        console.error('[Telemetry] Page navigation log failed:', error);
      }
    };

    // Debounce slightly to ensure page title is updated by any component useSEO hook
    const timer = setTimeout(() => {
      handlePageView();
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};
