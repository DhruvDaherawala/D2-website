"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentForm from "@/components/admin/ContentForm";
import { toast } from "sonner";
import { FooterContent } from "@/lib/types";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
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
import { v4 as uuidv4 } from "uuid";

export default function FooterPage() {
  const router = useRouter();
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("main");
  const [showAddSocialDialog, setShowAddSocialDialog] = useState(false);
  const [socialToDelete, setSocialToDelete] = useState<string | null>(null);

  // Fetch footer data
  useEffect(() => {
    async function fetchFooter() {
      try {
        const response = await fetch("/api/content/footer");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setFooterContent(data[0]);
          }
        } else {
          toast.error("Failed to fetch footer content");
        }
      } catch (error) {
        console.error("Error fetching footer content:", error);
        toast.error("An error occurred while fetching footer content");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFooter();
  }, []);

  const handleSaveSuccess = () => {
    toast.success("Footer content updated successfully");
    router.refresh();
  };

  const handleAddSocial = async (data: any) => {
    if (!footerContent) return;

    try {
      const newSocial = {
        id: uuidv4(),
        platform: data.platform,
        url: data.url,
        icon: data.icon
      };

      const updatedContent = {
        ...footerContent,
        socialLinks: [...footerContent.socialLinks, newSocial]
      };

      const response = await fetch(`/api/content/footer?id=${footerContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to add social link");
      }

      setFooterContent(updatedContent);
      setShowAddSocialDialog(false);
      toast.success("Social link added successfully");
    } catch (error) {
      toast.error("Failed to add social link");
      console.error(error);
    }
  };

  const handleDeleteSocial = async () => {
    if (!footerContent || !socialToDelete) return;

    try {
      const updatedSocialLinks = footerContent.socialLinks.filter(social => social.id !== socialToDelete);
      const updatedContent = {
        ...footerContent,
        socialLinks: updatedSocialLinks
      };

      const response = await fetch(`/api/content/footer?id=${footerContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to delete social link");
      }

      setFooterContent(updatedContent);
      setSocialToDelete(null);
      toast.success("Social link deleted successfully");
    } catch (error) {
      toast.error("Failed to delete social link");
      console.error(error);
    }
  };

  // Form fields for main footer content
  const mainFields = [
    {
      name: "companyName",
      label: "Company Name",
      type: "text" as const,
      placeholder: "Your Company Name",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Short description about your company",
      required: true,
    },
    {
      name: "copyright",
      label: "Copyright Text",
      type: "text" as const,
      placeholder: "© 2023 Your Company. All rights reserved.",
      required: true,
    },
  ];

  // Form fields for adding a new social link
  const socialFields = [
    {
      name: "platform",
      label: "Platform",
      type: "text" as const,
      placeholder: "Twitter, Facebook, LinkedIn, etc.",
      required: true,
    },
    {
      name: "url",
      label: "URL",
      type: "url" as const,
      placeholder: "https://twitter.com/yourusername",
      required: true,
    },
    {
      name: "icon",
      label: "Icon Name",
      type: "text" as const,
      placeholder: "Twitter, Github, Linkedin, etc.",
      description: "Icon name from Lucide icons",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Footer Section</h1>
        <Button onClick={() => router.push("/admin/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="main">Main Content</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          {/* Main Content Tab */}
          <TabsContent value="main">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Edit Footer Content</CardTitle>
                <CardDescription>
                  Update the main content of your footer section
                </CardDescription>
              </CardHeader>
              <CardContent>
                {footerContent && (
                  <ContentForm
                    title="Footer Content"
                    fields={mainFields}
                    initialData={{
                      id: footerContent.id,
                      companyName: footerContent.companyName,
                      description: footerContent.description,
                      copyright: footerContent.copyright
                    }}
                    collection="footer"
                    onSuccess={handleSaveSuccess}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Manage Social Links</CardTitle>
                  <CardDescription>
                    Add or remove social media links displayed in the footer
                  </CardDescription>
                </div>
                <Dialog open={showAddSocialDialog} onOpenChange={setShowAddSocialDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Social Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Social Link</DialogTitle>
                    </DialogHeader>
                    <ContentForm
                      title="New Social Link"
                      fields={socialFields}
                      collection="temp"
                      onSuccess={handleAddSocial}
                      submitLabel="Add Link"
                      cancelLabel="Cancel"
                      onCancel={() => setShowAddSocialDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {footerContent && footerContent.socialLinks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {footerContent.socialLinks.map((social) => (
                      <Card key={social.id} className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <div className="text-lg font-semibold text-white mb-1">{social.platform}</div>
                            <a 
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-400 hover:underline"
                            >
                              {social.url}
                            </a>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setSocialToDelete(social.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No social links found. Add your first social link by clicking "Add Social Link".
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Social Link Confirmation */}
      <AlertDialog
        open={!!socialToDelete}
        onOpenChange={(open) => !open && setSocialToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Social Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this social link? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteSocial}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 