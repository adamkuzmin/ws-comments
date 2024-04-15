import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/components/supabase-client";

import { useRouter } from "next/router";
import { Project } from "@/components/types/supabase-data.types";
import WorkspaceService from "./workspace-service";

interface WorkspaceProps {
  workspaceService: WorkspaceService;
  projects: Project[];
  isReady: boolean;
}

const WorkspaceContext = createContext<WorkspaceProps | undefined>(undefined);

export function WorkspaceProvider({ children }: any) {
  const router = useRouter();

  const [workspaceService] = useState(() => new WorkspaceService(supabase));
  const [projects, setProjects] = useState<Project[]>([]);

  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!router?.isReady) return;

    workspaceService.provideStates({
      setProjects,
      setIsReady,
    });
  }, [router]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceService,
        projects,
        isReady,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
