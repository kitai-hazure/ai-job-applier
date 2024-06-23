"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { withPrivate } from "@/hooks/route";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";

const Dashboard = () => {
  const [jobDescription, setJobDescription] = useState("");

  return (
    <main className="">
      <div className="space-y-6 p-6 pb-16 md:block md:p-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Start building your resume with the power of AI JOB APPLIER
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col justify-center item-stretch h-full w-full">
          <Textarea
            placeholder="Start typing the job description..."
            onChange={(e) => {
              setJobDescription(e.target.value);
            }}
          />
          <div className="w-full flex justify-center items-center">
            <Button className="my-6 w-60" variant={"default"}>
              Generate Resume
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default withPrivate(Dashboard);
