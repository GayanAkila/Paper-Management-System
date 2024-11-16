export enum Status {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  approvedWithChanges = "approved with changes",
  underReview = "under review",
}

export interface Author {
  name: string;
  email: string;
}

export interface Comment {
  reviewer: string;
  comment: string;
  date: string;
  document: string;
}

export interface Feedback {
  comments: Comment[];
  finalDecision: string;
}

export interface Submission {
  id: string;
  title: string;
  authors: Author[];
  type: string;
  status: string;
  submittedOn: string;
  document: string;
  feedback?: Feedback;
  studentEmail: string;
  reviewerEmail: string[];
}

export enum SubmissionType {
  research = "research",
  project = "project",
}
