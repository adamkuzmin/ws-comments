import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import GlobalStatesService from "./global-states-service";
import { useRouter } from "next/router";
import { useProject } from "../project-service/project-provider";

// Interface definitions for global states
interface GlobalStatesProps {
  globalStatesService: GlobalStatesService;
  isSettingsPanelOpen: boolean;
  isCommentsPanelOpen: boolean;
  commentAdding: boolean;
  commentAwaitingSelection: boolean;
  commentPointSelected: boolean;
}

// Context creation
const GlobalStatesContext = createContext<GlobalStatesProps | undefined>(
  undefined
);

// Interface for component props
interface ProviderProps {
  children: ReactNode;
}

// Context provider component
export const GlobalStatesProvider: React.FC<ProviderProps> = ({ children }) => {
  const { projectService } = useProject();

  // Router for handling routing-related logic
  const router = useRouter();

  // State definitions
  // Service instance
  const [globalStatesService] = useState(
    () => projectService.globalStatesService
  );

  // UI Panel States
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);

  // States related to the comment adding process
  const [commentAdding, setCommentAdding] = useState(false);
  const [commentAwaitingSelection, setCommentAwaitingSelection] =
    useState(false);
  const [commentPointSelected, setCommentPointSelected] = useState(false);

  // Effect hook for initializing and updating global states
  useEffect(() => {
    // Only proceed once the router is ready
    if (!router?.isReady) return;

    // Provide component states to the global state service
    globalStatesService.provideStates({
      setIsSettingsPanelOpen,
      setIsCommentsPanelOpen,
      setCommentAdding,
      setCommentAwaitingSelection,
      setCommentPointSelected,
    });
  }, [router?.isReady]); // Depend on router readiness

  // Context provider value
  const value = {
    globalStatesService,
    isSettingsPanelOpen,
    isCommentsPanelOpen,
    commentAdding,
    commentAwaitingSelection,
    commentPointSelected,
  };

  // Render provider with context
  return (
    <GlobalStatesContext.Provider value={value}>
      {children}
    </GlobalStatesContext.Provider>
  );
};

// Custom hook for consuming context
export const useGlobalStates = (): GlobalStatesProps => {
  const context = useContext(GlobalStatesContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalStates must be used within a GlobalStatesProvider"
    );
  }
  return context;
};
