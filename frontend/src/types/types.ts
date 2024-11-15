export interface Feedback {
  reviewer: string;
  comment: string;
  date: string;
}

export interface Submission {
  id: string;
  title: string;
  type: "Research" | "Project";
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "approved with changes"
    | "under review";
  submittedOn: string;
  feedback?: {
    comments: Feedback[];
    document?: {
      name: string;
      url: string;
    };
  };
}

export enum Status {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  approvedWithChanges = "approved with changes",
  underReview = "under review",
}
