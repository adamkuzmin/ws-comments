import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useViewer } from "./viewer-provider";
import Viewer from "./viewer-aggr";
import { useProject } from "../services/project-services/project-service/project-provider";

const ViewerW = () => {
  const { projectService } = useProject();
  const { setViewer, setIsModelLoaded, setViewerService } = useViewer();

  const router = useRouter();
  const [urns, setUrns] = useState<string[] | null>(null);

  useEffect(() => {
    if (!router?.isReady) return;

    // Assuming 'urn' query parameter can be a single value or an array
    const newUrns = [router.query.urn as string];
    setUrns(newUrns);
  }, [router?.isReady]);

  return (
    <Viewer
      projectService={projectService}
      urns={urns}
      setViewer={setViewer}
      setIsModelLoaded={setIsModelLoaded}
      setViewerService={setViewerService}
    />
  );
};

export default ViewerW;
