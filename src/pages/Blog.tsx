import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../hooks/useSEO';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  image: string;
}

const Blog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Research & Blog',
    description: 'Exploring AI, Automation, and the future of Media. Insights and articles by Võ Duy Bình (coDY) on AI engineering and digital innovation.',
    keywords: ['AI blog', 'Automation', 'Digital Media', 'coDY Blog', 'AI Engineering']
  });

  useEffect(() => {
    const fetchPosts = async () => {
      const path = 'blogs';
      setLoading(true);
      try {
        const q = query(
          collection(db, path),
          where('published', '==', true),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];
        setPosts(fetchedPosts);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-bauhaus-off-white pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-l-8 border-bauhaus-red pl-8">
          <h1 className="text-7xl font-black tracking-tighter uppercase mb-4">RE-SEARCH</h1>
          <p className="text-xl font-bold italic opacity-70">Exploring AI, Automation, and the future of Media.</p>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-12 h-12 border-4 border-black border-t-bauhaus-blue animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-20 border-4 border-dashed border-black text-center bg-white">
            <p className="text-2xl font-black uppercase">{t('common.noEntries')}</p>
            <p className="mt-2">Check back soon for insights on AI engineering.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border-4 border-bauhaus-black hard-shadow hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all overflow-hidden"
              >
                <div className="h-48 border-b-4 border-bauhaus-black overflow-hidden bg-stone-200">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1 bg-bauhaus-yellow px-2 py-0.5 border border-black"><Tag size={12} /> {post.tags[0]}</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-4 group-hover:text-bauhaus-blue transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-sm font-black uppercase border-b-2 border-bauhaus-red pb-1 hover:gap-4 transition-all"
                  >
                    {t('common.readFullPost')} <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
