"use client";

import { createContext, useState } from "react";
import { ErrorState, IResume } from "@/app/type";
import { LATEX_DEFAULT_RESUME_TEMPLATE } from "@/constants";
import { saveAs } from "file-saver";

interface IDocContext {
  error: ErrorState | undefined;
  generateResumePDF: (resume?: IResume) => void;
}
export const DocContext = createContext<IDocContext>({
  error: undefined,
  generateResumePDF: () => {},
});

interface IDocProviderProps {
  children: React.ReactNode;
}

export const DocProvider = ({ children }: IDocProviderProps) => {
  const [error, setError] = useState<ErrorState | undefined>(undefined);

  const populateLatex = (latexTemplate: string, resume: IResume): string => {
    const { name, portfolio, linkedin, projects, skills } = resume;

    // Format projects
    let projectsContent = "";
    if (projects) {
      projects.forEach((project) => {
        projectsContent += `\\subsection*{${project.name}}\n${project.description}\n`;
        if (project.links) {
          project.links.forEach((link) => {
            projectsContent += `\\href{${link.url}}{${link.link_type}}\n`;
          });
        }
      });
    }

    // Format skills
    let skillsContent = "";
    if (skills) {
      skillsContent = skills.join(", ");
    }

    // Populate the template
    let populatedTemplate = latexTemplate
      .replace("%%NAME%%", name)
      .replace("%%PORTFOLIO%%", portfolio)
      .replace("%%LINKEDIN%%", linkedin)
      .replace("%%PROJECTS%%", projectsContent)
      .replace("%%SKILLS%%", skillsContent);

    return populatedTemplate;
  };

  const generateResumePDF = async (resume?: IResume) => {
    if (!resume) return;
    try {
      const latex = populateLatex(LATEX_DEFAULT_RESUME_TEMPLATE, resume);
      // convert latex string to pdf readable format
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latexString: latex }),
      });
      if (response.ok) {
        const pdfBlob = await response.blob();
        console.log("pdfBlob: ", pdfBlob);
        saveAs(pdfBlob, "resume.pdf");
      } else {
        console.error("Error converting LaTeX to PDF");
      }
    } catch (err) {
      console.log("error while generating pdf: ", err);
      // @ts-ignore
      setError({ message: err.message });
    }
  };

  const value: IDocContext = { error, generateResumePDF };
  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
};
