"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { ProfileLinksForm } from "@/components/settings/profile-links-form";
import { Button } from "@/components/ui/button";

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

export default function ProfileSetttings() {
  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      links: [],
    },
  });

  function onSubmit(values: ProfileFormSchemaType) {
    console.log(values);
  }

  console.log("errors", form.formState.errors);

  return (
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
  );
}
