"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FileUpload from "@/components/admin/FileUpload";
import { Copy, X, Search, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaFile {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export default function MediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);

  // For demo purposes, we'll simulate files
  const mockFiles: MediaFile[] = [
    {
      name: "hero-image.jpg",
      url: "/uploads/hero-image.jpg",
      type: "image/jpeg",
      size: 1024 * 500, // 500KB
      uploadedAt: new Date().toISOString(),
    },
    {
      name: "logo.svg",
      url: "/uploads/logo.svg",
      type: "image/svg+xml",
      size: 1024 * 25, // 25KB
      uploadedAt: new Date().toISOString(),
    },
    {
      name: "project-screenshot.png",
      url: "/uploads/project-screenshot.png",
      type: "image/png",
      size: 1024 * 320, // 320KB
      uploadedAt: new Date().toISOString(),
    },
    {
      name: "background-pattern.webp",
      url: "/uploads/background-pattern.webp",
      type: "image/webp",
      size: 1024 * 150, // 150KB
      uploadedAt: new Date().toISOString(),
    },
  ];

  // Check if we should show the upload dialog based on URL params
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "upload") {
      setShowUploadDialog(true);
    }
  }, [searchParams]);

  // Fetch files (simulated)
  useEffect(() => {
    // In a real implementation, fetch from API
    setTimeout(() => {
      setFiles(mockFiles);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleUploadComplete = (url: string) => {
    // In a real implementation, refresh files from server
    toast.success("File uploaded successfully!");
    setShowUploadDialog(false);
    router.push("/admin/media");
    router.refresh();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    // In a real implementation, send delete request to API
    setFiles(files.filter(f => f.url !== fileToDelete.url));
    toast.success("File deleted successfully");
    setFileToDelete(null);
  };

  // Filter files based on search query
  const filteredFiles = searchQuery
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Media Library</h1>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Upload Files</DialogTitle>
            </DialogHeader>
            <FileUpload 
              onUploadComplete={handleUploadComplete}
              accept="image/*"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Search Files</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by filename"
              className="pl-8 bg-gray-900 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Files</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading media files...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchQuery 
                ? "No files matching your search criteria" 
                : "No files found. Upload your first file."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div 
                  key={file.url} 
                  className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden group"
                >
                  <div className="relative aspect-square">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <div className="text-gray-400">{file.type.split("/")[1].toUpperCase()}</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleCopyUrl(file.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => setFileToDelete(file)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium text-white truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!fileToDelete} 
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file "{fileToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteFile}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 