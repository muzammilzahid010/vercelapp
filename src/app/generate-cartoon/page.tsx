'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Download, Play, Loader2, ArrowLeft, Plus, X, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Character {
  name: string;
  description: string;
}

export default function GenerateCartoonPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [storyScript, setStoryScript] = useState('');
  const [characters, setCharacters] = useState<Character[]>([
    { name: '', description: '' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [requestSent, setRequestSent] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Timer effect for elapsed time during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating && generationStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - generationStartTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, generationStartTime]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        toast({
          title: "Authentication Required",
          description: "Please login to generate videos",
          variant: "destructive",
        });
        router.push('/login');
      }
    } catch (error) {
      toast({
        title: "Authentication Required",
        description: "Please login to generate videos",
        variant: "destructive",
      });
      router.push('/login');
    }
  };

  const checkUsageLimit = async () => {
    try {
      const response = await fetch('/api/generation/check-limit');
      const data = await response.json();
      
      if (!data.canGenerate) {
        setShowCouponModal(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking limit:', error);
      return false;
    }
  };

  const addCharacter = () => {
    setCharacters([...characters, { name: '', description: '' }]);
  };

  const removeCharacter = (index: number) => {
    if (characters.length > 1) {
      const newCharacters = characters.filter((_, i) => i !== index);
      setCharacters(newCharacters);
    }
  };

  const updateCharacter = (index: number, field: keyof Character, value: string) => {
    const newCharacters = [...characters];
    newCharacters[index][field] = value;
    setCharacters(newCharacters);
  };

  const handleGenerate = async () => {
    // Prevent multiple requests
    if (requestSent) {
      console.log('🚫 Request already sent, ignoring duplicate click');
      return;
    }

    if (!storyScript.trim()) {
      toast({
        title: "Error",
        description: "Please enter a story script",
        variant: "destructive",
      });
      return;
    }

    // Check if at least one character has a name
    const hasValidCharacter = characters.some(char => char.name.trim());
    if (!hasValidCharacter) {
      toast({
        title: "Error",
        description: "Please add at least one character with a name",
        variant: "destructive",
      });
      return;
    }

    // Check usage limit
    const canGenerate = await checkUsageLimit();
    if (!canGenerate) {
      return;
    }

    setIsGenerating(true);
    setRequestSent(true);
    setGenerationStartTime(Date.now());
    setGeneratedVideo(null);
    setVideoMetadata(null);
    
    console.log('🟢 Starting generation process at:', new Date().toISOString());

    try {
      const validCharacters = characters.filter(char => char.name.trim());
      
      console.log('🚀 Starting cartoon generation request...');
      console.log('📝 Story script length:', storyScript.length);
      console.log('👥 Characters count:', validCharacters.length);
      
      // Single persistent request - NO RETRIES, NO TIMEOUTS
      console.log('📡 Sending single request to n8n webhook...');
      
      const response = await fetch('https://zahidhissain6.app.n8n.cloud/webhook/6c6a5bbd-5b65-4635-b284-a15d09ad3e11', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          story_script: storyScript,
          characters: validCharacters
        })
      });
      
      console.log('✅ Response received from n8n:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`);
      }

      // Parse JSON response
      let data;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response length:', responseText.length);
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('📋 Parsed response data:', typeof data, Array.isArray(data) ? `Array with ${data.length} items` : 'Object');
      
      // Log the generation
      await logGeneration('cartoon', 'success', null, data);

      // Extract video URL from response
      if (data && data[0] && data[0].secure_url) {
        setGeneratedVideo(data[0].secure_url);
        setVideoMetadata(data[0]);
        const duration = generationStartTime ? Math.round((Date.now() - generationStartTime) / 1000) : 0;
        console.log(`🎉 Video generated successfully in ${duration}s!`);
        toast({
          title: "Success!",
          description: `Your cartoon video has been generated successfully in ${duration}s.`,
        });
      } else {
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response format - expected video URL in response');
      }
    } catch (error) {
      console.error('💥 Generation error:', error);
      const duration = generationStartTime ? Math.round((Date.now() - generationStartTime) / 1000) : 0;
      console.log(`⏱️ Error occurred after ${duration}s`);
      
      let errorMessage = 'Failed to generate cartoon video. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = `Generation failed: ${error.message}`;
        console.error('💥 Error details:', error.message);
        console.error('💥 Error stack:', error.stack);
      }
      
      await logGeneration('cartoon', 'failed', errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      const totalDuration = generationStartTime ? Math.round((Date.now() - generationStartTime) / 1000) : 0;
      console.log(`🏁 Generation process completed in ${totalDuration}s`);
      console.log('🔄 Resetting isGenerating state to false');
      setIsGenerating(false);
      setGenerationStartTime(null);
      setElapsedTime(0);
      setRequestSent(false);
    }
  };

  const logGeneration = async (videoType: string, status: string, reason: string | null, responseData: any = null) => {
    try {
      await fetch('/api/generation/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_type: videoType,
          status,
          reason,
          story_script: storyScript,
          characters: JSON.stringify(characters.filter(char => char.name.trim())),
          response_data: JSON.stringify(responseData)
        })
      });
    } catch (error) {
      console.error('Failed to log generation:', error);
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
        setShowCouponModal(false);
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
    }
  };

  const handleDownload = async () => {
    if (generatedVideo) {
      try {
        // Option 1: Direct download from original URL
        const link = document.createElement('a');
        link.href = generatedVideo;
        link.download = 'vidcrafter-cartoon.mp4';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Option 2: Download and host locally (uncomment if needed)
        // const response = await fetch('/api/download', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     url: generatedVideo,
        //     filename: `vidcrafter-cartoon-${Date.now()}.mp4`,
        //     fileType: 'video'
        //   })
        // });
        
        // if (response.ok) {
        //   const data = await response.json();
        //   // Download the locally hosted file
        //   const downloadLink = document.createElement('a');
        //   downloadLink.href = data.downloadUrl;
        //   downloadLink.download = data.filename;
        //   document.body.appendChild(downloadLink);
        //   downloadLink.click();
        //   document.body.removeChild(downloadLink);
        // }
      } catch (error) {
        toast({
          title: "Download Error",
          description: "Failed to download video. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

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
          <Link href="/">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              VidCrafter
            </h1>
          </div>
        </motion.div>

        {/* User Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <p className="text-gray-400">
              Cartoon videos generated: <span className="text-purple-400 font-semibold">{user.cartoon_videos_generated}</span> | 
              Coupon balance: <span className="text-cyan-400 font-semibold">{user.coupon_balance}</span>
            </p>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Generate Cartoon Story Video 🎨
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Create amazing cartoon stories with custom characters
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Story Script */}
              <div className="space-y-2">
                <Label htmlFor="story" className="text-purple-300 text-lg">Story Script</Label>
                <Textarea
                  id="story"
                  placeholder="Once upon a time, in a magical forest far away, there lived a brave little rabbit who dreamed of flying..."
                  value={storyScript}
                  onChange={(e) => setStoryScript(e.target.value)}
                  className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500 min-h-[150px] text-lg"
                  disabled={isGenerating}
                />
              </div>

              {/* Characters Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-purple-300 text-lg">Characters</Label>
                  <Button
                    onClick={addCharacter}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                    disabled={isGenerating}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Character
                  </Button>
                </div>

                {characters.map((character, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-purple-900/10 to-cyan-900/10 rounded-lg p-4 border border-purple-500/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 font-semibold">Character {index + 1}</span>
                      </div>
                      {characters.length > 1 && (
                        <Button
                          onClick={() => removeCharacter(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          disabled={isGenerating}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-400 text-sm">Name</Label>
                        <Input
                          value={character.name}
                          onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                          placeholder="Character name"
                          className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500"
                          disabled={isGenerating}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-400 text-sm">Description</Label>
                        <Textarea
                          value={character.description}
                          onChange={(e) => updateCharacter(index, 'description', e.target.value)}
                          placeholder="Detailed character description including personality, appearance, and role in the story..."
                          className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500 min-h-[100px]"
                          disabled={isGenerating}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || requestSent || !storyScript.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 text-lg rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Cartoon Video... (This may take up to 10 minutes)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Cartoon Video
                  </>
                )}
              </Button>

              {/* Loading State */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-gray-400 mb-2">Creating your cartoon story...</p>
                  <p className="text-gray-500 text-sm mb-4">This process can take up to 10 minutes due to the AI processing time.</p>
                  
                  {generationStartTime && (
                    <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4 mb-4">
                      <p className="text-purple-300 text-sm font-medium mb-2">Generation Status:</p>
                      <div className="text-left text-gray-400 text-xs space-y-1">
                        <p>✓ Story script received</p>
                        <p>✓ Characters analyzed</p>
                        <p>⟳ AI processing your video...</p>
                        <p>⏳ Time elapsed: {elapsedTime}s</p>
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        <p>💡 Please keep this tab open. The loading animation confirms your request is active.</p>
                        <p>🔄 The timer shows your request is still being processed.</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Generated Video */}
              {generatedVideo && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4">
                    <h3 className="text-purple-300 font-semibold mb-3">Your Cartoon Video is Ready! 🎉</h3>
                    <video
                      src={generatedVideo}
                      controls
                      className="w-full rounded-lg mb-4"
                      style={{ maxHeight: '400px' }}
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      <Button
                        onClick={() => {
                          setStoryScript('');
                          setCharacters([{ name: '', description: '' }]);
                          setGeneratedVideo(null);
                          setVideoMetadata(null);
                        }}
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      >
                        Create Another Video
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-cyan-900/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Redeem Coupon</h3>
              <p className="text-gray-300">You've run out of generations. Enter a coupon code to continue creating videos!</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="coupon" className="text-purple-300 text-sm">Coupon Code</Label>
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter your coupon code"
                  className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRedeemCoupon}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                >
                  Redeem Coupon
                </Button>
                <Button
                  onClick={() => setShowCouponModal(false)}
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}