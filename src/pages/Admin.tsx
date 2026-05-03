import { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { PROJECTS, EXPERIENCE } from '../constants';
import { Layout, Plus, Trash2, Edit2, LogOut, Save, RefreshCw, Layers, BookOpen, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'blogs'>('projects');
  const [data, setData] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchData = async () => {
    if (!user) return;
    const snapshot = await getDocs(collection(db, activeTab));
    setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user, activeTab]);

  const handleSyncInitialData = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      // Sync Projects
      for (const p of PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), { ...p, order: parseInt(p.id) });
      }
      // Sync Experience
      for (let i = 0; i < EXPERIENCE.length; i++) {
        const exp = EXPERIENCE[i];
        await addDoc(collection(db, 'experience'), { ...exp, order: i });
      }
      alert("Initial data synced to Firestore!");
      fetchData();
    } catch (error) {
      alert("Sync failed: " + (error as any).message);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bauhaus-black text-white">
      <RefreshCw className="animate-spin" size={48} />
    </div>
  );

  if (!user || user.email !== "binhvo20055@gmail.com") {
    return (
      <div className="min-h-screen bg-bauhaus-black flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-8 border-bauhaus-red p-12 max-w-md w-full hard-shadow text-center"
        >
          <h1 className="text-4xl font-black uppercase mb-8 italic">RESTRICTED SPACE</h1>
          <p className="mb-12 font-bold opacity-60">This dashboard is for coDY only. Please identify yourself.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-bauhaus-blue text-white py-4 font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all"
          >
            Authenticate via Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bauhaus-off-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bauhaus-black text-white border-r-4 border-black flex flex-col">
        <div className="p-8 border-b-4 border-bauhaus-red bg-bauhaus-red">
          <h2 className="text-3xl font-black italic">coDY CMS</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-4">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-4 p-4 font-black uppercase transition-all ${activeTab === 'projects' ? 'bg-bauhaus-blue shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'hover:bg-white/10'}`}
          >
            <Layers size={20} /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-4 p-4 font-black uppercase transition-all ${activeTab === 'experience' ? 'bg-bauhaus-yellow text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'hover:bg-white/10'}`}
          >
            <Briefcase size={20} /> Experience
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-4 p-4 font-black uppercase transition-all ${activeTab === 'blogs' ? 'bg-bauhaus-red shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'hover:bg-white/10'}`}
          >
            <BookOpen size={20} /> Blog Posts
          </button>
        </nav>

        <div className="p-4 border-t-4 border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.photoURL || ""} alt="" className="w-10 h-10 border-2 border-white rounded-none" />
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate uppercase">{user.displayName}</p>
              <p className="text-[10px] opacity-60 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white text-black font-black uppercase text-xs border-2 border-white hover:bg-transparent hover:text-white transition-all"
          >
            <LogOut size={14} /> System Exit
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter">{activeTab}</h1>
            <p className="opacity-60 italic font-bold uppercase">Managing coDY's digital archives.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSyncInitialData}
              disabled={isSyncing}
              className="bg-bauhaus-yellow px-6 py-3 font-black uppercase border-4 border-black hard-shadow hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            >
              {isSyncing ? "Syncing..." : "Sync Constants"}
            </button>
            <button className="bg-bauhaus-blue text-white px-6 py-3 font-black uppercase border-4 border-black hard-shadow hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2">
              <Plus size={24} /> Add New
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {data.length === 0 ? (
            <div className="p-20 border-4 border-dashed border-black text-center opacity-30">
              <p className="text-2xl font-black">NO DATA ENTRIES FOUND</p>
              <p>Run sync or click 'Add New' to begin.</p>
            </div>
          ) : (
            data.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border-4 border-black p-6 flex justify-between items-center hard-shadow"
              >
                <div className="flex gap-6 items-center">
                  <div className={`w-12 h-12 bg-bauhaus-${item.color || 'black'} border-2 border-black flex items-center justify-center text-white font-black`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase">{item.title || item.company}</h3>
                    <p className="text-sm opacity-60 font-bold italic">{item.tagline || item.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 border-2 border-black hover:bg-bauhaus-yellow transition-all"><Edit2 size={18} /></button>
                  <button 
                    onClick={async () => {
                      if(confirm("Delete this entry?")) {
                        await deleteDoc(doc(db, activeTab, item.id));
                        fetchData();
                      }
                    }}
                    className="p-3 border-2 border-black hover:bg-bauhaus-red hover:text-white transition-all"
                  ><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
