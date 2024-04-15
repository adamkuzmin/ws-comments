import ProjectService from "@/components/services/project-services/project-service/project-service";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

class CommentService {
  private _comments: Map<string | number, Comment>;

  private _changes: any;

  private $setComments: any;
  private $setCommentLogId: any;

  private _eventSubscribers = new Map<string, EventCallback[]>();

  private _supabase: SupabaseClient;

  constructor(private _projectService: ProjectService) {
    this._supabase = _projectService.supabase;
    this._comments = new Map();
  }

  private async _fetchInitialComments() {
    const project_id = this._projectService!.id as string;

    const projectUsers = this._projectService.projectUsers;

    const { data, error } = await this._supabase
      .from("comments") // Adjust if your table name is different
      .select(`*`)
      .eq("project_id", project_id)
      .not("author_id", "is", null) // Exclude comments where author_id is null
      .order("created_at", { ascending: true }); // Assuming you have a 'createdAt' column for sorting

    if (error) {
      console.error("Error fetching comments:", error);
    }

    this._comments = new Map(
      data?.map((comment) => [
        comment.id,
        {
          ...comment,
          author_username:
            projectUsers.get(comment.author_id)?.username || "Unknown",
        },
      ])
    );

    this._upateComments();
  }

  private _checkRelationToProject(entry: any): boolean {
    if (entry && Object.keys(entry).length) {
      if (entry.project_id === this._projectService?.id) return true;
    }

    return false;
  }

  // realtime changes will be handled here
  private _handleRealtimeChanges() {
    const projectUsers = this._projectService.projectUsers;

    const changes = this._supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
        },
        (payload) => {
          const { old, new: newComment, eventType } = payload;

          let needsUpdate = false;

          if (eventType === "INSERT") {
            this._checkRelationToProject(newComment);

            this._comments.set(newComment.id, {
              ...newComment,
              author_username:
                projectUsers.get(newComment.author_id)?.username || "Unknown",
            } as Comment);
            needsUpdate = true;
          } else if (eventType === "UPDATE") {
            this._checkRelationToProject(newComment);

            this._comments.set(newComment.id, {
              ...newComment,
              author_username:
                projectUsers.get(newComment.author_id)?.username || "Unknown",
            } as Comment);
            needsUpdate = true;
          } else if (eventType === "DELETE") {
            this._checkRelationToProject(old);

            this._comments.delete(old.id);
            needsUpdate = true;
          }

          if (needsUpdate)
            console.log("%ceventType", "color: green", eventType);

          if (needsUpdate) this._upateComments();
        }
      )
      .subscribe();

    this._changes = changes;
  }

  private _upateComments() {
    const sortedComments = Array.from(this._comments.values()).sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    this._emit("COMMENTS_UPDATED", this._comments);
    this._projectService.markup3DService.updateMarkups();
    this._projectService.markup2DService.updateMarkups();

    this.$setComments(sortedComments);
    this.$setCommentLogId(uuidv4());
  }

  public async init() {
    await this._fetchInitialComments();
    await this._handleRealtimeChanges();
  }

  public provideStates(states: {
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    setCommentLogId: React.Dispatch<React.SetStateAction<string>>;
  }) {
    this.$setComments = states.setComments;
    this.$setCommentLogId = states.setCommentLogId;
  }

  // Subscribe to an event
  public on(event: string, callback: EventCallback) {
    const subscribers = this._eventSubscribers.get(event) || [];
    subscribers.push(callback);
    this._eventSubscribers.set(event, subscribers);
  }

  // Unsubscribe from an event
  public off(event: string, callback: EventCallback) {
    const subscribers = this._eventSubscribers.get(event) || [];
    const subscriberIndex = subscribers.indexOf(callback);
    if (subscriberIndex > -1) {
      subscribers.splice(subscriberIndex, 1);
      this._eventSubscribers.set(event, subscribers);
    }
  }

  // Emit an event
  private _emit(event: string, ...args: any[]) {
    const subscribers = this._eventSubscribers.get(event) || [];
    subscribers.forEach((callback) => {
      callback(...args);
    });
  }

  public get comments() {
    return this._comments;
  }

  public dispose() {
    if (this._changes) {
      this._supabase.removeChannel(this._changes);
    }

    this.$setComments = () => {};
    this._comments.clear();
  }
}

type EventCallback = (...args: any[]) => void;

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  markup_position: { x: number; y: number; z: number } | null;
  markup_position_2d: { x: number; y: number } | null;
  view_state: any | null;
  parent_id: string | null;
  annotation: any[] | null;
  author_id: string;
  author_username: string;
}

export default CommentService;
