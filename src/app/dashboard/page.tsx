"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/text-area";
import { withPrivate } from "@/hooks/route";
import { Separator } from "@radix-ui/react-separator";
import { useContext, useState } from "react";
import { AIContext } from "@/providers/ai";
import AlertBox from "@/components/custom/dialog";
import { Loader } from "lucide-react";
import { DocContext } from "@/providers/doc";

const Dashboard = () => {
  const { getResume, error, loading } = useContext(AIContext);
  const { error: docError, generateResumePDF } = useContext(DocContext);
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
        {!loading && !error ? (
          <div className="flex flex-col justify-center item-stretch h-full w-full">
            <Textarea
              placeholder="Start typing the job description..."
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
            />
            <div className="w-full flex justify-center items-center">
              <Button
                className="my-6 w-60"
                variant={"default"}
                onClick={async () => {
                  const resume = await getResume(jobDescription);
                  generateResumePDF(resume);
                }}
              >
                Generate Resume
              </Button>
            </div>
          </div>
        ) : error ? (
          <AlertBox title="Error" message={error.message} />
        ) : loading ? (
          <Loader size={40} />
        ) : (
          <AlertBox title="Error" message={"Something went wrong"} />
        )}
      </div>
    </main>
  );
};

export default withPrivate(Dashboard);
