import { MemberRole, ProjectType, ValidationError } from './types';

export const ROLE_RULES: Record<ProjectType, MemberRole[]> = {
  'Discovery Project': [
    'Contributor',
    'Investigator',
    'Project CoLead',
    'Project Lead',
    'Project Manager',
  ],
  'Resource Project': [
    'Contributor',
    'Investigator',
    'Project CoLead',
    'Project Lead',
    'Project Manager',
  ],
  'Trainee Project': ['Trainee', 'Trainer'],
};

export function getAllowedRoles(projectType: ProjectType): MemberRole[] {
  return ROLE_RULES[projectType] || [];
}

export function isRoleValid(role: string, projectType: ProjectType): boolean {
  const allowedRoles = getAllowedRoles(projectType);
  return allowedRoles.includes(role as MemberRole);
}

export function validateMemberRole(
  memberId: string,
  memberTitle: string | undefined,
  role: string,
  projectType: ProjectType,
): ValidationError | null {
  if (isRoleValid(role, projectType)) {
    return null;
  }

  return {
    memberId,
    memberTitle,
    currentRole: role,
    allowedRoles: getAllowedRoles(projectType),
  };
}
