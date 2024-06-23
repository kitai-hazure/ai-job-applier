"use client";
import React, { useContext, useEffect } from "react";
import { SupabaseContext } from "@/providers/supabase";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export const withPublic = (Component: any) => {
  return function WithPublic(props: any) {
    const { isAuthenticated, session } = useContext(SupabaseContext);
    const router = useRouter();

    if (isAuthenticated) {
      if (typeof window !== "undefined") {
        const profileSetup = localStorage.getItem("profile_setup");
        const projectSetup = localStorage.getItem("project_setup");

        if (profileSetup && projectSetup) {
          router.replace("/dashboard");
        } else if (profileSetup) {
          router.replace("/settings/projects");
        } else {
          router.replace("/settings/profile");
        }
      }
      return <Loader />;
    }
    return <Component session={session} {...props} />;
  };
};

export const withPrivate = (Component: any) => {
  return function WithPrivate(props: any) {
    const { isAuthenticated, session } = useContext(SupabaseContext);
    const router = useRouter();
    if (!isAuthenticated) {
      router.replace("/");
      return <Loader />;
    }
    return <Component session={session} {...props} />;
  };
};
