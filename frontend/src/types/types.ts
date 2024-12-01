export enum Status {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
  approvedWithChanges = "approved with changes",
  underReview = "under review",
}

export enum SubmissionType {
  research = "Research Paper",
  project = "Project",
}

export enum UserRole {
  ADMIN = "admin",
  REVIEWER = "reviewer",
  STUDENT = "student",
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: string;
  idToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface NavItem {
  title: string;
  path: string;
  icon: JSX.Element;
  roles: UserRole[];
}

export enum State {
  idle = "idle",
  loading = "loading",
  success = "success",
  failed = "failed",
}

export enum ConfirmationType {
  update = "update",
  send = "send",
  upload = "upload",
  accept = "accept",
}

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: string;
}
