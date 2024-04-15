import ProjectService from "../services/project-services/project-service/project-service";
import Viewer from "./viewer-aggr";

class ViewerServiceAggr {
  private _viewer: any;
  private _view: any;

  constructor(private _projectService: ProjectService) {
    this._viewer = null;
    this._view = null;
  }

  /**
   * Adjusts the scene's visual settings in the Forge Viewer.
   */
  public configureSceneAppearance(): void {
    this._viewer.setBackgroundColor(241, 240, 238, 241, 240, 238);
    this._viewer.setEnvMapBackground(false);

    this._viewer.setQualityLevel(false, false);

    this._viewer.setGroundShadow(false);
    this._viewer.setGroundReflection(false);
    this._viewer.setProgressiveRendering(true);
    this._viewer.setGhosting(false);

    try {
      (window as any).NOP_VIEWER.impl.controls.handleKeyUp = function (e: any) {
        e.preventDefault();
      };
    } catch (e) {
      console.error(e);
    }
  }

  public loadDocuments(urns: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let index = 1;

      let callbackAmount = 0;

      let bubbles = [];
      for (const urn of urns) {
        const bubble = await this.loadAggregatedDocument(urn);
        bubbles.push(bubble);

        index++;
      }

      this._view.setNodes(bubbles);

      const Autodesk = (window as any).Autodesk;

      // Wait for OBJECT_TREE_CREATED_EVENT
      const objectTreeCreatedHandler = (e: any) => {
        this.configureSceneAppearance();

        if (callbackAmount === urns.length - 1) {
          resolve();

          this._viewer.fitToView();

          this._viewer.removeEventListener(
            Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            objectTreeCreatedHandler
          );
        }

        callbackAmount++;
      };

      // Add the OBJECT_TREE_CREATED_EVENT listener
      this._viewer.addEventListener(
        Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
        objectTreeCreatedHandler
      );
    });
  }

  public loadAggregatedDocument(urn: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const Autodesk = (window as any).Autodesk;

      Autodesk.Viewing.Document.load(`urn:${urn}`, async (doc: any) => {
        const viewables = doc.getRoot().getDefaultGeometry();
        await doc.downloadAecModelData();

        const bubbles = doc.getRoot().search({ type: "geometry", role: "3d" });
        const bubble = bubbles[0];
        if (!bubble) return null;

        resolve(bubble);
      });
    });
  }

  public get viewer() {
    return this._viewer;
  }

  public get view() {
    return this._view;
  }

  public provideViewer(viewer: any, view: any) {
    this._viewer = viewer;
    this._view = view;

    this._projectService.markup3DService.provideViewer(viewer);
  }

  public dispose() {
    if (this._viewer) {
      const Autodesk = (window as any).Autodesk;

      this._viewer.finish();
      this._viewer = null;
    }
  }
}

export default ViewerServiceAggr;
