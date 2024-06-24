import { projects } from "@/db/schema";
import { MistralChatModelId } from "@ai-sdk/mistral";
import { CallSettings } from "ai";
import { Schema, z } from "zod";

export interface GenerateLLMObjectProps {
    outputSchema: Schema;
    mistralModelID: MistralChatModelId;
    prompt: string;
    settings?: CallSettings;
  }

  export const jdSchema = z.object({
    jobTitle: z.string(),
    jobDepartment: z.string(),
    requiredQualifications: z.array(z.string()),
    experienceLevel: z.string(),
    technicalSkills: z.array(z.string()),
    companyOverview: z.string(),
  });

export interface IJobDescription {
    jobTitle: string | undefined;
    jobDepartment: string | undefined;
    requiredQualifications: string[];
    experienceLevel: string | undefined;
    technicalSkills: string[];
    companyOverview: string | undefined;
}
export enum LinkType {
   GITHUB = "Github", 
   YOUTUBE = "Youtube", 
   PREVIEW = "Preview", 
   PLAYSTORE = "PlayStore",
   APPSTORE = "AppStore", 
   OTHER = "Other"
}
export interface ILink {
    link_type: LinkType;
    url: string;
}
export interface IProject {
    id: number;
    name: string;
    description: string;
    links: ILink[] | null,
}

export interface IDBUser {
    name: string;
    github_url: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    other_url: string | null;
    projects: IProject[]
}

export const resumeSchema = z.object({
    name: z.string(),
    portfolio: z.string(),
    linkedin: z.string(),
    projects: z.union([z.string(), z.array(z.object({
        title: z.string(),
        description: z.string(),
        link: z.array(z.object({
            type: z.string(),
            url: z.string(),
        }))
    }))]),
    skills: z.union([z.string(), z.array(z.string())]) ,
})

export interface ErrorState {
    message: string;
  }

export interface IResume {
    name: string;
    portfolio: string;
    linkedin: string;
    projects: IProject[];
    skills: string[];
}