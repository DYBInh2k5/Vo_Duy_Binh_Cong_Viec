import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { useRemoteConfig } from './hooks/useRemoteConfig';
import { AlertTriangle } from 'lucide-react';
import PushNotificationManager from './components/PushNotificationManager';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Playground = React.lazy(() => import('./pages/Playground'));
const Capabilities = React.lazy(() => import('./pages/Capabilities'));
const Experience = React.lazy(() => import('./pages/Experience'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Guestbook = React.lazy(() => import('./pages/Guestbook'));
const Rubik = React.lazy(() => import('./pages/Rubik'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const AIAssistant = React.lazy(() => import('./components/AIAssistant'));

function App() {
  const { showMaintenance, welcomeMessage } = useRemoteConfig();

  if (showMaintenance) {
    return (
      <div className="min-h-screen bg-bauhaus-black flex flex-col items-center justify-center text-white p-8 text-center">
        <AlertTriangle size={80} className="text-bauhaus-yellow mb-8 animate-pulse" />
        <h1 className="text-6xl font-black uppercase mb-4 tracking-tighter italic">Under Maintenance</h1>
        <p className="text-xl font-bold opacity-60 max-w-md">{welcomeMessage}</p>
        <div className="mt-12 w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-bauhaus-red w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-all duration-500">
          <Navbar />
          <main className="flex-grow">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-bauhaus-off-white">
              <div className="w-16 h-16 border-4 border-bauhaus-black border-t-bauhaus-red animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/capabilities" element={<Capabilities />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/guestbook" element={<Guestbook />} />
              <Route path="/rubik" element={<Rubik />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <PushNotificationManager />
        <Suspense fallback={null}>
          <AIAssistant />
        </Suspense>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
