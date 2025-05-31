"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { toast } from "sonner";
import ContentForm from "@/components/admin/ContentForm";
import FileUpload from "@/components/admin/FileUpload";
import { Pencil, Plus, Trash2, Image, ExternalLink, Github, PlusCircle, Eye } from "lucide-react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentImageUploadTarget, setCurrentImageUploadTarget] = useState<string>("");

  // Check if we should show the new project form based on URL params
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new") {
      setShowNewProjectForm(true);
    }
  }, [searchParams]);

  // Fetch projects data
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast.error("Error loading projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditProjectForm(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/admin/projects?id=${projectToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        toast.success("Project deleted successfully");
        setProjectToDelete(null);
        fetchProjects();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete project");
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  const handleNewProjectSuccess = () => {
    setShowNewProjectForm(false);
    router.push("/admin/projects");
    router.refresh();
  };

  const handleEditProjectSuccess = () => {
    setShowEditProjectForm(false);
    setEditingProject(null);
    router.refresh();
  };

  const handleUploadComplete = (url: string) => {
    if (currentImageUploadTarget === "new") {
      // For new project, we need to store the URL somewhere
      setShowImageUpload(false);
      setShowNewProjectForm(true);
      // Ideally, you'd have a way to pass this URL to the form
      toast.success("Image uploaded. Please enter project details.");
    } else if (editingProject && currentImageUploadTarget === "edit") {
      // For existing project, update the image URL
      handleUpdateProjectImage(url);
    }
  };

  const handleUpdateProjectImage = async (url: string) => {
    if (!editingProject) return;

    try {
      const updatedProject = { ...editingProject, imageUrl: url };
      
      const response = await fetch(`/api/content/projects?id=${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to update project image");
      }

      // Update local state
      setProjects(projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      ));
      
      setShowImageUpload(false);
      toast.success("Project image updated successfully");
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  // Form fields for project form
  const projectFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Project Title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Project description",
      required: true,
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text" as const,
      placeholder: "/uploads/your-image.jpg",
      required: true,
    },
    {
      name: "tags",
      label: "Tags (comma separated)",
      type: "text" as const,
      placeholder: "React, UI/UX, Web Development",
      required: false,
    },
    {
      name: "demoLink",
      label: "Demo Link",
      type: "url" as const,
      placeholder: "https://example.com",
      required: false,
    },
    {
      name: "githubLink",
      label: "GitHub Link",
      type: "url" as const,
      placeholder: "https://github.com/example/repo",
      required: false,
    },
  ];

  // Parse tags from string for new/edit project
  const parseProjectData = (data: any) => {
    // Convert tags from comma-separated string to array if provided
    if (typeof data.tags === 'string') {
      return {
        ...data,
        tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };
    }
    
    // Ensure tags is always an array
    if (!Array.isArray(data.tags)) {
      return {
        ...data,
        tags: []
      };
    }
    
    return data;
  };

  // Format tags to string for editing
  const formatProjectForEdit = (project: Project) => {
    // Ensure tags is an array before joining
    const tags = Array.isArray(project.tags) 
      ? project.tags.join(', ')
      : typeof project.tags === 'string' 
        ? project.tags
        : '';
        
    return {
      ...project,
      tags: tags
    };
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Projects Management</h1>
        <Button onClick={() => router.push("/admin/projects/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex justify-between items-start">
                  <span className="truncate">{project.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 h-24 overflow-hidden text-ellipsis">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(project.tags) ? project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  )) : (
                    <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                      {typeof project.tags === 'string' ? project.tags : 'No tags'}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2 mt-4 justify-end">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={project.link || "#"} target="_blank">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setProjectToDelete(project)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No projects found. Add your first project!
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={open => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the project
              {projectToDelete?.title && <span className="font-medium"> "{projectToDelete.title}"</span>}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 