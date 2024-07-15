"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const SuccessPage = () => {
  const router = useRouter();
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    const getProfile = async () => {
      if (router && token) {
        const res = await fetch(`/api/linkedin/fetch-profile?token=${token}`);
        const data = await res.json();
        console.log("data:", data);
      }
    };
    getProfile();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader size={25} />
      <p className="mt-4 text-xl">
        Please wait while we fetch your profile and get it ready for you...
      </p>
    </div>
  );
};

export default SuccessPage;
