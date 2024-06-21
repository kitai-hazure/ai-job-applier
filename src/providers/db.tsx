"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ResultSet, Row, createClient } from "@libsql/client";
import { SupabaseContext } from "./supabase";
import { SQLiteTable, SelectedFields } from "drizzle-orm/sqlite-core";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { SQL, sql } from "drizzle-orm";
import { MESSAGES } from "@/constants";
import { profile } from "@/db/schema";

interface ErrorState {
  message: string;
}
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
}
export const DatabaseContext = createContext<IDatabaseContext>({
  db: undefined,
  error: undefined,
  loading: false,
  insertIntoDB: async () => undefined,
  queryDB: async () => undefined,
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

  useEffect(() => {
    const getUser = async () => {
      if (isAuthenticated && session?.user?.id) {
        const user = await queryDB(
          profile,
          {
            id: profile.auth_id,
            name: profile.name,
          },
          sql`auth_id = ${session?.user?.id}`
        );

        console.log("user", user);
      }
    };

    getUser();
  }, [isAuthenticated, session?.user?.id]);

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
  };
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
