"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContentFormProps {
  title: string;
  fields: FormField[];
  initialData?: any;
  collection: string;
  onSuccess?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "email" | "url" | "color";
  placeholder?: string;
  description?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export default function ContentForm({
  title,
  fields,
  initialData,
  collection,
  onSuccess,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: ContentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamically build schema based on fields
  const schemaFields: Record<string, any> = {};
  fields.forEach((field) => {
    let schema = z.string();
    
    if (field.required) {
      schema = schema.min(1, `${field.label} is required`);
    } else {
      schema = schema.optional();
    }

    if (field.type === "email") {
      schema = z.string().email(`Invalid email address`).optional();
      if (field.required) {
        schema = z.string().email(`Invalid email address`);
      }
    }

    if (field.type === "url") {
      schema = z.string().url(`Invalid URL`).optional();
      if (field.required) {
        schema = z.string().url(`Invalid URL`);
      }
    }

    if (field.type === "number") {
      schema = z.coerce.number();
      if (field.min !== undefined) {
        schema = schema.min(field.min, `Minimum value is ${field.min}`);
      }
      if (field.max !== undefined) {
        schema = schema.max(field.max, `Maximum value is ${field.max}`);
      }
      if (!field.required) {
        schema = schema.optional();
      }
    }

    schemaFields[field.name] = schema;
  });

  const formSchema = z.object(schemaFields);
  
  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const url = initialData?.id
        ? `/api/content/${collection}?id=${initialData.id}`
        : `/api/content/${collection}`;
      
      const method = initialData?.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...data,
          id: initialData?.id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Something went wrong");
      }

      toast.success(`${title} saved successfully!`);
      
      // Refresh server data
      router.refresh();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          {...formField}
                          className="bg-gray-900 border-gray-700"
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...formField}
                          className="bg-gray-900 border-gray-700"
                        />
                      )}
                    </FormControl>
                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={onCancel ? "" : "ml-auto"}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 