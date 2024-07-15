"use client";

import { useContext, useEffect } from "react";
import { IProject, LinkType } from "../type";
import { SupabaseContext } from "@/providers/supabase";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const SuccessPage = () => {
  const router = useRouter();
  const { setGithubProjects } = useContext(SupabaseContext);
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    const getProjects = async () => {
      if (router && setGithubProjects && token) {
        const res = await fetch(`/api/github/fetch-projects?token=${token}`);
        const data = await res.json();
        const projects: IProject[] = data?.repos?.map(
          (item: any, index: number) => {
            const project: IProject = {
              description: item?.description,
              name: item?.name,
              id: index + 1,
              links: [
                {
                  link_type: LinkType.GITHUB,
                  url: item?.url,
                },
              ],
            };
            return project;
          }
        );
        const uniqueProjects = projects.filter(
          (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        );
        setGithubProjects(uniqueProjects);
        router.push("/settings/projects");
      }
    };
    getProjects();
  }, [token, setGithubProjects, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader size={25} />
      <p className="mt-4 text-xl">
        Please wait while we fetch your projects and get them ready for you...
      </p>
    </div>
  );
};

export default SuccessPage;
