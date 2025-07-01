export type EmailTriggerAction =
  | 'manuscript_submitted'
  | 'manuscript_resubmitted'
  | 'status_changed_review_compliance_report'
  | 'status_changed_submit_final_publication'
  | 'status_changed_addendum_required'
  | 'status_changed_compliant'
  | 'status_changed_closed_other'
  | 'discussion_created_by_os_member'
  | 'discussion_created_by_grantee'
  | 'os_member_replied_to_discussion'
  | 'grantee_replied_to_discussion';

export type TemplateAlias =
  | 'waiting-for-report-grantees'
  | 'waiting-for-report-os-team'
  | 'manuscript-re-submitted-grantees'
  | 'manuscript-resubmitted-os-team'
  | 'review-compliance-report'
  | 'submit-final-publication'
  | 'addendum-required'
  | 'compliant'
  | 'closed'
  | 'waiting-for-grantee-reply'
  | 'waiting-for-os-team-reply';

type EmailNotificationMapping = Record<
  EmailTriggerAction,
  Partial<Record<'open_science_team' | 'grantee', TemplateAlias>>
>;

export const emailNotificationMapping: EmailNotificationMapping = {
  manuscript_submitted: {
    grantee: 'waiting-for-report-grantees',
    open_science_team: 'waiting-for-report-os-team',
  },
  manuscript_resubmitted: {
    grantee: 'manuscript-re-submitted-grantees',
    open_science_team: 'manuscript-resubmitted-os-team',
  },

  status_changed_review_compliance_report: {
    grantee: 'review-compliance-report',
  },
  status_changed_submit_final_publication: {
    grantee: 'submit-final-publication',
  },
  status_changed_addendum_required: {
    grantee: 'addendum-required',
  },
  status_changed_compliant: {
    grantee: 'compliant',
  },
  status_changed_closed_other: {
    grantee: 'closed',
  },
  discussion_created_by_os_member: {
    grantee: 'waiting-for-grantee-reply',
  },
  discussion_created_by_grantee: {
    open_science_team: 'waiting-for-os-team-reply',
  },
  os_member_replied_to_discussion: {
    grantee: 'waiting-for-grantee-reply',
  },
  grantee_replied_to_discussion: {
    open_science_team: 'waiting-for-os-team-reply',
  },
};
