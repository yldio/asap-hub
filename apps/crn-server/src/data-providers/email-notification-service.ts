import {
  FetchDiscussionGranteeParticipantsQuery,
  FetchDiscussionGranteeParticipantsQueryVariables,
  FetchDiscussionTitleQuery,
  FetchDiscussionTitleQueryVariables,
  FetchManuscriptNotificationDetailsQuery,
  FetchManuscriptNotificationDetailsQueryVariables,
  FETCH_DISCUSSION_TITLE,
  FETCH_DISCUSSION_GRANTEE_PARTICIPANTS,
  FETCH_MANUSCRIPT_NOTIFICATION_DETAILS,
  GraphQLClient,
} from '@asap-hub/contentful';
import {
  emailNotificationMapping,
  EmailTriggerAction,
  manuscriptNotificationAttachmentContent,
} from '@asap-hub/model';
import * as postmark from 'postmark';
import {
  environment as environmentName,
  origin,
  postmarkServerToken,
} from '../config';
import { cleanArray } from '../utils/clean-array';
import logger from '../utils/logger';
import { getCommaAndString } from '../utils/text';
import { getManuscriptVersionUID } from './contentful/manuscript.data-provider';

type TemplateModel = {
  manuscript: {
    title: string;
    type: string;
    id: string;
  };
  team: {
    name: string;
    workspace: string;
  };
  assignedOSMembers: string;
  discussion?: {
    title: string;
  };
};

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
      Attachments: [
        {
          Name: 'asaplogo.jpg',
          ContentType: 'image/jpeg',
          ContentID: 'cid:asaplogo',
          Content: manuscriptNotificationAttachmentContent,
        },
      ],
    });
    if (response.ErrorCode !== 0)
      logger.error(
        `Error while sending compliance email notification: ${response.Message}`,
      );
  }

  async sendEmailNotification(
    action: EmailTriggerAction,
    manuscriptId: string,
    emailList: string,
    discussionId?: string,
  ): Promise<void> {
    const isProduction = environmentName === 'production';

    const { manuscripts } = await this.contentfulClient.request<
      FetchManuscriptNotificationDetailsQuery,
      FetchManuscriptNotificationDetailsQueryVariables
    >(FETCH_MANUSCRIPT_NOTIFICATION_DETAILS, { id: manuscriptId });

    const versionData = manuscripts?.versionsCollection?.items[0];

    if (!manuscripts || !versionData) {
      return;
    }

    const submittingTeam = manuscripts.teamsCollection?.items[0];
    const activeContributingTeams = cleanArray(
      versionData.teamsCollection?.items,
    ).filter((team) => !team.inactiveSince);

    const contributingTeamNames = activeContributingTeams
      .map((team) => team?.displayName || '')
      .filter(Boolean);

    const manuscriptData = {
      title: manuscripts.title || '',
      type: versionData.type || '',
      id: getManuscriptVersionUID({
        version: {
          type: versionData.type,
          count: versionData.count,
          lifecycle: versionData.lifecycle,
        },
        teamIdCode: submittingTeam?.teamId || '',
        grantId: submittingTeam?.grantId || '',
        manuscriptCount: manuscripts.count || 0,
      }),
    };
    const assignedOSMembers = manuscripts.assignedUsersCollection?.items
      .map((user) => `${user?.firstName} ${user?.lastName}`)
      .filter(Boolean);

    let discussionTitle = '';
    if (discussionId) {
      const { discussions } = await this.contentfulClient.request<
        FetchDiscussionTitleQuery,
        FetchDiscussionTitleQueryVariables
      >(FETCH_DISCUSSION_TITLE, { id: discussionId });
      discussionTitle = discussions?.title || '';
    }

    const notificationData = (
      recipientType: 'open_science_team' | 'grantee',
    ): TemplateModel => ({
      manuscript: manuscriptData,
      team: {
        name:
          recipientType === 'open_science_team'
            ? submittingTeam?.displayName || ''
            : getCommaAndString(contributingTeamNames),
        workspace: `${origin}/network/teams/${submittingTeam?.sys.id}/workspace`,
      },
      assignedOSMembers: getCommaAndString(assignedOSMembers || []),
      discussion: {
        title: discussionTitle,
      },
    });

    if (discussionId && action === 'os_member_replied_to_discussion') {
      const { discussions } = await this.contentfulClient.request<
        FetchDiscussionGranteeParticipantsQuery,
        FetchDiscussionGranteeParticipantsQueryVariables
      >(FETCH_DISCUSSION_GRANTEE_PARTICIPANTS, { id: discussionId });

      const recipients = Array.from(
        new Set(
          [
            discussions?.message?.createdBy?.email,
            ...(discussions?.repliesCollection?.items.map(
              (reply) => reply?.createdBy?.email,
            ) || []),
          ].filter(Boolean) as string[],
        ),
      );

      let allowedRecipients = recipients;
      if (!isProduction) {
        allowedRecipients = recipients.filter(
          (email) => email && emailList.includes(email),
        );
      }

      const templateDetails = emailNotificationMapping[action];
      if (templateDetails.grantee && allowedRecipients.length >= 1) {
        await this.sendEmail(
          allowedRecipients,
          templateDetails.grantee,
          notificationData('grantee'),
        );
      }
    } else {
      const contributingAuthors = [
        ...(versionData.firstAuthorsCollection?.items.map(
          (firstAuthor) => firstAuthor?.email,
        ) || []),
        ...(versionData.additionalAuthorsCollection?.items.map(
          (additionalAuthor) => additionalAuthor?.email,
        ) || []),
        ...(versionData.correspondingAuthorCollection?.items.map(
          (correspondingAuthor) => correspondingAuthor?.email,
        ) || []),
      ];

      const teamLeaders = activeContributingTeams.map((team) => {
        const activeMemberships = cleanArray(
          team?.linkedFrom?.teamMembershipCollection?.items,
        )
          .filter(
            (membership) =>
              !membership?.inactiveSinceDate &&
              membership?.linkedFrom?.usersCollection?.items[0] &&
              !membership?.linkedFrom?.usersCollection?.items[0]
                ?.alumniSinceDate,
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

      const labPIs = cleanArray(versionData.labsCollection?.items)
        .filter((lab) => lab.labPi && !lab.labPi?.alumniSinceDate)
        .map((lab) => lab.labPi?.email);

      let granteeRecipients = [
        ...new Set([...contributingAuthors, ...teamLeaders.flat(), ...labPIs]),
      ].filter(Boolean) as string[];

      let openScienceRecipients = isProduction
        ? ['openscience@parkinsonsroadmap.org']
        : [];

      if (!isProduction) {
        granteeRecipients = granteeRecipients.filter(
          (email) => email && emailList.includes(email),
        );
        openScienceRecipients = openScienceRecipients.filter(
          (email) => email && emailList.includes(email),
        );
      }

      const templateDetails = emailNotificationMapping[action];
      if (templateDetails.grantee && granteeRecipients.length >= 1) {
        await this.sendEmail(
          granteeRecipients,
          templateDetails.grantee,
          notificationData('grantee'),
        );
      }

      if (
        templateDetails.open_science_team &&
        openScienceRecipients.length >= 1
      ) {
        await this.sendEmail(
          openScienceRecipients,
          templateDetails.open_science_team,
          notificationData('open_science_team'),
        );
      }
    }
  }
}
