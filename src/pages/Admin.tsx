import { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, db, storage } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { PROJECTS, EXPERIENCE } from '../constants';
import { Layout, Plus, Trash2, Edit2, LogOut, Save, RefreshCw, Layers, BookOpen, Briefcase, X, Upload, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'blogs' | 'contacts'>('projects');
  const [data, setData] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchData = async () => {
    if (!user) return;
    const path = activeTab;
    try {
      if (path === 'contacts') {
        const snapshot = await getDocs(collection(db, 'contacts'));
        setContacts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        const snapshot = await getDocs(collection(db, path));
        setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
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
        const path = `projects/${p.id}`;
        try {
          await setDoc(doc(db, 'projects', p.id), { ...p, order: parseInt(p.id) });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
      }
      // Sync Experience
      for (let i = 0; i < EXPERIENCE.length; i++) {
        const exp = EXPERIENCE[i];
        const path = 'experience';
        try {
          await addDoc(collection(db, path), { ...exp, order: i });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }
      alert("Initial data synced to Firestore!");
      fetchData();
    } catch (error) {
      console.error("Sync Error:", error);
      alert("Sync failed: " + (error instanceof Error ? error.message : "Security Constraint Violation"));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const path = activeTab;

    try {
      if (currentItem.id) {
        // Update
        const docRef = doc(db, activeTab, currentItem.id);
        await updateDoc(docRef, currentItem).catch(err => handleFirestoreError(err, OperationType.UPDATE, `${activeTab}/${currentItem.id}`));
      } else {
        // Create
        await addDoc(collection(db, activeTab), { 
          ...currentItem, 
          createdAt: new Date().toISOString() 
        }).catch(err => handleFirestoreError(err, OperationType.CREATE, activeTab));
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setCurrentItem({});
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setCurrentItem(item);
    setIsModalOpen(true);
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
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-4 p-4 font-black uppercase transition-all ${activeTab === 'contacts' ? 'bg-bauhaus-blue shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-white' : 'hover:bg-white/10'}`}
          >
            <MessageSquare size={20} /> Messages
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
            <button 
              onClick={openAddModal}
              className="bg-bauhaus-blue text-white px-6 py-3 font-black uppercase border-4 border-black hard-shadow hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
            >
              <Plus size={24} /> Add New
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'contacts' ? (
             contacts.length === 0 ? (
               <div className="p-20 border-4 border-dashed border-black text-center opacity-30">
                 <p className="text-2xl font-black">NO MESSAGES IN ARCHIVE</p>
               </div>
             ) : (
               contacts.map((msg, i) => (
                 <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-4 border-black p-6 hard-shadow"
                 >
                    <div className="flex justify-between mb-4 border-b-2 border-black pb-2">
                       <h3 className="font-black uppercase">{msg.subject}</h3>
                       <button 
                          onClick={async () => {
                            if(confirm("Delete this message?")) {
                              await deleteDoc(doc(db, 'contacts', msg.id));
                              fetchData();
                            }
                          }}
                          className="text-bauhaus-red hover:scale-110"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                    <p className="text-xs font-bold mb-4">From: {msg.name} ({msg.email})</p>
                    <p className="font-medium text-gray-700 italic">"{msg.message}"</p>
                    <p className="text-[10px] opacity-40 mt-4 font-mono">{msg.timestamp}</p>
                 </motion.div>
               ))
             )
          ) : data.length === 0 ? (
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
                  <button 
                    onClick={() => openEditModal(item)}
                    className="p-3 border-2 border-black hover:bg-bauhaus-yellow transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={async () => {
                      if(confirm("Delete this entry?")) {
                        const path = `${activeTab}/${item.id}`;
                        try {
                          await deleteDoc(doc(db, activeTab, item.id));
                          fetchData();
                        } catch (error) {
                          handleFirestoreError(error, OperationType.DELETE, path);
                        }
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

      {/* Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-black w-full max-w-2xl p-12 relative hard-shadow-lg max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-bauhaus-red hover:text-white transition-all"
              >
                <X size={24} />
              </button>

              <h2 className="text-4xl font-black uppercase mb-8 italic border-b-4 border-black pb-4">
                {currentItem.id ? `Edit ${activeTab.slice(0, -1)}` : `New ${activeTab.slice(0, -1)}`}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-xs tracking-widest">Title / Name</label>
                  <input 
                    required
                    type="text" 
                    value={currentItem.title || currentItem.company || ''} 
                    onChange={e => setCurrentItem({...currentItem, [activeTab === 'experience' ? 'company' : 'title']: e.target.value})}
                    className="p-4 border-4 border-black font-bold outline-none focus:bg-bauhaus-yellow transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-xs tracking-widest">Tagline / Role</label>
                  <input 
                    required
                    type="text" 
                    value={currentItem.tagline || currentItem.role || ''} 
                    onChange={e => setCurrentItem({...currentItem, [activeTab === 'experience' ? 'role' : 'tagline']: e.target.value})}
                    className="p-4 border-4 border-black font-bold outline-none focus:bg-bauhaus-yellow transition-colors"
                  />
                </div>

                {activeTab !== 'experience' && (
                  <div className="flex flex-col gap-2">
                    <label className="font-black uppercase text-xs tracking-widest">Cover Image</label>
                    <div className="flex gap-4">
                      {currentItem.image && (
                         <div className="w-24 h-24 border-4 border-black relative shrink-0">
                            <img src={currentItem.image} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setCurrentItem({...currentItem, image: ''})}
                              className="absolute -top-3 -right-3 bg-bauhaus-red text-white p-1 rounded-full border-2 border-black"
                            >
                              <X size={12} />
                            </button>
                         </div>
                      )}
                      <label className="flex-grow border-4 border-dashed border-black hover:bg-gray-100 transition-colors flex flex-col items-center justify-center p-4 cursor-pointer gap-2">
                        <Upload size={24} className="opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Upload to Storage</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={async e => {
                            if (e.target.files?.[0]) {
                              const url = await handleFileUpload(e.target.files[0]);
                              if (url) setCurrentItem({...currentItem, image: url});
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-xs tracking-widest">Detailed Content</label>
                  <textarea 
                    rows={4}
                    value={currentItem.description || currentItem.content || ''} 
                    onChange={e => setCurrentItem({...currentItem, [activeTab === 'blogs' ? 'content' : 'description']: e.target.value})}
                    className="p-4 border-4 border-black font-bold outline-none focus:bg-bauhaus-yellow transition-colors resize-none"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.2em] border-4 border-black hover:bg-bauhaus-blue active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" /> : <Save size={24} />}
                    {currentItem.id ? 'COMMIT UPDATES' : 'EXECUTE CREATION'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
