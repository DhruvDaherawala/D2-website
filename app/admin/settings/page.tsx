"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContentForm from "@/components/admin/ContentForm";
import FileUpload from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { SiteConfig } from "@/lib/types";
import { Loader2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SettingsPage() {
  const router = useRouter();
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<"logo" | "favicon">("logo");

  // Fetch site config data
  useEffect(() => {
    async function fetchSiteConfig() {
      try {
        const response = await fetch("/api/content/site-config");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSiteConfig(data[0]);
          }
        } else {
          toast.error("Failed to fetch site configuration");
        }
      } catch (error) {
        console.error("Error fetching site configuration:", error);
        toast.error("An error occurred while fetching site configuration");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSiteConfig();
  }, []);

  const handleSaveSuccess = () => {
    toast.success("Site configuration updated successfully");
    router.refresh();
  };

  const handleUploadComplete = async (url: string) => {
    if (!siteConfig) return;

    try {
      const field = currentUploadType === "logo" ? "logo" : "favicon";
      const updatedConfig = { 
        ...siteConfig, 
        [field]: url 
      };
      
      const response = await fetch(`/api/content/site-config?id=${siteConfig.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConfig),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }

      setSiteConfig(updatedConfig);
      setShowImageUpload(false);
      toast.success(`${field === "logo" ? "Logo" : "Favicon"} updated successfully`);
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  // Form fields for site config
  const siteConfigFields = [
    {
      name: "siteName",
      label: "Site Name",
      type: "text" as const,
      placeholder: "Your Site Name",
      required: true,
    },
    {
      name: "siteDescription",
      label: "Site Description",
      type: "textarea" as const,
      placeholder: "A brief description of your website",
      required: true,
    },
    {
      name: "siteUrl",
      label: "Site URL",
      type: "url" as const,
      placeholder: "https://example.com",
      required: true,
    },
    {
      name: "logo",
      label: "Logo URL",
      type: "text" as const,
      placeholder: "/logo.svg",
      required: true,
    },
    {
      name: "favicon",
      label: "Favicon URL",
      type: "text" as const,
      placeholder: "/favicon.ico",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <div className="space-x-2">
          <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload Images
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Upload {currentUploadType === "logo" ? "Logo" : "Favicon"}
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-center space-x-2 mb-4">
                <Button 
                  variant={currentUploadType === "logo" ? "default" : "outline"}
                  onClick={() => setCurrentUploadType("logo")}
                >
                  Logo
                </Button>
                <Button 
                  variant={currentUploadType === "favicon" ? "default" : "outline"}
                  onClick={() => setCurrentUploadType("favicon")}
                >
                  Favicon
                </Button>
              </div>
              <FileUpload 
                onUploadComplete={handleUploadComplete}
                accept="image/*"
              />
            </DialogContent>
          </Dialog>
          
          <Button onClick={() => router.push("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Site Configuration</CardTitle>
              <CardDescription>
                Update general site settings like name, description, and URLs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentForm
                title="Site Settings"
                fields={siteConfigFields}
                initialData={siteConfig || undefined}
                collection="site-config"
                onSuccess={handleSaveSuccess}
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Media Preview</CardTitle>
              <CardDescription>
                Preview your logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Preview */}
                <div>
                  <h3 className="text-white font-medium mb-2">Logo</h3>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex items-center justify-center h-40">
                    {siteConfig?.logo ? (
                      <img 
                        src={siteConfig.logo} 
                        alt="Site Logo" 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-logo.svg";
                        }}
                      />
                    ) : (
                      <div className="text-gray-500">No logo uploaded</div>
                    )}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentUploadType("logo");
                        setShowImageUpload(true);
                      }}
                    >
                      Change Logo
                    </Button>
                  </div>
                </div>

                {/* Favicon Preview */}
                <div>
                  <h3 className="text-white font-medium mb-2">Favicon</h3>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex items-center justify-center h-40">
                    {siteConfig?.favicon ? (
                      <img 
                        src={siteConfig.favicon} 
                        alt="Favicon" 
                        className="max-h-16 max-w-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-favicon.svg";
                        }}
                      />
                    ) : (
                      <div className="text-gray-500">No favicon uploaded</div>
                    )}
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentUploadType("favicon");
                        setShowImageUpload(true);
                      }}
                    >
                      Change Favicon
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 