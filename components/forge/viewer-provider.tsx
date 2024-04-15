import { createContext, useContext, useState } from "react";
import ViewerServiceAggr from "./viewer-service-aggr";

interface ViewerContentProps {
  viewer: any;
  setViewer: (value: any) => void;
  isModelLoaded: boolean;
  setIsModelLoaded: (value: boolean) => void;
  setViewerService: (value: ViewerServiceAggr) => void;
}

const ViewerContext = createContext<ViewerContentProps | null>(null);

export function ViewerProvider({ children }: any) {
  const [viewer, setViewer] = useState<any>(null);
  const [viewerService, setViewerService] = useState<ViewerServiceAggr | null>(
    null
  );
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  return (
    <ViewerContext.Provider
      value={{
        viewer,
        setViewer,
        isModelLoaded,
        setIsModelLoaded,
        setViewerService,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewer() {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error("useViewer must be used within a ViewerProvider");
  }
  return context;
}
