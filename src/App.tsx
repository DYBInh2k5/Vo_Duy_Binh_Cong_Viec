import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

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
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const AIAssistant = React.lazy(() => import('./components/AIAssistant'));

function App() {
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
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <AIAssistant />
        </Suspense>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
