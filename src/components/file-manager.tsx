'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Trash2, 
  FileVideo, 
  FileImage, 
  FileText, 
  FileAudio,
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileInfo {
  filename: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  url: string;
  downloadUrl: string;
}

interface FileManagerProps {
  fileType?: 'video' | 'image' | 'document' | 'audio';
  showUpload?: boolean;
  showDownload?: boolean;
  maxFiles?: number;
}

export default function FileManager({ 
  fileType = 'video', 
  showUpload = true, 
  showDownload = true,
  maxFiles = 50 
}: FileManagerProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState(fileType);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, [selectedType]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/download?type=${selectedType}`);
      const data = await response.json();
      
      if (response.ok) {
        setFiles(data.files || []);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load files",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: `${file.name} uploaded successfully`,
        });
        loadFiles(); // Refresh file list
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to upload file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDownload = async (file: FileInfo) => {
    try {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) {
      return <FileVideo className="w-4 h-4" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <FileImage className="w-4 h-4" />;
    } else if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
      return <FileAudio className="w-4 h-4" />;
    } else {
      return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              File Manager
              <Badge variant="secondary">{files.length} files</Badge>
            </CardTitle>
            <CardDescription>
              Manage your {selectedType} files
            </CardDescription>
          </div>
          <Button
            onClick={loadFiles}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Type Selector */}
        <div className="flex items-center gap-4">
          <Label htmlFor="fileType">File Type:</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="space-y-2">
            <Label htmlFor="fileUpload">Upload File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fileUpload"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                accept={
                  selectedType === 'video' ? 'video/*' :
                  selectedType === 'image' ? 'image/*' :
                  selectedType === 'audio' ? 'audio/*' : '*/*'
                }
              />
              {uploading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </div>
          </div>
        )}

        {/* Files List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Files</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading files...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No files found. Upload some files to get started.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.filename)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • 
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showDownload && (
                      <Button
                        onClick={() => handleDownload(file)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => window.open(file.url, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}