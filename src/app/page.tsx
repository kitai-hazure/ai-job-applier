"use client";

import { withPublic } from "@/hooks/route";
import { SupabaseContext } from "@/providers/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useContext } from "react";

function Home() {
  const { client } = useContext(SupabaseContext);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center text-primary">
        Welcome to AI Job Applier
      </h1>
      <Auth
        supabaseClient={client}
        appearance={{
          theme: ThemeSupa,
        }}
        providers={["google"]}
      />
    </main>
  );
}

export default withPublic(Home);
