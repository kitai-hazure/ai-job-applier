"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectDescriptionForm } from "@/components/settings/projects-description-form";
import { ProjectLinksForm } from "@/components/settings/projects-links-form";

const formSchema = z.object({
  projects: z.array(
    z.object({
      name: z.string().min(4).max(50),
      description: z.array(
        z.object({
          body: z.string().min(10).max(200),
        })
      ),
      links: z.array(
        z.object({
          name: z.enum([
            "Github",
            "Youtube",
            "Preview",
            "PlayStore",
            "AppStore",
            "Other",
          ]),
          url: z
            .string()
            .url("Please enter a valid URL (e.g. https://example.com)"),
        })
      ),
    })
  ),
});

type FormSchemaType = z.infer<typeof formSchema>;

export type ProjectFormControlType = Control<FormSchemaType>;

export default function ProjectSettings() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { projects: [] },
  });

  const onSubmit = (values: FormSchemaType) => {
    console.log(values);
  };

  const { fields: projects, append: appendProject } = useFieldArray({
    name: "projects",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {projects.map((project, index) => (
          <Card key={project.id}>
            <CardContent className="py-4">
              <FormField
                control={form.control}
                name={`projects.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input placeholder="My project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ProjectDescriptionForm
                control={form.control}
                name={`projects.${index}.description`}
              />
              <ProjectLinksForm
                control={form.control}
                name={`projects.${index}.links`}
              />
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={() => {
            appendProject({ name: "", description: [], links: [] });
          }}
          type="button"
        >
          Add Project
        </Button>
        <Separator />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
