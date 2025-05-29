"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentForm from "@/components/admin/ContentForm";
import { toast } from "sonner";
import { AboutContent } from "@/lib/types";
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

export default function AboutPage() {
  const router = useRouter();
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("main");
  const [showAddStatDialog, setShowAddStatDialog] = useState(false);
  const [showAddFeatureDialog, setShowAddFeatureDialog] = useState(false);
  const [statToDelete, setStatToDelete] = useState<string | null>(null);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  // Fetch about data
  useEffect(() => {
    async function fetchAbout() {
      try {
        const response = await fetch("/api/content/about");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setAboutContent(data[0]);
          }
        } else {
          toast.error("Failed to fetch about content");
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
        toast.error("An error occurred while fetching about content");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAbout();
  }, []);

  const handleSaveSuccess = () => {
    toast.success("About content updated successfully");
    router.refresh();
  };

  const handleAddStat = async (data: any) => {
    if (!aboutContent) return;

    try {
      const newStat = {
        id: uuidv4(),
        value: data.value,
        label: data.label
      };

      const updatedContent = {
        ...aboutContent,
        stats: [...aboutContent.stats, newStat]
      };

      const response = await fetch(`/api/content/about?id=${aboutContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to add stat");
      }

      setAboutContent(updatedContent);
      setShowAddStatDialog(false);
      toast.success("Stat added successfully");
    } catch (error) {
      toast.error("Failed to add stat");
      console.error(error);
    }
  };

  const handleAddFeature = async (data: any) => {
    if (!aboutContent) return;

    try {
      const newFeature = {
        id: uuidv4(),
        title: data.title,
        description: data.description
      };

      const updatedContent = {
        ...aboutContent,
        features: [...aboutContent.features, newFeature]
      };

      const response = await fetch(`/api/content/about?id=${aboutContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to add feature");
      }

      setAboutContent(updatedContent);
      setShowAddFeatureDialog(false);
      toast.success("Feature added successfully");
    } catch (error) {
      toast.error("Failed to add feature");
      console.error(error);
    }
  };

  const handleDeleteStat = async () => {
    if (!aboutContent || !statToDelete) return;

    try {
      const updatedStats = aboutContent.stats.filter(stat => stat.id !== statToDelete);
      const updatedContent = {
        ...aboutContent,
        stats: updatedStats
      };

      const response = await fetch(`/api/content/about?id=${aboutContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to delete stat");
      }

      setAboutContent(updatedContent);
      setStatToDelete(null);
      toast.success("Stat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete stat");
      console.error(error);
    }
  };

  const handleDeleteFeature = async () => {
    if (!aboutContent || !featureToDelete) return;

    try {
      const updatedFeatures = aboutContent.features.filter(feature => feature.id !== featureToDelete);
      const updatedContent = {
        ...aboutContent,
        features: updatedFeatures
      };

      const response = await fetch(`/api/content/about?id=${aboutContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!response.ok) {
        throw new Error("Failed to delete feature");
      }

      setAboutContent(updatedContent);
      setFeatureToDelete(null);
      toast.success("Feature deleted successfully");
    } catch (error) {
      toast.error("Failed to delete feature");
      console.error(error);
    }
  };

  // Form fields for main about content
  const mainFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "About Us",
      required: true,
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: "text" as const,
      placeholder: "Our Mission",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Detailed description about your company...",
      required: true,
    },
  ];

  // Form fields for adding a new stat
  const statFields = [
    {
      name: "value",
      label: "Value",
      type: "text" as const,
      placeholder: "50+",
      required: true,
    },
    {
      name: "label",
      label: "Label",
      type: "text" as const,
      placeholder: "Projects Completed",
      required: true,
    },
  ];

  // Form fields for adding a new feature
  const featureFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Feature Title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Feature description...",
      required: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">About Section</h1>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main">Main Content</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Main Content Tab */}
          <TabsContent value="main">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Edit About Content</CardTitle>
                <CardDescription>
                  Update the main content of your about section
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aboutContent && (
                  <ContentForm
                    title="About Content"
                    fields={mainFields}
                    initialData={{
                      id: aboutContent.id,
                      title: aboutContent.title,
                      subtitle: aboutContent.subtitle,
                      description: aboutContent.description
                    }}
                    collection="about"
                    onSuccess={handleSaveSuccess}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Manage Stats</CardTitle>
                  <CardDescription>
                    Add or remove statistics displayed in the about section
                  </CardDescription>
                </div>
                <Dialog open={showAddStatDialog} onOpenChange={setShowAddStatDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Stat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Stat</DialogTitle>
                    </DialogHeader>
                    <ContentForm
                      title="New Stat"
                      fields={statFields}
                      collection="temp"
                      onSuccess={handleAddStat}
                      submitLabel="Add Stat"
                      cancelLabel="Cancel"
                      onCancel={() => setShowAddStatDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {aboutContent && aboutContent.stats.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutContent.stats.map((stat) => (
                      <Card key={stat.id} className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <div className="text-xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setStatToDelete(stat.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No stats found. Add your first stat by clicking "Add Stat".
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Manage Features</CardTitle>
                  <CardDescription>
                    Add or remove features displayed in the about section
                  </CardDescription>
                </div>
                <Dialog open={showAddFeatureDialog} onOpenChange={setShowAddFeatureDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Feature
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Feature</DialogTitle>
                    </DialogHeader>
                    <ContentForm
                      title="New Feature"
                      fields={featureFields}
                      collection="temp"
                      onSuccess={handleAddFeature}
                      submitLabel="Add Feature"
                      cancelLabel="Cancel"
                      onCancel={() => setShowAddFeatureDialog(false)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {aboutContent && aboutContent.features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutContent.features.map((feature) => (
                      <Card key={feature.id} className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="text-lg font-semibold text-white mb-2">{feature.title}</div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="ml-2 flex-shrink-0"
                              onClick={() => setFeatureToDelete(feature.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-400">{feature.description}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No features found. Add your first feature by clicking "Add Feature".
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Stat Confirmation */}
      <AlertDialog
        open={!!statToDelete}
        onOpenChange={(open) => !open && setStatToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Stat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this stat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteStat}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Feature Confirmation */}
      <AlertDialog
        open={!!featureToDelete}
        onOpenChange={(open) => !open && setFeatureToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feature? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteFeature}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 