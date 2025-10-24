'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles, Play, Palette, User, LogIn, LogOut, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data.user);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { icon: Play, text: 'Generate Video', href: '/generate-video' },
    { icon: Palette, text: 'Generate Cartoon Video', href: '/generate-cartoon' },
    ...(isLoggedIn ? [
      { icon: User, text: 'My Account', href: '/account' },
      { icon: LogOut, text: 'Logout', onClick: handleLogout }
    ] : [
      { icon: LogIn, text: 'Login', href: '/login' }
    ])
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              VidCrafter
            </h1>
          </motion.div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 backdrop-blur-xl border-purple-500/20">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-cyan-400" />
                        <span>{item.text}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
                      >
                        <item.icon className="w-5 h-5 text-cyan-400" />
                        <span>{item.text}</span>
                      </button>
                    )}
                  </motion.div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all hover:scale-105"
                  >
                    <item.icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.text}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all hover:scale-105"
                  >
                    <item.icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.text}</span>
                  </button>
                )}
              </motion.div>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Animated Tagline */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Bring your imagination to life
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl mt-2 block">
              with AI-powered video creation
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block ml-2"
              >
                🎬
              </motion.span>
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Transform your ideas into stunning videos with cutting-edge AI technology.
            From concepts to creation in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link href="/generate-video">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 text-lg font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            
            <Link href="/generate-cartoon">
              <Button
                variant="outline"
                size="lg"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg font-semibold rounded-full transition-all hover:scale-105"
              >
                <Palette className="w-5 h-5 mr-2" />
                Create Cartoon
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {[
            {
              title: 'Lightning Fast',
              description: 'Generate videos in seconds, not hours',
              icon: '⚡'
            },
            {
              title: 'AI-Powered',
              description: 'Advanced AI models for stunning results',
              icon: '🤖'
            },
            {
              title: 'Easy to Use',
              description: 'Simple interface for complex creations',
              icon: '✨'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>&copy; 2024 VidCrafter. Powered by AI magic.</p>
        </div>
      </footer>
    </div>
  );
}