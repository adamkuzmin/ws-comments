import CommentService, { Comment } from "../comment-service/comment-service";
import ProjectService from "../project-service/project-service";

class GlobalStatesService {
  private _isSettingsPanelOpen: boolean = false;
  private _isCommentsPanelOpen: boolean = false;

  private _commentAdding: boolean = false;
  private _commentAwaitingSelection: boolean = false;
  private _commentPointSelected: boolean = false;

  private $setIsSettingsPanelOpen: any;
  private $setIsCommentsPanelOpen: any;
  private $setCommentAdding: any;
  private $setCommentAwaitingSelection: any;
  private $setCommentPointSelected: any;

  constructor(private _projectService: ProjectService) {}

  public toggleSettingsPanel(v?: boolean) {
    this._isSettingsPanelOpen =
      v !== undefined ? v : !this._isSettingsPanelOpen;

    this.$setIsSettingsPanelOpen(this._isSettingsPanelOpen);
  }

  public toggleCommentsPanel(v?: boolean) {
    this._isCommentsPanelOpen =
      v !== undefined ? v : !this._isCommentsPanelOpen;

    this.$setIsCommentsPanelOpen(this._isCommentsPanelOpen);
  }

  public toggleCommentAdding(v?: boolean) {
    this._commentAdding = v !== undefined ? v : !this._commentAdding;

    if (!this._commentAdding) {
      this.toggleCommentAwaitingSelection(false);
      this.toggleCommentPointSelected(false);
    }

    this.$setCommentAdding(v);
  }

  public toggleCommentAwaitingSelection(v?: boolean) {
    this._commentAwaitingSelection =
      v !== undefined ? v : !this._commentAwaitingSelection;

    this.$setCommentAwaitingSelection(v);
  }

  public toggleCommentPointSelected(v?: boolean) {
    this._commentPointSelected =
      v !== undefined ? v : !this._commentPointSelected;

    this.$setCommentPointSelected(v);
  }

  public provideStates(states: States) {
    this.$setIsSettingsPanelOpen = states.setIsSettingsPanelOpen;
    this.$setIsCommentsPanelOpen = states.setIsCommentsPanelOpen;

    this.$setCommentAdding = states.setCommentAdding;
    this.$setCommentAwaitingSelection = states.setCommentAwaitingSelection;
    this.$setCommentPointSelected = states.setCommentPointSelected;
  }

  public setInitalValues() {
    this.$setIsSettingsPanelOpen(this._isSettingsPanelOpen);
    this.$setIsCommentsPanelOpen(this._isCommentsPanelOpen);

    this.$setCommentAdding(this._commentAdding);
    this.$setCommentAwaitingSelection(this._commentAwaitingSelection);
    this.$setCommentPointSelected(this._commentPointSelected);
  }

  public dispose() {}
}

interface States {
  setIsSettingsPanelOpen: any;
  setIsCommentsPanelOpen: any;
  setCommentAdding: any;
  setCommentAwaitingSelection: any;
  setCommentPointSelected: any;
}

export default GlobalStatesService;
