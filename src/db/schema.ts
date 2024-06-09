import { integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const profile = sqliteTable  ('profile', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  github_url: text('github_url'),
  linkedin_url: text('linkedin_url'),
  portfolio_url: text('portfolio_url'),
  other_url: text('other_url'),
});

export const projects = sqliteTable('projects', {
    id: integer('id').primaryKey().unique(),
    name: text('name').notNull(),
    description: text('description'),
  });
  
export const links = sqliteTable('links', {
    id: integer('id').primaryKey().unique(),
    project_id: integer('project_id').references(() => projects.id),
    type: text('link_type', {enum: ['Github', 'Linkedin', 'Portfolio', 'Other']}).notNull(),
    url: text('url'),
});

export type InsertProfile = typeof profile.$inferInsert;
export type SelectProfile = typeof profile.$inferSelect;
export type InsertProjects = typeof projects.$inferInsert;
export type SelectProjects = typeof projects.$inferSelect;
export type InsertLinks = typeof links.$inferInsert;
export type SelectLinks = typeof links.$inferSelect;