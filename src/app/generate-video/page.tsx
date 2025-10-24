'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Download, Play, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function GenerateVideoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [orientation, setOrientation] = useState('landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);
    setVideoMetadata(null);

    try {
      const response = await fetch('https://uhuhuhuhu.app.n8n.cloud/webhook/6c6a5bbd-5b65-4635-b284-a15d09ad3e11', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          orientation: orientation
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      
      // Log the generation
      await logGeneration('regular', 'success', null, data);

      // Extract video URL from response
      if (data && data[0] && data[0].secure_url) {
        setGeneratedVideo(data[0].secure_url);
        setVideoMetadata(data[0]);
        toast({
          title: "Success!",
          description: "Your video has been generated successfully.",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Generation error:', error);
      await logGeneration('regular', 'failed', error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
          prompt,
          orientation,
          response_data: JSON.stringify(responseData)
        })
      });
    } catch (error) {
      console.error('Failed to log generation:', error);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = 'vidcrafter-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      <div className="relative z-10 max-w-4xl mx-auto">
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

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Generate Video
              </CardTitle>
              <CardDescription className="text-gray-400 text-lg">
                Transform your ideas into stunning AI-powered videos
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-purple-300 text-lg">Describe your video idea...</Label>
                <Textarea
                  id="prompt"
                  placeholder="A futuristic city with flying cars at sunset, cinematic style..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/40 border-purple-500/20 text-white placeholder-gray-500 focus:border-purple-500 min-h-[120px] text-lg"
                  disabled={isGenerating}
                />
              </div>

              {/* Orientation Selection */}
              <div className="space-y-3">
                <Label className="text-purple-300 text-lg">Video Orientation</Label>
                <RadioGroup
                  value={orientation}
                  onValueChange={setOrientation}
                  className="flex gap-4"
                  disabled={isGenerating}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landscape" id="landscape" className="text-purple-500" />
                    <Label htmlFor="landscape" className="text-white cursor-pointer">Landscape</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="portrait" id="portrait" className="text-purple-500" />
                    <Label htmlFor="portrait" className="text-white cursor-pointer">Portrait</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 text-lg rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Video
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
                  <p className="text-gray-400">Creating your video... This may take a few moments.</p>
                </motion.div>
              )}

              {/* Generated Video */}
              {generatedVideo && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg p-4 border border-purple-500/20">
                    <h3 className="text-xl font-semibold text-purple-300 mb-4">Your Generated Video</h3>
                    
                    {/* Video Player */}
                    <div className="relative rounded-lg overflow-hidden bg-black mb-4">
                      <video
                        src={generatedVideo}
                        controls
                        className="w-full max-h-96 mx-auto"
                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23111827'/%3E%3Ctext x='400' y='225' text-anchor='middle' fill='%239CA3AF' font-size='24' font-family='Arial'%3ELoading video...%3C/text%3E%3C/svg%3E"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    {/* Video Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="bg-black/40 rounded-lg p-3">
                        <p className="text-gray-400">Orientation</p>
                        <p className="text-white font-semibold capitalize">{orientation}</p>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3">
                        <p className="text-gray-400">Resolution</p>
                        <p className="text-white font-semibold">
                          {videoMetadata?.width}x{videoMetadata?.height}
                        </p>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3">
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-semibold">
                          {videoMetadata?.duration ? `${videoMetadata.duration}s` : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-black/40 rounded-lg p-3">
                        <p className="text-gray-400">Format</p>
                        <p className="text-white font-semibold">{videoMetadata?.format?.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={handleDownload}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all hover:scale-105"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      
                      <Button
                        onClick={() => {
                          setPrompt('');
                          setGeneratedVideo(null);
                          setVideoMetadata(null);
                        }}
                        variant="outline"
                        className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500/10 font-semibold py-3 rounded-lg transition-all hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Another
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}