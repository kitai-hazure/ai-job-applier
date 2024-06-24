"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ResultSet, Row, createClient } from "@libsql/client";
import { SupabaseContext } from "./supabase";
import { SQLiteTable, SelectedFields } from "drizzle-orm/sqlite-core";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { SQL, sql } from "drizzle-orm";
import { MESSAGES } from "@/constants";
import { links, profile, projects } from "@/db/schema";
import { ErrorState, IDBUser, ILink, IProject } from "@/app/type";

interface IDatabaseContext {
  db: LibSQLDatabase<Record<string, never>> | undefined;
  error: ErrorState | undefined;
  loading: boolean;
  insertIntoDB: (
    table: SQLiteTable,
    values: any,
    onSuccess?: (result: ResultSet) => void
  ) => Promise<ResultSet | undefined>;
  queryDB?: (
    table: SQLiteTable,
    fields?: SelectedFields,
    filterQuery?: SQL
    // TODO -> MAKE IT TYPE STRICT
  ) => Promise<any>;
  getUser: () => Promise<IDBUser | undefined>;
}
export const DatabaseContext = createContext<IDatabaseContext>({
  db: undefined,
  error: undefined,
  loading: false,
  insertIntoDB: async () => undefined,
  queryDB: async () => undefined,
  getUser: async () => undefined,
});

interface IDatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider = ({ children }: IDatabaseProviderProps) => {
  const { session } = useContext(SupabaseContext);
  const [db, setDB] = useState<
    LibSQLDatabase<Record<string, never>> | undefined
  >(undefined);
  const [error, setError] = useState<ErrorState | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useContext(SupabaseContext);

  useEffect(() => {
    const dbClient = createClient({
      url: process.env.NEXT_PUBLIC_TURSO_DB_URL! as string,
      authToken: process.env.NEXT_PUBLIC_TURSO_DB_AUTH_TOKEN! as string,
    });
    const dbInstance = drizzle(dbClient);
    setDB(dbInstance);
  }, [isAuthenticated]);

  const getUser = async () => {
    if (!db || !isAuthenticated) {
      setError({
        message: MESSAGES.AUTH_ERROR,
      });
      return;
    }
    setLoading(true);
    try {
      const user = await db
        .select()
        .from(profile)
        .leftJoin(projects, sql`profile.auth_id = projects.user_id`)
        .leftJoin(links, sql`projects.id = links.project_id`)
        .where(sql`profile.auth_id = ${session?.user?.id}`)
        .execute();

      setLoading(false);
      const dbProjects: IProject[] = [];
      user.forEach((row: any) => {
        const projectID = row.projects.id;
        const localLink: ILink | null = row.links
          ? {
              link_type: row.links.type,
              url: row.links.url,
            }
          : null;
        if (!dbProjects.some((project) => project.id === projectID)) {
          const project: IProject = {
            id: projectID,
            name: row.projects.name,
            description: row.projects.description,
            links: localLink ? [localLink] : null,
          };
          dbProjects.push(project);
        } else {
          const projectIndex = dbProjects.findIndex(
            (project) => project.id === projectID
          );
          if (localLink !== null) {
            if (dbProjects[projectIndex]?.links !== null) {
              dbProjects[projectIndex].links?.push(localLink);
            } else {
              dbProjects[projectIndex].links = [localLink];
            }
          }
        }
      });
      const dbUser: IDBUser = {
        name: user[0].profile.name,
        github_url: user[0].profile.github_url,
        linkedin_url: user[0].profile.linkedin_url,
        portfolio_url: user[0].profile.portfolio_url,
        other_url: user[0].profile.other_url,
        projects: dbProjects,
      };
      return dbUser;
    } catch (err) {
      // @ts-ignore
      setError({ message: err.message });
      setLoading(false);
      return undefined;
    }
  };

  const insertIntoDB = async (
    table: SQLiteTable,
    values: any,
    onSuccess?: (result: ResultSet) => void
  ) => {
    if (!db || !isAuthenticated) {
      setError({
        message: MESSAGES.AUTH_ERROR,
      });
      return undefined;
    }
    setLoading(true);
    try {
      const result = await db.insert(table).values(values);
      setLoading(false);

      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      // @ts-ignore
      setError({ message: err.message });
      setLoading(false);
      return undefined;
    }
  };

  const queryDB = async (
    table: SQLiteTable,
    fields?: any,
    filterQuery?: SQL
  ) => {
    if (!db || !isAuthenticated) {
      setError({
        message: MESSAGES.AUTH_ERROR,
      });
      return;
    }
    setLoading(true);
    try {
      const result = await db
        .select(fields)
        .from(table)
        .where(filterQuery)
        .execute();

      setLoading(false);
      return result;
    } catch (err) {
      // @ts-ignore
      setError({ message: err.message });
      setLoading(false);
      return undefined;
    }
  };

  const value: IDatabaseContext = {
    db,
    error,
    loading,
    insertIntoDB,
    queryDB,
    getUser,
  };
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
