import React, { useState, useEffect } from 'react';
import { db, auth, loginWithGoogle } from '../lib/firebase';
import { doc, getDoc, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Send, LogIn, User } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface Entry {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  message: string;
  timestamp: Timestamp;
}

const Guestbook = () => {
  const [user] = useAuthState(auth);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Entry[];
        setEntries(data);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'guestbook');
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'guestbook'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        message: newMessage,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'guestbook');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <header className="mb-12">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Guestbook</h1>
        <p className="text-xl text-gray-600 border-l-4 border-bauhaus-red pl-4">
          Leave a message, mark your visit. Real-time community wall.
        </p>
      </header>

      {/* Message Form */}
      <section className="mb-16 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {!user ? (
          <div className="text-center py-8">
            <p className="mb-6 font-medium">Please sign in to leave a message.</p>
            <button 
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-bold hover:bg-bauhaus-red transition-colors"
            >
              <LogIn size={20} /> Sign in with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border-2 border-black" />
              <span className="font-bold uppercase tracking-wider">{user.displayName}</span>
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Your Bauhaus manifest..."
              rows={3}
              className="w-full p-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/20 resize-none font-medium"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="flex items-center gap-2 bg-black text-white px-8 py-3 font-black uppercase tracking-widest disabled:opacity-50 hover:bg-bauhaus-blue transition-colors ml-auto"
            >
              <Send size={18} /> Protocol Post
            </button>
          </form>
        )}
      </section>

      {/* Entries List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-6 bg-white border-2 border-black relative overflow-hidden group"
            >
              <div className="flex gap-4 items-start relative z-10">
                <div className="flex-shrink-0">
                  {entry.userPhoto ? (
                    <img src={entry.userPhoto} alt="" className="w-12 h-12 border-2 border-black" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center border-2 border-black">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black uppercase text-sm tracking-widest">{entry.userName}</h3>
                    <span className="text-[10px] font-mono text-gray-400">
                      {entry.timestamp?.toDate().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-lg leading-snug font-medium text-gray-800 italic">
                    "{entry.message}"
                  </p>
                </div>
              </div>
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-2 h-full bg-black group-hover:bg-bauhaus-red transition-colors" />
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-black border-t-bauhaus-red rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guestbook;
