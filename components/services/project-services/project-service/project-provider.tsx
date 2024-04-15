import React, { Component } from "react";
import { NextRouter } from "next/router"; // Assuming you are using Next.js as mentioned earlier.
import ProjectService, { ProjectUser } from "./project-service";
import { supabase } from "@/components/supabase-client";
import { withRouter } from "next/router";
import AuthService from "../../app-services/auth/auth-service";

interface ProjectProviderProps {
  children: React.ReactNode;
  authService: AuthService; // Type assuming AuthService is correctly typed elsewhere
  nextRouter: NextRouter; // This type should match your router's type, adjust accordingly if not using Next.js
  init: React.MutableRefObject<boolean>;
}

interface ProjectProviderState {
  title: string;
  thumbnail: string | null;
  projectUsers: ProjectUser[];
  isReady: boolean;
  projectService: ProjectService;
}

export const ProjectContext = React.createContext<
  ProjectProviderState | undefined
>(undefined);

export class ProjectProvider extends Component<
  ProjectProviderProps,
  ProjectProviderState
> {
  constructor(props: ProjectProviderProps) {
    super(props);

    /* console.log("ProjectProviderProps props", props);

    if (!props.init.current) {
      props.init.current = true;
      return;
    } */

    this.state = {
      title: "",
      thumbnail: null,
      projectUsers: [],
      isReady: false,
      projectService: new ProjectService(supabase, props.authService),
    };
  }

  componentDidMount() {
    if (!this.state?.projectService) return;

    const { projectService } = this.state;

    projectService.provideStates({
      router: this.props.nextRouter,
      setIsReady: this.setIsReady,
      setTitle: this.setTitle,
      setThumbnail: this.setThumbnail,
      setProjectUsers: this.setProjectUsers,
    });

    if (this.props.nextRouter?.isReady) {
      this.fetchProjectDetails();
    }
  }

  componentWillUnmount() {
    // this.state.projectService.dispose();
  }

  fetchProjectDetails = () => {
    // Example of fetching project details here
    this.setState({ isReady: true }); // Example of setting state directly
  };

  setIsReady = (isReady: boolean) => {
    this.setState({ isReady });
  };

  setTitle = (title: string) => {
    this.setState({ title });
  };

  setThumbnail = (thumbnail: string | null) => {
    this.setState({ thumbnail });
  };

  setProjectUsers = (projectUsers: ProjectUser[]) => {
    this.setState({ projectUsers });
  };

  render() {
    if (!this.state?.projectService) return null;

    return (
      <ProjectContext.Provider value={this.state}>
        {this.state?.isReady && this.props.children}
      </ProjectContext.Provider>
    );
  }
}

export function useProject() {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

export default ProjectProvider;
