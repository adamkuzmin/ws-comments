import axios from "axios";
import React from "react";
import ViewerServiceAggr from "./viewer-service-aggr";
import ProjectService from "../services/project-services/project-service/project-service";

class Viewer extends React.Component {
  private _isViewerInitialized: boolean;

  private _projectService: ProjectService;
  private _viewer: any | null;
  private _viewerContainer: any;
  private _view: any;
  private _viewerService: ViewerServiceAggr | undefined;

  private _urns: string[];

  public props: Readonly<ViewerProps>;

  private $setViewer: any;
  private $setViewerService: any;
  private $setIsModelLoaded: any;

  /**
   * Constructs the Viewer component.
   * @param props - The properties passed to the Viewer component.
   */
  constructor(props: ViewerProps) {
    super(props);

    this.props = props;
    this._projectService = props.projectService;

    this._isViewerInitialized = false;

    this._urns = [];

    this.$setViewer = props.setViewer;
    this.$setIsModelLoaded = props.setIsModelLoaded;
    this.$setViewerService = props.setViewerService;
  }

  /**
   * Component lifecycle method called after the component has mounted.
   * This is where we initialize the viewer.
   */
  public componentDidMount() {}

  public componentDidUpdate(prevProps: ViewerProps) {
    if (this.props.urns !== prevProps.urns) {
      if (!this.props.urns) return;

      this.updateUrns(this.props.urns);
    }
  }

  /**
   * Component lifecycle method called just before the component unmounts.
   * This is where we clean up the viewer to prevent memory leaks.
   */
  public componentWillUnmount() {
    if (this._viewer) {
      const Autodesk = (window as any).Autodesk;

      this._viewer.removeEventListener(
        Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
        this.handleSelectionChanged
      );

      this._viewer.finish();
      this._viewer = null;
    }
  }

  /**
   * Launches init
   */
  public updateUrns(urns: string[]) {
    this._urns = urns;

    if (!this._isViewerInitialized) {
      this.initializeViewer();
    }
  }

  /**
   * Initializes the Forge Viewer.
   * This includes setting up the environment, fetching the Forge token, and loading the viewer.
   */
  private initializeViewer = async (): Promise<void> => {
    this._isViewerInitialized = true;

    const Autodesk = (window as any).Autodesk;
    const forgeToken = await this._getForgeToken();
    if (!forgeToken) return;

    const options = {
      env: "AutodeskProduction2",
      api: "streamingV2",
    };

    Autodesk.Viewing.Initializer(
      {
        ...options,
        getAccessToken: (
          onTokenReady: (token: string, expires: number) => void
        ) => {
          onTokenReady(forgeToken.access_token, forgeToken.expires_in);
        },
      },
      async () => {
        const options3d = {
          viewerConfig: {
            disableBimWalkInfoIcon: true,
          },
          extensions: ["Autodesk.Viewing.MarkupsCore"],
        };

        const view = new Autodesk.Viewing.AggregatedView();
        const viewerDiv = this._viewerContainer;
        view.init(viewerDiv, options3d);

        this._viewer = view.viewer;
        this._view = view;

        this._viewer.addEventListener(
          Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          this.handleSelectionChanged
        );

        this.$setViewer(this._viewer);

        // viewer service
        const viewerService = this._projectService.viewerServiceAggr;
        viewerService.provideViewer(this._viewer, this._view);

        this.$setViewerService(viewerService);
        this._viewerService = viewerService;

        this.loadModels();
      }
    );
  };

  /**
   * Loads one or multiple models into the viewer based on the route.
   * If multiple models are to be loaded, it applies a theming color to all models after loading.
   */
  public async loadModels(): Promise<void> {
    const urns = this._urns;
    const viewerService = this._viewerService;

    await viewerService!.loadDocuments(urns);

    // Once loading is completed
    this.$setIsModelLoaded(true);
  }

  /**
   * Fetches the Forge access token required to use the Forge Viewer.
   * @returns A promise that resolves to the ForgeTokenResponse or null if an error occurred.
   */
  private async _getForgeToken(): Promise<ForgeTokenResponse | null> {
    try {
      const response = await axios.get<ForgeTokenResponse>("/api/token");
      return response.data;
    } catch (error) {
      console.error("Error fetching Forge token:", error);
      return null;
    }
  }

  public get setIsModelLoaded() {
    return this.$setIsModelLoaded;
  }

  private handleSelectionChanged = () => {
    this._viewer.clearSelection();
  };

  render() {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
          id="comments_layer"
        ></svg>

        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
          id="markup_3d_layer"
        ></svg>

        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
          id="markup_2d_layer"
        ></svg>

        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: "none",
          }}
          id="comment_2d_layer"
        ></div>

        <div
          ref={(div) => (this._viewerContainer = div)}
          style={{
            backgroundColor: "lightgray",
            width: "100%",
            height: "100%",
          }}
          className="forge-viewer"
        ></div>
      </div>
    );
  }
}

interface ForgeTokenResponse {
  access_token: string;
  expires_in: number;
}

interface ViewerProps {
  projectService: ProjectService;
  urns: null | string[];
  setViewer: (viewer: any) => void;
  setViewerService: (viewerService: ViewerServiceAggr) => void;
  setIsModelLoaded: (isModelLoaded: boolean) => void;
}

export default Viewer;
