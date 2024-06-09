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
import { useContext } from "react";
import { DatabaseContext } from "@/providers/db";
import { Loader } from "lucide-react";
import AlertBox from "@/components/custom/dialog";

const formSchema = z.object({
  name: z.string().min(4).max(50),
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
  const { insertIntoDB, error, loading } = useContext(DatabaseContext);
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      links: [],
    },
  });

  async function onSubmit(values: ProfileFormSchemaType) {
    let dbValues: any = {
      name: values.name,
    };
    values.links.forEach((link) => {
      dbValues[`${link.name.toLowerCase()}_url`] = link.url;
    });
    await insertIntoDB(profile, dbValues);
  }

  console.log("errors", form.formState.errors);

  return !loading && !error ? (
    <>
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
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </>
  ) : loading ? (
    <Loader />
  ) : error ? (
    <AlertBox title={"Error"} message={error.message} />
  ) : null;
}

export default withPrivate(ProfileSetttings);
