'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Video, Gift, Clock, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  email: string;
  is_admin: boolean;
  coupon_balance: number;
  cartoon_videos_generated: number;
  createdAt: string;
}

interface GenerationLog {
  id: string;
  video_type: string;
  status: string;
  reason?: string;
  timestamp: string;
  prompt?: string;
}

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
        fetchUserLogs();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchUserLogs = async () => {
    try {
      const response = await fetch('/api/generation/log');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);

    try {
      const response = await fetch('/api/coupon/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Coupon redeemed! You now have ${data.newBalance} generations remaining.`,
        });
        setCouponCode('');
        // Update user data
        checkAuthStatus();
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid coupon code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              My Account
            </h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              Logout
            </Button>
          </div>
        </motion.div>

        {/* User Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Email</CardTitle>
              <User className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-white truncate">{user.email}</div>
              <p className="text-xs text-gray-400">Account email</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-300">Cartoon Videos</CardTitle>
              <Video className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{user.cartoon_videos_generated}</div>
              <p className="text-xs text-gray-400">Videos generated</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Coupon Balance</CardTitle>
              <Gift className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{user.coupon_balance}</div>
              <p className="text-xs text-gray-400">Generations remaining</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-300">Member Since</CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <p className="text-xs text-gray-400">Account created</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coupon Redemption Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Redeem Coupon
              </CardTitle>
              <CardDescription className="text-gray-400">
                Have a coupon code? Enter it below to add generations to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coupon-code" className="text-purple-300">Coupon Code</Label>
                  <Input
                    id="coupon-code"
                    type="text"
                    placeholder="Enter your coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500"
                    disabled={isRedeeming}
                  />
                </div>
                
                <Button
                  onClick={handleRedeemCoupon}
                  disabled={isRedeeming || !couponCode.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Redeem Coupon
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-400">
                  <p>Current balance: <span className="text-cyan-400 font-semibold">{user?.coupon_balance || 0}</span> generations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Generation History
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your recent video generation attempts and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-purple-500/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-purple-300">Type</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                      <TableHead className="text-purple-300">Prompt</TableHead>
                      <TableHead className="text-purple-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-400 py-8">
                          No generation history found. Start creating videos!
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id} className="border-purple-500/10">
                          <TableCell className="text-white">
                            <Badge variant={log.video_type === 'cartoon' ? 'default' : 'secondary'}>
                              {log.video_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm max-w-xs truncate">
                            {log.prompt || 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-300">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Start creating your next masterpiece
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/generate-video" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold">
                    Generate Video
                  </Button>
                </Link>
                <Link href="/generate-cartoon" className="flex-1">
                  <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10 font-semibold">
                    Generate Cartoon
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}