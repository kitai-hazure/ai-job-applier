import { Schema, z } from "zod";

export interface GenerateLLMObjectProps {
    outputSchema: Schema;
    mistralModelID: any;
    prompt: string;
    settings?: any;
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
    // can be null or string
    name: z.nullable(z.string()),
    portfolio: z.nullable(z.string()),
    linkedin: z.nullable(z.string()),
    projects: z.nullable(z.union([z.nullable(z.string()), 
        z.nullable(z.array(z.object({
        title: z.nullable(z.string()),
        description: z.nullable(z.string()),
        link: z.nullable(z.array(z.object({
            type: z.nullable(z.string()),
            url: z.nullable(z.string()),
        })))
    })))])),
    skills: z.nullable(z.union([z.string(), z.array(z.string())])),
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