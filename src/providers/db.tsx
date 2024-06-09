"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@libsql/client";
import { SupabaseContext } from "./supabase";
import { SQLiteTable, SelectedFields } from "drizzle-orm/sqlite-core";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import { MESSAGES } from "@/constants";

interface ErrorState {
  message: string;
}
interface IDatabaseContext {
  db: LibSQLDatabase<Record<string, never>> | undefined;
  error: ErrorState | undefined;
  loading: boolean;
  insertIntoDB: (table: SQLiteTable, values: any) => Promise<void>;
  queryDB?: (
    table: SQLiteTable,
    fields?: SelectedFields,
    filterQuery?: string
    // TODO -> MAKE IT TYPE STRICT
  ) => Promise<any>;
}
export const DatabaseContext = createContext<IDatabaseContext>({
  db: undefined,
  error: undefined,
  loading: false,
  insertIntoDB: async () => {},
  queryDB: async () => {},
});

interface IDatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider = ({ children }: IDatabaseProviderProps) => {
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

  const insertIntoDB = async (table: SQLiteTable, values: any) => {
    if (!db || !isAuthenticated) {
      setError({
        message: MESSAGES.AUTH_ERROR,
      });
      return;
    }
    setLoading(true);
    try {
      await db.insert(table).values(values);
      setLoading(false);
    } catch (err) {
      // @ts-ignore
      setError({ message: err.message });
      setLoading(false);
    }
  };

  const queryDB = async (
    table: SQLiteTable,
    fields?: SelectedFields,
    filterQuery?: string
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
        .select(fields ?? {})
        .from(table)
        .where(filterQuery ? sql`${filterQuery}` : sql``)
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
