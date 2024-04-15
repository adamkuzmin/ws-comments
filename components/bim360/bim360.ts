import { CLIENT_ID, CLIENT_SECRET, BIM_ACCOUNT_ID } from "@/pages/api/token";
import ForgeSDK from "forge-apis";

let internalAuthClient = new ForgeSDK.AuthClientTwoLegged(
  CLIENT_ID,
  CLIENT_SECRET,
  ["data:read", "bucket:read", "bucket:create", "data:write", "data:create"],
  true
);

class Bim360Service {
  // Get internal token
  static readonly getInternalToken = async () => {
    if (!internalAuthClient.isAuthorized()) {
      await internalAuthClient.authenticate();
    }
    return internalAuthClient.getCredentials();
  };

  // List BIM 360 Hub projects
  static readonly getHubProjects = async (accountId: string) => {
    const projectsApi = new ForgeSDK.ProjectsApi();
    const credentials = await this.getInternalToken();

    try {
      const projects = await projectsApi.getHubProjects(
        accountId,
        {},
        internalAuthClient,
        credentials
      );
      return projects.body.data;
    } catch (error) {
      console.error("Error listing BIM 360 projects", error);
      throw error;
    }
  };

  // List BIM 360 top folders
  static readonly getTopFolders = async (project_id: string) => {
    const projectsApi = new ForgeSDK.ProjectsApi();
    const credentials = await this.getInternalToken();

    try {
      const topFolders = await projectsApi.getProjectTopFolders(
        BIM_ACCOUNT_ID,
        project_id,
        internalAuthClient,
        credentials
      );
      return topFolders.body.data;
    } catch (error) {
      console.error("Error listing BIM 360 top folders", error);
      throw error;
    }
  };

  // List BIM 360 folders
  static readonly listFolderContent = async (
    project_id: string,
    folder_id: string
  ) => {
    const fodlersApi = new ForgeSDK.FoldersApi();
    const credentials = await this.getInternalToken();

    const items = [];

    const folderContents = await fodlersApi.getFolderContents(
      project_id,
      folder_id,
      {},
      internalAuthClient,
      credentials
    );

    for (const item of folderContents.body.data) {
      items.push(item);
    }

    return items;
  };

  static readonly getThumbnail = async (urn: string) => {
    const credentials = await this.getInternalToken();
    const derivativesApi = new ForgeSDK.DerivativesApi();

    try {
      const thumbnail = await derivativesApi.getThumbnail(
        urn,
        {
          width: 100, // Specify desired width
          height: 100, // Specify desired height
        },
        internalAuthClient,
        credentials
      );

      // If successful, 'thumbnail' contains the image data
      return thumbnail.body;
    } catch (error) {
      console.error("Error fetching thumbnail", error);
      throw error;
    }
  };

  // List BIM 360 Model versions
  static readonly getModelVersions = async (href: string) => {
    const credentials = await this.getInternalToken();

    const response = await fetch(href, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + credentials.access_token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching item versions: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  };
}

export default Bim360Service;
