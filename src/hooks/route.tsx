"use client";
import React, { useContext } from "react";
import { SupabaseContext } from "@/providers/supabase";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export const withPublic = (Component: any) => {
  return function WithPublic(props: any) {
    const { isAuthenticated, session } = useContext(SupabaseContext);
    const router = useRouter();
    if (isAuthenticated) {
      router.replace("/settings");
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
