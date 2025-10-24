'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Gift, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  id: string;
  code: string;
  value: number;
  used: boolean;
  used_by_user?: string;
  created_by_admin: string;
  createdAt: string;
}

export default function CouponManagement() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    value: '',
    customValue: ''
  });
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
        if (!data.user.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          });
          router.push('/');
          return;
        }
        setIsAdmin(true);
        fetchCoupons();
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async () => {
    const value = newCoupon.value === 'custom' ? parseInt(newCoupon.customValue) : parseInt(newCoupon.value);
    
    if (!value || value <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid coupon value",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Coupon created: ${data.coupon.code}`,
        });
        setShowCreateForm(false);
        setNewCoupon({ value: '', customValue: '' });
        fetchCoupons();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create coupon",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    }
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Coupon deleted successfully",
        });
        fetchCoupons();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to delete coupon",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
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
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Coupon Management
          </h1>
        </motion.div>

        {/* Create Coupon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-purple-300">Create New Coupon</CardTitle>
                  <CardDescription className="text-gray-400">
                    Generate coupon codes for video generation credits
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Coupon
                </Button>
              </div>
            </CardHeader>
            
            {showCreateForm && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-purple-300">Coupon Value</Label>
                    <Select
                      value={newCoupon.value}
                      onValueChange={(value) => setNewCoupon(prev => ({ ...prev, value }))}
                    >
                      <SelectTrigger className="bg-black/40 border-purple-500/20 text-white">
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-purple-500/20">
                        <SelectItem value="1">1 Generation</SelectItem>
                        <SelectItem value="3">3 Generations</SelectItem>
                        <SelectItem value="5">5 Generations</SelectItem>
                        <SelectItem value="10">10 Generations</SelectItem>
                        <SelectItem value="50">50 Generations</SelectItem>
                        <SelectItem value="100">100 Generations</SelectItem>
                        <SelectItem value="custom">Custom Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newCoupon.value === 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-purple-300">Custom Value</Label>
                      <Input
                        type="number"
                        placeholder="Enter number of generations"
                        value={newCoupon.customValue}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, customValue: e.target.value }))}
                        className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={createCoupon}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Generate Coupon
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCoupon({ value: '', customValue: '' });
                    }}
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Coupons Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-300">Existing Coupons</CardTitle>
              <CardDescription className="text-gray-400">
                Manage and track all generated coupon codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-purple-500/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-purple-300">Coupon Code</TableHead>
                      <TableHead className="text-purple-300">Value</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                      <TableHead className="text-purple-300">Used By</TableHead>
                      <TableHead className="text-purple-300">Created</TableHead>
                      <TableHead className="text-purple-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                          No coupons found. Create your first coupon above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      coupons.map((coupon) => (
                        <TableRow key={coupon.id} className="border-purple-500/10">
                          <TableCell className="text-white font-mono">
                            <div className="flex items-center gap-2">
                              {coupon.code}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(coupon.code)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            {coupon.value} {coupon.value === 1 ? 'generation' : 'generations'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={coupon.used ? 'destructive' : 'default'}>
                              {coupon.used ? 'Used' : 'Available'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {coupon.used_by_user || '-'}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {new Date(coupon.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCoupon(coupon.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
      </div>
    </div>
  );
}