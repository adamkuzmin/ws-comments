import WorkspaceGrid from "@/components/ui/workspace/workspace-grid";
import { WorkspaceProvider } from "@/components/services/workspace-services/workspace/workspace-provider";

const WorkspacePage = () => {
  return (
    <WorkspaceProvider>
      <WorkspaceGrid />
    </WorkspaceProvider>
  );
};

export default WorkspacePage;
