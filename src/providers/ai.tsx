"use client";

import { createContext, useContext, useState } from "react";
import { generateObject } from "ai";
import { createMistral } from "@ai-sdk/mistral";
import {
  ErrorState,
  GenerateLLMObjectProps,
  IDBUser,
  IJobDescription,
  IProject,
  IResume,
  jdSchema,
  resumeSchema,
} from "@/app/type";
import { DatabaseContext } from "./db";
interface IAIContext {
  error: ErrorState | undefined;
  loading: boolean;
  getResume: (jobDescription: string) => Promise<IResume | undefined>;
}
export const AIContext = createContext<IAIContext>({
  error: undefined,
  loading: false,
  getResume: async () => undefined,
});

interface IAIProviderProps {
  children: React.ReactNode;
}

const mistral = createMistral({
  apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY,
});

export const AIProvider = ({ children }: IAIProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState | undefined>(undefined);
  const { getUser } = useContext(DatabaseContext);

  const generateObjectFromLLM = async ({
    mistralModelID,
    outputSchema,
    prompt,
    settings,
  }: GenerateLLMObjectProps) => {
    const { object } = await generateObject({
      ...settings,
      model: mistral(mistralModelID),
      schema: outputSchema,
      prompt: prompt,
    });

    return object;
  };

  const generateJDPrompt = async (
    jobDescription: string
  ): Promise<IJobDescription> => {
    const basicPrompt = `Given the following job description please extract the details defined in the schema:
    Job Description: 
    ${jobDescription}
    `;

    const jdObject: any = await generateObjectFromLLM({
      mistralModelID: "mistral-large-latest",
      outputSchema: jdSchema,
      prompt: basicPrompt,
      settings: {
        temperature: 0.2,
      },
    });

    const finalJD: IJobDescription = {
      jobTitle: jdObject.jobTitle,
      jobDepartment: jdObject.jobDepartment,
      requiredQualifications: jdObject.requiredQualifications,
      experienceLevel: jdObject.experienceLevel,
      technicalSkills: jdObject.technicalSkills,
      companyOverview: jdObject.companyOverview,
    };

    return finalJD;
  };

  const generateResumePrompt = (
    jobDescription: IJobDescription,
    user?: IDBUser
  ) => {
    if (user === undefined) {
      setError({
        message: "User Details not found in the database",
      });
      setLoading(false);
    }
    let projectString: string | undefined = undefined;
    console.log("user", user);
    if (user) {
      projectString =
        user.projects?.length > 0
          ? user.projects
              .map((project: IProject) => {
                return `
                (Project Name: ${project.name}
                Description: ${project.description}
                Links: ${project.links
                  ?.map((link) => {
                    return `
                        (Type: ${link.link_type}
                        URL: ${link.url})
                    `;
                  })
                  .join(", ")}
            )`;
              })
              .join(", ")
          : undefined;
    }

    const prompt = `
        Give me the best points for each section of the resume based on following points:
        1. You are an AI Bot that judges the job description and user details and if there is high similarity then add user details in schema else u keep that field undefined.
        2. The resume should not contain anything else just return the details as it of user or undefined if it doesnt match.
        3. If the user has not provided details that are required in the schema then put undefined for those regions.
        
        Return me the best points for each section from user details that will enhance the resume based on the job description.
        If you think job description doesnt match with the users details then return undefined in those section. The user details must be relevant to job description

        Job Description: 
       ${jobDescription.jobTitle ? `Title: ${jobDescription.jobTitle}` : ""}
         ${
           jobDescription.jobDepartment
             ? `Department: ${jobDescription.jobDepartment}`
             : ""
         }
         ${
           jobDescription.companyOverview
             ? `Company Overview: ${jobDescription.companyOverview}`
             : ""
         }
         ${
           jobDescription.experienceLevel
             ? `Experience Level: ${jobDescription.experienceLevel}`
             : ""
         }
            ${
              jobDescription.requiredQualifications.length > 0
                ? `Required Qualifications: ${jobDescription.requiredQualifications
                    .filter((item, index) => index < 2)
                    .join(", ")}`
                : ""
            }
            ${
              jobDescription.technicalSkills.length > 0
                ? `Technical Skills: ${jobDescription.technicalSkills
                    .filter((item, index) => index < 2)
                    .join(", ")}`
                : ""
            }

        ${
          user
            ? `
            User Details:
        Name: ${user.name}
        ${user.github_url ? `Github: ${user.github_url}` : ""}
        ${user.linkedin_url ? `Linkedin: ${user.linkedin_url}` : ""}
        ${user.portfolio_url ? `Portfolio: ${user.portfolio_url}` : ""}
        ${user.other_url ? `Other: ${user.other_url}` : ""}
       ${projectString ? `Projects: ${projectString}` : ""}    
        `
            : ""
        }
        
    `;

    return prompt;
  };

  const getResumeSchema = async (jobDescription: IJobDescription) => {
    const user = await getUser();
    const resumePrompt = generateResumePrompt(jobDescription, user);
    console.log("resume prompt: ", resumePrompt);
    const resumeObject = await generateObjectFromLLM({
      mistralModelID: "mistral-large-latest",
      outputSchema: resumeSchema,
      prompt: resumePrompt,
      settings: {
        temperature: 0.2,
        maxRetries: 5,
        presencePenalty: 0.5,
        frequencyPenalty: 0.5,
      },
    });

    return resumeObject;
  };
  const getResume = async (
    jobDescription: string
  ): Promise<IResume | undefined> => {
    setLoading(true);
    try {
      const structuredJobDescription = await generateJDPrompt(jobDescription);
      const resumeObject: any = await getResumeSchema(structuredJobDescription);

      const resume: IResume = {
        name: resumeObject.name,
        portfolio: resumeObject.portfolio,
        linkedin: resumeObject.linkedin,
        projects: resumeObject.projects,
        skills: resumeObject.skills,
      };

      return resume;
    } catch (err) {
      console.log("ERROR: ", err);
      // @ts-ignore
      setError({ message: err.message });
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const value: IAIContext = { getResume, error, loading };
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
