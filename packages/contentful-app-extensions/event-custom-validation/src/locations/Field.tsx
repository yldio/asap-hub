import { Entry, FieldAppSDK, Link } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState } from 'react';
import { getEntry, onEntryChanged } from '../utils';

export const VALID_ENTRY_MESSAGE = 'Entry is valid';
export const DUPLICATE_SPEAKERS_MESSAGE =
  'Duplicates with same team and speaker are not allowed';
export const EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE =
  'Selecting team for speaker is not allowed when user is external author';
export const EMPTY_SPEAKER_MESSAGE =
  'You must select team or user or both for speaker';

const hasDuplicates = (array: string[]) => {
  const uniqueItems = new Set(array);
  return uniqueItems.size !== array.length;
};

const Field = () => {
  useAutoResizer();

  const sdk = useSDK<FieldAppSDK>();

  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const getValidations = async () => {
    const entry = getEntry(sdk);

    if (!entry.fields.speakers || !entry.fields.speakers.length) {
      return {
        hasDuplicateSpeakers: false,
        hasSpeakersWithoutTeamAndUser: false,
        hasExternalAuthorAndTeam: false,
      };
    }

    const speakerMembershipIds = entry.fields.speakers.map(
      (e: Entry) => e.sys.id,
    );

    const entries = await sdk.cma.entry.getMany({
      query: {
        'sys.id[in]': speakerMembershipIds,
      },
    });

    const speakerIds = entries.items.map((item) => {
      const team = item.fields?.team?.['en-US'];
      const user = item.fields?.user?.['en-US'];

      return user || team ? `${team?.sys?.id}-${user?.sys?.id}` : null;
    });

    const filteredSpeakerIds = speakerIds.filter((x) => x !== null) as string[];

    const hasExternalAuthorAndTeamArr = await Promise.all(
      entries.items.map(async (item) => {
        const team = item.fields?.team?.['en-US'];
        const user = item.fields?.user?.['en-US'];

        if (!user) return false;

        const userEntry = await sdk.cma.entry.get({
          entryId: user.sys.id,
        });

        return Boolean(
          userEntry.sys.contentType.sys.id === 'externalAuthors' && team,
        );
      }),
    );

    const hasExternalAuthorAndTeam = hasExternalAuthorAndTeamArr.some(
      (v) => !!v,
    );

    const userAssociatedWithWrongTeam = await Promise.all(
      entries.items.map(async (item) => {
        const team = item.fields?.team?.['en-US'];
        const user = item.fields?.user?.['en-US'];

        if (!user) return null;

        const userEntry = await sdk.cma.entry.get({
          entryId: user.sys.id,
        });

        if (userEntry.sys.contentType.sys.id === 'externalAuthors') return null;

        const userTeamMembershipIds = userEntry.fields.teams?.['en-US'].map(
          (t: Link<'Entry'>) => t.sys.id,
        );

        const teamEntry = await sdk.cma.entry.get({
          entryId: team.sys.id,
        });

        const teamMembership = await sdk.cma.entry.getMany({
          query: {
            'sys.id[in]': userTeamMembershipIds,
          },
        });

        const teamIds = (teamMembership.items || []).map(
          (membership) => membership.fields.team['en-US']?.sys?.id,
        );

        if (!teamIds.includes(team.sys.id)) {
          return `User ${userEntry.fields.firstName['en-US']} ${userEntry.fields.lastName['en-US']} does not belong to team ${teamEntry.fields.displayName['en-US']}.`;
        }

        return null;
      }),
    );

    return {
      hasDuplicateSpeakers: hasDuplicates(filteredSpeakerIds),
      hasSpeakersWithoutTeamAndUser:
        speakerIds.length > filteredSpeakerIds.length,
      hasExternalAuthorAndTeam,
      userAssociatedWithWrongTeam: userAssociatedWithWrongTeam.filter(
        (x) => x !== null,
      ) as string[],
    };
  };
  useEffect(
    () =>
      onEntryChanged(sdk, async () => {
        const newErrors: string[] = [];
        const newWarnings: string[] = [];

        const {
          hasDuplicateSpeakers,
          hasExternalAuthorAndTeam,
          hasSpeakersWithoutTeamAndUser,
          userAssociatedWithWrongTeam,
        } = await getValidations();

        if (hasDuplicateSpeakers) {
          newErrors.push(DUPLICATE_SPEAKERS_MESSAGE);
        }

        if (hasExternalAuthorAndTeam) {
          newErrors.push(EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE);
        }

        if (hasSpeakersWithoutTeamAndUser) {
          newErrors.push(EMPTY_SPEAKER_MESSAGE);
        }

        if (userAssociatedWithWrongTeam?.length) {
          userAssociatedWithWrongTeam.forEach((message) => {
            newWarnings.push(message);
          });
        }

        setErrors(newErrors);
        setWarnings(newWarnings);
        sdk.field.setValue(newErrors.length === 0 ? 'true' : 'false');
      }),
    [sdk],
  );

  return (
    <Stack flexDirection="column" alignItems="flex-start">
      {errors.length === 0 && (
        <Note variant="positive">{VALID_ENTRY_MESSAGE}</Note>
      )}

      {errors.map((error, index) => (
        <Note key={index} variant="negative">
          {error}
        </Note>
      ))}
      {warnings.length > 0
        ? warnings.map((warning, index) => (
            <Note key={index} variant="warning">
              {warning}
            </Note>
          ))
        : null}
    </Stack>
  );
};

export default Field;
