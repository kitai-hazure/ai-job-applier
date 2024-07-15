"use client";

import { ILink, IProject } from "@/app/type";


export const getDefaultProjects = (githubProjects: IProject[] | undefined) => {
    if(!githubProjects) return [];
    return githubProjects?.filter((_: any, index: number) => index < 10)?.map((project: IProject) => {
      const formattedProject = {
        name: project.name,
        description: [{ body: project.description ?? "" }],
        links: project.links
          ? project.links.map((link: ILink) => ({
              name: link.link_type,
              url: link.url,
            }))
          : [],
      };

      return formattedProject;
    });
}