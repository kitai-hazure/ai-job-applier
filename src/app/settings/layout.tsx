import { SidebarNav } from "@/components/settings/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { withPrivate } from "@/hooks/route";
import { Metadata } from "next";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Projects",
    href: "/settings/projects",
  },
];

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences",
};

function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen">
      <div className="space-y-6 p-6 pb-16 md:block md:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 w-full lg:h-[75vh] lg:overflow-y-scroll lg:scroll-smooth no-scrollbar">
            <div className="lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingsLayout;
