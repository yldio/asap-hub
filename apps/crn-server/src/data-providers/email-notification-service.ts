import {
  FetchDiscussionParticipantsQuery,
  FetchDiscussionParticipantsQueryVariables,
  FetchDiscussionTitleQuery,
  FetchDiscussionTitleQueryVariables,
  FetchManuscriptNotificationDetailsQuery,
  FetchManuscriptNotificationDetailsQueryVariables,
  FETCH_DISCUSSION_TITLE,
  FETCH_DISCUSSION_PARTICIPANTS,
  FETCH_MANUSCRIPT_NOTIFICATION_DETAILS,
  GraphQLClient,
} from '@asap-hub/contentful';
import {
  emailHeaderImageUrl,
  emailHeaderLinkUrl,
  emailNotificationMapping,
  EmailTriggerAction,
  ProjectType,
} from '@asap-hub/model';
import { cleanArray } from '@asap-hub/server-common';
import * as postmark from 'postmark';
import {
  alternativeAssignedOSEmail,
  environment as environmentName,
  openScienceDL,
  origin,
  postmarkServerToken,
} from '../config';
import logger from '../utils/logger';
import {
  getManuscriptComplianceRedirectUrl,
  projectTypeUrlSegment,
} from '../utils/manuscript-workspace-url';
import { getCommaAndString } from '../utils/text';
import { getManuscriptVersionUID } from './contentful/manuscript.data-provider';

type TemplateModel = {
  headerImage: string;
  headerLink: string;
  manuscript: {
    title: string;
    type: string;
    id: string;
    link: string;
  };
  team: {
    name: string;
    workspace: string;
  };
  project: {
    name: string;
    workspace: string;
  };
  assignedOSMembers: string;
  discussion?: {
    title: string;
    submitterName: string;
    link: string;
  };
  useProjectBasedEmail: boolean;
};

type DiscussionNotificationInfo = {
  id: string;
  userName: string;
};

type NotificationDataBuilder = (
  recipientType: 'open_science_team' | 'grantee',
) => TemplateModel;

type ManuscriptDetails = NonNullable<
  FetchManuscriptNotificationDetailsQuery['manuscripts']
>;
type VersionData = NonNullable<
  ManuscriptDetails['versionsCollection']
>['items'][number];
type ContributingTeam = NonNullable<
  NonNullable<VersionData>['teamsCollection']
>['items'][number];
type SubmittingTeam = NonNullable<
  ManuscriptDetails['teamsCollection']
>['items'][number];

export class EmailNotificationService {
  private readonly postmarkClient: postmark.ServerClient;

  constructor(private readonly contentfulClient: GraphQLClient) {
    this.postmarkClient = new postmark.ServerClient(postmarkServerToken);
  }

  private async sendEmail(
    recipients: string[],
    templateAlias: string,
    templateModel: TemplateModel,
  ): Promise<void> {
    const response = await this.postmarkClient.sendEmailWithTemplate({
      From: 'hub@asap.science',
      To: recipients.join(','),
      MessageStream: 'outbound',
      TemplateAlias: templateAlias,
      TemplateModel: templateModel,
    });
    if (response.ErrorCode !== 0)
      logger.error(
        `Error while sending compliance email notification: ${response.Message}`,
      );
  }

  private filterForNonProduction(
    recipients: string[],
    emailList: string,
    isProduction: boolean,
  ): string[] {
    return isProduction
      ? recipients
      : recipients.filter((email) => email && emailList.includes(email));
  }

  private getActiveContributingTeams(
    versionData: VersionData,
  ): ContributingTeam[] {
    return cleanArray(versionData?.teamsCollection?.items).filter(
      (team) => !team.inactiveSince,
    );
  }

  private resolveProject(
    manuscripts: ManuscriptDetails,
    submittingTeam: SubmittingTeam | undefined,
  ): { name: string; workspace: string; projectId: string; grantId: string } {
    const project =
      manuscripts.project ??
      submittingTeam?.linkedFrom?.projectMembershipCollection?.items[0]
        ?.linkedFrom?.projectsCollection?.items[0];

    return {
      name: project?.title || '',
      workspace: project?.projectType
        ? `${origin}/projects/${
            projectTypeUrlSegment[project.projectType as ProjectType]
          }/${project.sys.id}/workspace`
        : '',
      projectId: project?.projectId || '',
      grantId: project?.grantId || '',
    };
  }

  private getAssignedOSMembers(manuscripts: ManuscriptDetails): {
    names: string[];
    emails: string[];
  } {
    const assignedUsers = cleanArray(
      manuscripts.assignedUsersCollection?.items,
    );
    const names = assignedUsers
      .map((user) => `${user.firstName || ''} ${user.lastName || ''}`.trim())
      .filter(Boolean);
    const emails = cleanArray(assignedUsers.map((user) => user.email)).filter(
      Boolean,
    );

    return {
      names,
      emails: emails.length ? emails : [alternativeAssignedOSEmail],
    };
  }

  private async getDiscussionTitle(discussionId?: string): Promise<string> {
    if (!discussionId) return '';

    const { discussions } = await this.contentfulClient.request<
      FetchDiscussionTitleQuery,
      FetchDiscussionTitleQueryVariables
    >(FETCH_DISCUSSION_TITLE, { id: discussionId });

    return discussions?.title || '';
  }

  private createNotificationDataBuilder(context: {
    manuscriptData: TemplateModel['manuscript'];
    submittingTeamName: string;
    contributingTeamNames: string[];
    teamWorkspaceUrl: string;
    projectName: string;
    projectWorkspaceUrl: string;
    assignedOSMembers: string[];
    discussionTitle: string;
    discussionDetails?: DiscussionNotificationInfo;
    discussionLink: string;
    useProjectBasedEmail: boolean;
  }): NotificationDataBuilder {
    return (recipientType) => ({
      headerImage: emailHeaderImageUrl,
      headerLink: emailHeaderLinkUrl,
      manuscript: context.manuscriptData,
      team: {
        name:
          recipientType === 'open_science_team'
            ? context.submittingTeamName
            : getCommaAndString(context.contributingTeamNames),
        workspace: context.teamWorkspaceUrl,
      },
      project: {
        name: context.projectName,
        workspace: context.projectWorkspaceUrl,
      },
      assignedOSMembers: getCommaAndString(context.assignedOSMembers),
      discussion: {
        title: context.discussionTitle,
        submitterName: context.discussionDetails?.userName || '',
        link: context.discussionLink,
      },
      useProjectBasedEmail: context.useProjectBasedEmail,
    });
  }

  private async resolveDiscussionReplyRecipients(
    discussionId: string,
    isOSMemberReplyAction: boolean,
    assignedOSMembersEmails: string[],
    emailList: string,
    isProduction: boolean,
  ): Promise<string[]> {
    const messagesFilter = {
      createdBy: {
        alumniSinceDate: null,
        ...(isOSMemberReplyAction
          ? { openScienceTeamMember_not: true }
          : { openScienceTeamMember: true }),
      },
    };

    const { discussions } = await this.contentfulClient.request<
      FetchDiscussionParticipantsQuery,
      FetchDiscussionParticipantsQueryVariables
    >(FETCH_DISCUSSION_PARTICIPANTS, {
      id: discussionId,
      messagesFilter,
    });

    const recipients = Array.from(
      new Set(
        cleanArray([
          discussions?.message?.createdBy?.email,
          ...cleanArray(discussions?.repliesCollection?.items).map(
            (reply) => reply.createdBy?.email,
          ),
        ]).filter(Boolean),
      ),
    );

    const allowedRecipients = [...recipients];
    if (!isOSMemberReplyAction) {
      allowedRecipients.push(openScienceDL);
      assignedOSMembersEmails.forEach(
        (assigneeEmail) =>
          assigneeEmail &&
          !allowedRecipients.includes(assigneeEmail) &&
          allowedRecipients.push(assigneeEmail),
      );
    }

    return this.filterForNonProduction(
      allowedRecipients,
      emailList,
      isProduction,
    );
  }

  private resolveGranteeRecipients(
    versionData: VersionData,
    activeContributingTeams: ContributingTeam[],
  ): string[] {
    const contributingAuthors = [
      ...cleanArray(versionData?.firstAuthorsCollection?.items).map(
        (firstAuthor) => firstAuthor.email,
      ),
      ...cleanArray(versionData?.additionalAuthorsCollection?.items).map(
        (additionalAuthor) => additionalAuthor.email,
      ),
      ...cleanArray(versionData?.correspondingAuthorCollection?.items).map(
        (correspondingAuthor) => correspondingAuthor.email,
      ),
    ];

    const teamLeaders = activeContributingTeams.map((team) => {
      const activeMemberships = cleanArray(
        team?.linkedFrom?.teamMembershipCollection?.items,
      )
        .filter(
          (membership) =>
            !membership?.inactiveSinceDate &&
            membership?.linkedFrom?.usersCollection?.items[0] &&
            !membership?.linkedFrom?.usersCollection?.items[0]?.alumniSinceDate,
        )
        .map((membership) => ({
          email: membership?.linkedFrom?.usersCollection?.items[0]?.email,
          role: membership?.role,
        }));

      return activeMemberships
        ?.filter(
          (member) =>
            member.role === 'Project Manager' ||
            member.role === 'Lead PI (Core Leadership)',
        )
        .map((member) => member.email);
    });

    const labPIs = cleanArray(versionData?.labsCollection?.items)
      .filter((lab) => lab.labPi && !lab.labPi?.alumniSinceDate)
      .map((lab) => lab.labPi?.email);

    return cleanArray([
      ...new Set([...contributingAuthors, ...teamLeaders.flat(), ...labPIs]),
    ]).filter(Boolean);
  }

  private resolveOpenScienceRecipients(
    action: EmailTriggerAction,
    assignedOSMembersEmails: string[],
    isProduction: boolean,
    emailList: string,
  ): string[] {
    return isProduction
      ? [
          openScienceDL,
          ...(action === 'discussion_created_by_grantee'
            ? assignedOSMembersEmails
            : []),
        ]
      : emailList
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
  }

  async sendEmailNotification(
    action: EmailTriggerAction,
    manuscriptId: string,
    emailList: string,
    discussionDetails?: DiscussionNotificationInfo,
    useProjectBasedEmail = false,
  ): Promise<void> {
    const { manuscripts } = await this.contentfulClient.request<
      FetchManuscriptNotificationDetailsQuery,
      FetchManuscriptNotificationDetailsQueryVariables
    >(FETCH_MANUSCRIPT_NOTIFICATION_DETAILS, { id: manuscriptId });

    const versionData = manuscripts?.versionsCollection?.items[0];

    if (!manuscripts || !versionData) {
      return;
    }

    const isProduction = environmentName === 'production';
    const isDiscussionCreatedAction = [
      'discussion_created_by_os_member',
      'discussion_created_by_grantee',
    ].includes(action);

    const submittingTeam = manuscripts.teamsCollection?.items[0];
    const activeContributingTeams =
      this.getActiveContributingTeams(versionData);
    const contributingTeamNames = activeContributingTeams
      .map((team) => team?.displayName || '')
      .filter(Boolean);
    const teamWorkspaceUrl = submittingTeam
      ? `${origin}/network/teams/${submittingTeam.sys.id}/workspace`
      : '';

    const project = this.resolveProject(manuscripts, submittingTeam);

    const { names: assignedOSMembers, emails: assignedOSMembersEmails } =
      this.getAssignedOSMembers(manuscripts);

    const discussionTitle = await this.getDiscussionTitle(
      discussionDetails?.id,
    );
    const discussionLink = getManuscriptComplianceRedirectUrl(
      manuscriptId,
      origin,
      { tab: 'discussions' },
    );

    const manuscriptData = {
      title: manuscripts.title || '',
      type: versionData.type || '',
      id: getManuscriptVersionUID({
        version: {
          type: versionData.type,
          count: versionData.count,
          lifecycle: versionData.lifecycle,
        },
        teamIdCode: project.projectId,
        grantId: project.grantId,
        manuscriptCount: manuscripts.count || 0,
      }),
      link: getManuscriptComplianceRedirectUrl(manuscriptId, origin),
    };

    const buildNotificationData = this.createNotificationDataBuilder({
      manuscriptData,
      submittingTeamName: submittingTeam?.displayName || '',
      contributingTeamNames,
      teamWorkspaceUrl,
      projectName: project.name,
      projectWorkspaceUrl: project.workspace,
      assignedOSMembers,
      discussionTitle,
      discussionDetails,
      discussionLink,
      useProjectBasedEmail,
    });

    const templateDetails = emailNotificationMapping[action];

    if (discussionDetails?.id && !isDiscussionCreatedAction) {
      const isOSMemberReplyAction =
        action === 'os_member_replied_to_discussion';
      const allowedRecipients = await this.resolveDiscussionReplyRecipients(
        discussionDetails.id,
        isOSMemberReplyAction,
        assignedOSMembersEmails,
        emailList,
        isProduction,
      );

      if (allowedRecipients.length >= 1) {
        if (!isOSMemberReplyAction && templateDetails.open_science_team)
          await this.sendEmail(
            allowedRecipients,
            templateDetails.open_science_team,
            buildNotificationData('open_science_team'),
          );
        if (isOSMemberReplyAction && templateDetails.grantee)
          await this.sendEmail(
            allowedRecipients,
            templateDetails.grantee,
            buildNotificationData('grantee'),
          );
      }
      return;
    }

    const granteeRecipients = this.filterForNonProduction(
      this.resolveGranteeRecipients(versionData, activeContributingTeams),
      emailList,
      isProduction,
    );

    const openScienceRecipients = this.resolveOpenScienceRecipients(
      action,
      assignedOSMembersEmails,
      isProduction,
      emailList,
    );

    if (templateDetails.grantee && granteeRecipients.length >= 1) {
      await this.sendEmail(
        granteeRecipients,
        templateDetails.grantee,
        buildNotificationData('grantee'),
      );
    }

    if (
      templateDetails.open_science_team &&
      openScienceRecipients.length >= 1
    ) {
      await this.sendEmail(
        openScienceRecipients,
        templateDetails.open_science_team,
        buildNotificationData('open_science_team'),
      );
    }
  }
}
