import { Project } from "@/components/types/supabase-data.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const CLIENT_ID = "CDZCpxk2OBTmXKuhyXnUFvRyywe2C5GFrXqmG5aEts1anjkl";

class WorkspaceService {
  private _projects: any[] = [];

  private $setProjects: (projects: any[]) => void = () => {};
  private $setIsReady: (isReady: boolean) => void = () => {};

  constructor(private _supabase: SupabaseClient) {}

  private async _init() {
    const supabase = this._supabase;

    let { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select(
        `
        *,
        userprojects!inner(
          user_id
        )
      `
      )
      .not("bim_id", "is", null)
      .eq("bim_client_id", CLIENT_ID)
      .not("bim_urn", "is", null)
      .order("created_at", { ascending: false });

    let { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*");

    const projects = projectData as Project[];

    const profiles = profileData as any;
    const profilesMap = new Map();
    profiles.forEach((profile: any) => {
      profilesMap.set(profile.user_id, profile);
    });

    projects.forEach((project) => {
      project.userprojects.forEach((userproject: any) => {
        const profile = profilesMap.get(userproject.user_id);
        userproject.username = profile?.username;
      });
    });

    this._projects = projects;
    this.$setProjects(projects);
    this.$setIsReady(true);
  }

  public provideStates(states: States) {
    this.$setProjects = states.setProjects;
    this.$setIsReady = states.setIsReady;

    this._init();
  }
}

interface States {
  setProjects: (projects: any[]) => void;
  setIsReady: (isReady: boolean) => void;
}

export default WorkspaceService;
