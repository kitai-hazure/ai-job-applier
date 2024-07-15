"use client";

import { createContext, useState } from "react";
import { ErrorState } from "@/app/type";

interface IThirdPartyConnectorContext {
  error: ErrorState | undefined;
  loading: boolean;
  connectGithub: () => void;
  connectLinkedIn: () => void;
}
export const ThirdPartyConnectorContext =
  createContext<IThirdPartyConnectorContext>({
    error: undefined,
    loading: false,
    connectGithub: () => {},
    connectLinkedIn: () => {},
  });

interface IThirdPartyConnectorProviderProps {
  children: React.ReactNode;
}

export const ThirdPartyConnectorProvider = ({
  children,
}: IThirdPartyConnectorProviderProps) => {
  const [error, setError] = useState<ErrorState | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const connectGithub = () => {
    try {
      setLoading(true);
      const endpoint = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}&scope=repo`;
      window.location.href = endpoint;
      // Connect to Github
    } catch (error) {
      // @ts-ignore
      setError({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const connectLinkedIn = () => {
    try {
      setLoading(true);
      const state = "random-string";
      const scope = "r_liteprofile r_emailaddress";

      const endpoint = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}&state=${state}&scope=${scope}`;

      window.location.href = endpoint;
    } catch (error) {
      // @ts-ignore
      setError({ message: error.message });
    } finally {
      setLoading(false);
    }
  };
  const value: IThirdPartyConnectorContext = {
    error,
    loading,
    connectGithub,
    connectLinkedIn,
  };
  return (
    <ThirdPartyConnectorContext.Provider value={value}>
      {children}
    </ThirdPartyConnectorContext.Provider>
  );
};
