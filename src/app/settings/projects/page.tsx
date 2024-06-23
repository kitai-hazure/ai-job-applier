"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
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
import { withPrivate } from "@/hooks/route";
import { SettingsLayoutProps } from "../type";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "@/providers/db";
import { projects as projectSchema, links as linkSchema } from "@/db/schema";
import AlertBox from "@/components/custom/dialog";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

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

function ProjectSettings({ session }: SettingsLayoutProps) {
  const router = useRouter();
  const { insertIntoDB, error, loading } = useContext(DatabaseContext);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { projects: [] },
  });
  const [success, showSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("project_setup")) {
        router.replace("/dashboard");
      }
    }
  }, [typeof window]);
  const onSubmit = async (values: FormSchemaType) => {
    values.projects.forEach(async (project) => {
      const projectDB = {
        name: project.name,
        description: project.description.map((desc) => desc.body),
        user_id: session?.user?.id,
      };

      const projectInDB = await insertIntoDB(projectSchema, projectDB);
      if (projectInDB && !error && project.links) {
        project.links.forEach(async (link) => {
          const linkDB = {
            project_id: projectInDB.lastInsertRowid,
            type: link.name,
            url: link.url,
          };
          await insertIntoDB(linkSchema, linkDB, (result) => {
            showSuccess(true);
          });
        });
      }
    });
    if (typeof window !== "undefined" && !error) {
      localStorage.setItem("project_setup", "true");
    }
  };

  const { fields: projects, append: appendProject } = useFieldArray({
    name: "projects",
    control: form.control,
  });

  return !loading && !error ? (
    <>
      {!success ? (
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
      ) : (
        <AlertBox
          title="Success"
          message="Project has been added successfully."
          onClose={() => showSuccess(false)}
        />
      )}
    </>
  ) : loading ? (
    <Loader height={12} width={12} />
  ) : error ? (
    <AlertBox title={"Error"} message={error.message} />
  ) : null;
}

export default withPrivate(ProjectSettings);
