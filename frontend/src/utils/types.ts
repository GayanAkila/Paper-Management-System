export enum UserRole {
  student = "student",
  reviewer = "reviewer",
  admin = "admin",
}

export interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}
