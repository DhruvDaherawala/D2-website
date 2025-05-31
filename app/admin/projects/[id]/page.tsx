"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ContentForm from "@/components/admin/ContentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Project } from "@/lib/types";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function ProjectFormPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const isNew = params.id === "new";

  // Available icon options that match our iconMap in ProjectsSection
  const availableIcons = ["Home", "Users", "Heart", "Truck", "CreditCard"];

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [params.id, isNew]);

  async function fetchProject() {
    try {
      const response = await fetch(`/api/projects?id=${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      setProject(data);
    } catch (error) {
      toast.error("Error loading project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const formFields = [
    {
      name: "title",
      label: "Project Title",
      type: "text" as const,
      placeholder: "Enter project title",
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
      name: "iconName",
      label: "Icon",
      type: "select" as any, // Custom field type for dropdown
      placeholder: "Select an icon",
      required: true,
      options: availableIcons.map(icon => ({
        label: icon,
        value: icon
      })),
    },
    {
      name: "tags",
      label: "Tags (comma separated)",
      type: "text" as const,
      placeholder: "Web Development, AI, Database",
      description: "Enter tags separated by commas",
      required: true,
    },
    {
      name: "link",
      label: "Project Link",
      type: "url" as const,
      placeholder: "https://...",
      description: "URL to the project (live demo or repository)",
      required: true,
    },
  ];

  // Function to handle form submission success
  const handleSuccess = () => {
    toast.success(`Project ${isNew ? "created" : "updated"} successfully`);
    router.push("/admin/projects");
  };

  // Function to prepare project data for the form
  const prepareProjectForEdit = (project: Project): any => {
    // Ensure there is a tags array, fallback to empty array if undefined
    const tags = Array.isArray(project.tags) 
      ? project.tags.join(", ") 
      : typeof project.tags === 'string'
        ? project.tags
        : "";

    return {
      ...project,
      tags: tags
    };
  };

  // Function to prepare form data for submission
  const transformFormData = (data: any): Project => {
    // Convert comma-separated tags string back to array
    let tagsArray: string[] = [];
    
    if (typeof data.tags === 'string') {
      tagsArray = data.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== "");
    } else if (Array.isArray(data.tags)) {
      tagsArray = data.tags.filter((tag: any) => 
        typeof tag === 'string' && tag.trim() !== ''
      );
    }

    return {
      ...data,
      tags: tagsArray
    };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/admin/projects")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-white">
        {isNew ? "Add New Project" : "Edit Project"}
      </h1>

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <ContentForm
            title={isNew ? "Create Project" : "Update Project"}
            fields={formFields}
            initialData={project ? prepareProjectForEdit(project) : {}}
            collection="admin/projects"
            onSuccess={handleSuccess}
            onCancel={() => router.push("/admin/projects")}
            submitLabel={isNew ? "Create Project" : "Save Changes"}
            cancelLabel="Cancel"
            transformData={transformFormData}
          />
        </Card>
      )}
    </div>
  );
} 