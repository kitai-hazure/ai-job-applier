"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ProfileLinksForm } from "@/components/settings/profile-links-form";
import { Button } from "@/components/ui/button";
import { withPrivate } from "@/hooks/route";
import { SettingsLayoutProps } from "../type";
import { profile } from "@/db/schema";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "@/providers/db";
import { Loader } from "lucide-react";
import AlertBox from "@/components/custom/dialog";
import { useRouter } from "next/navigation";
import { ProfileExperienceForm } from "@/components/settings/profile-experience-form";
import { ProfileEducationForm } from "@/components/settings/profile-education-form";

const formSchema = z.object({
  name: z.string().min(4).max(50),
  experiences: z.array(
    z.object({
      title: z.string().min(4).max(50),
      company: z.string().min(4).max(50),
      description: z.string().min(10).max(200),
      start_date: z.date(),
      end_date: z.date(),
    })
  ),
  education: z.array(
    z.object({
      school: z.string().min(4).max(50),
      degree: z.string().min(4).max(50),
      field_of_study: z.string().min(4).max(50),
      start_date: z.date(),
      end_date: z.date(),
    })
  ),
  links: z
    .array(
      z.object({
        name: z.enum(["Github", "Linkedin", "Portfolio", "Other"]),
        url: z
          .string()
          .url("Please enter a valid URL (e.g. https://example.com)"),
      })
    )
    .min(1),
});

type ProfileFormSchemaType = z.infer<typeof formSchema>;
export type ProfileFormControlType = Control<ProfileFormSchemaType>;

function ProfileSetttings({ session }: SettingsLayoutProps) {
  const router = useRouter();
  const { insertIntoDB, error, loading } = useContext(DatabaseContext);
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      links: [],
      education: [],
      experiences: [],
    },
  });

  const [success, showSuccess] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("profile_setup")) {
        router.replace("/settings/projects");
      }
    }
  }, [typeof window]);

  async function onSubmit(values: ProfileFormSchemaType) {
    console.log("values: ", values);
    // let dbValues: any = {
    //   name: values.name,
    // };
    // values.links.forEach((link) => {
    //   dbValues[`${link.name.toLowerCase()}_url`] = link.url;
    // });
    // dbValues["auth_id"] = session?.user?.id;
    // await insertIntoDB(profile, dbValues, (result) => {
    //   showSuccess(true);
    // });
    // if (typeof window !== "undefined" && !error) {
    //   localStorage.setItem("profile_setup", "true");
    // }
  }

  return !loading && !error ? (
    <>
      {!success ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <ProfileLinksForm control={form.control} name="links" />
            <Separator />
            <ProfileExperienceForm control={form.control} name="experiences" />
            <Separator />
            <ProfileEducationForm control={form.control} name="education" />
            <Separator />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      ) : (
        <AlertBox
          title="Success"
          message="Profile created successfully"
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

export default withPrivate(ProfileSetttings);
