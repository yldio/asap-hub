export type ProjectType =
  | 'Discovery Project'
  | 'Resource Project'
  | 'Trainee Project';

export type MemberRole =
  | 'Contributor'
  | 'Investigator'
  | 'Project CoLead'
  | 'Project Lead'
  | 'Project Manager'
  | 'Trainee'
  | 'Trainer';

export interface ValidationError {
  memberId: string;
  memberTitle?: string;
  currentRole: string;
  allowedRoles: MemberRole[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  projectType: ProjectType | null;
  memberCount: number;
}
