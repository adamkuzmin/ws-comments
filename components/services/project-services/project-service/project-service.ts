import { NextRouter } from "next/router";
import base64url from "base64url";

import { SupabaseClient } from "@supabase/supabase-js";
import { Project } from "@/components/types/supabase-data.types";
import { supabase } from "@/components/supabase-client";
import GlobalStatesService from "../global-states-service/global-states-service";
import CommentService from "../comment-service/comment-service";
import ActiveCommentService from "../active-comment-service/active-comment-service";
import Markup3DService from "../markup-3d-service/markup-3d-service";
import ViewerServiceAggr from "@/components/forge/viewer-service-aggr";
import AuthService from "../../app-services/auth/auth-service";
import Markup2DService from "../markup-2d-service/markup-2d-service";
import HotkeyService from "../hotkey-service/hotkey-service";
import { v4 as uuidv4 } from "uuid";

class ProjectService {
  private _router: any;

  private _wasInitialized: boolean = false;

  private _uuid: string;

  public id: string | null = null;
  public title: string | null = null;
  public bimId: string | null = null;
  public createdAt: string | null = null;
  public thumbnail: string | null = null;

  public projectUsers: Map<string, ProjectUser>;

  private $setIsReady: any;
  private $setTitle: any;
  private $setThumbnail: any;
  private $setProjectUsers: any;

  private _globalStatesService: GlobalStatesService;
  private _commentService: CommentService;
  private _activeCommentService: ActiveCommentService;
  private _viewerServiceAggr: ViewerServiceAggr;

  private _markup3DService: Markup3DService;
  private _markup2DService: Markup2DService;

  private _hotkeyService: HotkeyService;

  constructor(
    private _supabase: SupabaseClient,
    private _authService: AuthService
  ) {
    this._globalStatesService = new GlobalStatesService(this);
    this._commentService = new CommentService(this);
    this._activeCommentService = new ActiveCommentService(this);
    this._viewerServiceAggr = new ViewerServiceAggr(this);

    this.projectUsers = new Map();

    this._markup3DService = new Markup3DService(this);
    this._markup2DService = new Markup2DService(this);

    this._hotkeyService = new HotkeyService(this);

    this._uuid = uuidv4();

    console.log("project Service created", this._uuid);
  }

  private async init() {
    const { query } = this._router;
    const { urn } = query;

    if (!urn) return;

    const bimId = this._getBim360ProjectId(urn as string);
    const supabase = this._supabase;

    let { data: projects, error: findError } = await supabase
      .from("projects")
      .select(
        `
        *,
        userprojects!inner(
          user_id
        )
      `
      )
      .eq("bim_id", bimId)
      .single();

    let { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*");

    /* if (findError) {
      console.error("Error finding project:", findError);
      return { project: null, error: findError };
    } */

    // If the project is found, return it

    if (projects) {
      return { project: projects, profiles: profileData, error: null };
    }

    // If the project was not found, create a new one
    const { data: newProject, error: createError } = await supabase
      .from("projects")
      .insert([
        {
          title: "No name",
          bim_id: bimId,
        },
      ])
      .select("*")
      .single();

    if (createError) {
      console.error("Error creating new project:", createError);
      return { project: null, error: createError };
    }

    // Return the newly created project
    return { project: newProject, error: null };
  }

  private _getBim360ProjectId(urn: string): string {
    const decoded = base64url.decode(urn as string);

    const parts = decoded.split(":");
    const lastPart = parts[parts.length - 1];

    // Extract the substring after 'vf.' and before '?'
    const startIndex = lastPart.indexOf("vf.") + 3; // Add 3 to skip 'vf.'
    const endIndex = lastPart.indexOf("?");
    const projectId = lastPart.substring(startIndex, endIndex);

    return projectId;
  }

  public async updateMetadata(metadata: Partial<Project>) {
    const { data, error } = await this._supabase
      .from("projects")
      .update(metadata)
      .eq("id", this.id);

    if (error) {
      console.error("Error updating project metadata:", error);
    } else {
      console.log("Project metadata updated:", data);
    }

    if (metadata.title) {
      this.title = metadata.title;
      this.$setTitle(this.title);
    }

    if (metadata.thumbnail) {
      this.thumbnail = metadata.thumbnail;
      this.$setThumbnail(this.thumbnail);
    }

    return { data, error };
  }

  public async uploadThumbnailFromBase64(
    base64: string,
    _fileName?: string
  ): Promise<string | null> {
    const blob = dataURLToBlob(base64);

    // Generate a unique file name for the thumbnail
    // Adjust the naming convention as necessary
    const __fileName = `${this.id}-${Date.now()}.png`;
    const fileName = _fileName || __fileName;

    const { data, error } = await this._supabase.storage
      .from("thumbs")
      .upload(fileName, blob, {
        cacheControl: "3600",
        upsert: true, // Set to true if you want to overwrite existing files with the same name
      });

    if (error) {
      console.error("Failed to upload thumbnail:", error.message);
    } else {
      console.log("Thumbnail uploaded successfully:", fileName);
    }

    const supabaseURL =
      "https://ixuszjrnviwgquuqfbmk.supabase.co/storage/v1/object/public/";

    if (data) {
      const thumbnailURL = `${supabaseURL}thumbs/${data!.path}`;
      return thumbnailURL;
    }

    return null;
  }

  public async provideStates(states: States) {
    if (this._wasInitialized) return;

    this._wasInitialized = true;

    this._router = states.router;
    this.$setIsReady = states.setIsReady;
    this.$setTitle = states.setTitle;
    this.$setThumbnail = states.setThumbnail;
    this.$setProjectUsers = states.setProjectUsers;

    const data = await this.init();

    if (data) {
      const { project, profiles } = data;

      if (project && profiles) {
        this.id = project.id;
        this.title = project.title;
        this.bimId = project.bim_id;
        this.createdAt = project.created_at;
        this.thumbnail = project.thumbnail;

        // Populate the projectUsers map
        this.projectUsers.clear();

        const profilesMap = new Map(
          profiles.map((profile: any) => [profile.user_id, profile])
        );

        project.userprojects.forEach((userproject: any) => {
          const profile = profilesMap.get(userproject.user_id);

          if (profile) {
            const projectUser: ProjectUser = {
              id: profile.user_id,
              username: profile.username,
            };

            this.projectUsers.set(profile.user_id, projectUser);
          }
        });

        this.$setProjectUsers(Array.from(this.projectUsers.values()));

        this.$setTitle(this.title);
        this.$setThumbnail(project.thumbnail);
        this.$setIsReady(true);

        this._commentService.init();
      }
    }
  }

  public get globalStatesService() {
    return this._globalStatesService;
  }

  public get commentService() {
    return this._commentService;
  }

  public get activeCommentService() {
    return this._activeCommentService;
  }

  public get hotkeyService() {
    return this._hotkeyService;
  }

  public get viewerServiceAggr() {
    return this._viewerServiceAggr;
  }

  public get markup3DService() {
    return this._markup3DService;
  }

  public get markup2DService() {
    return this._markup2DService;
  }

  public get supabase() {
    return this._supabase;
  }

  public get authService() {
    return this._authService;
  }

  public dispose() {
    this.projectUsers.clear();

    this._globalStatesService.dispose();
    this._commentService.dispose();
    this._activeCommentService.dispose();
    this._viewerServiceAggr.dispose();

    this._markup3DService.dispose();
    this._markup2DService.dispose();

    console.log("project Service disposed", this._uuid);

    this._hotkeyService.dispose();
  }
}

// Utility function to convert a data URL to a Blob
function dataURLToBlob(dataURL: string) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

export interface ProjectUser {
  id: string;
  username: string;
}

interface States {
  router: NextRouter;
  setIsReady: (value: boolean) => void;
  setTitle: (value: string) => void;
  setThumbnail: (value: string | null) => void;
  setProjectUsers: (value: ProjectUser[]) => void;
}

export default ProjectService;
