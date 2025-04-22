export type EmailTriggerAction =
  | 'manuscript_submitted'
  | 'manuscript_resubmitted'
  | 'status_changed_review_compliance_report'
  | 'status_changed_submit_final_publication'
  | 'status_changed_addendum_required'
  | 'status_changed_compliant'
  | 'status_changed_closed_other'
  | 'discussion_created'
  | 'os_member_replied_to_discussion';

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
  | 'waiting-for-grantee-reply';

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
  discussion_created: {
    open_science_team: 'waiting-for-grantee-reply',
    grantee: 'waiting-for-grantee-reply',
  },
  os_member_replied_to_discussion: {
    grantee: 'waiting-for-grantee-reply',
  },
};
