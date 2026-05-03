import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

interface BlogPost {
  title: string;
  content: string;
  date: string;
  tags: string[];
  image: string;
  author?: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data() as BlogPost);
        } else {
          console.log("No such document!");
          navigate('/blog');
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bauhaus-off-white">
        <div className="w-16 h-16 border-4 border-black border-t-bauhaus-red animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-bauhaus-off-white pt-32 pb-20 px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 font-black uppercase text-sm mb-12 hover:gap-4 transition-all"
        >
          <ArrowLeft size={20} /> Back to Blog
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-bauhaus-black p-8 md:p-16 hard-shadow"
        >
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase mb-8 opacity-60">
              <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
              <span className="flex items-center gap-2"><User size={16} /> {post.author || 'coDY'}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> 5 min read</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 leading-tight">
              {post.title}
            </h1>

            <div className="aspect-video border-4 border-bauhaus-black mb-12 overflow-hidden bg-stone-100">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </header>

          <div className="markdown-body prose prose-stone prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-img:border-4 prose-img:border-black">
            <Markdown>{post.content}</Markdown>
          </div>

          <footer className="mt-20 pt-12 border-t-4 border-bauhaus-black flex flex-wrap gap-4">
            {post.tags.map(tag => (
              <span key={tag} className="bg-bauhaus-yellow px-4 py-1 border-2 border-black font-black uppercase text-xs italic">
                #{tag}
              </span>
            ))}
          </footer>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost;
