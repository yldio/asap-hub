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
  'You must select an internal user with a team, or an external user without a team';
export const TEAM_WITHOUT_USER_MESSAGE =
  'Selecting an internal user is required when a team is selected';
export const INTERNAL_USER_WITHOUT_TEAM_MESSAGE =
  'Selecting a team is required when user is an internal user';

const REVALIDATE_INTERVAL_MS = 5000;

const hasDuplicates = (array: string[]) => {
  const uniqueItems = new Set(array);
  return uniqueItems.size !== array.length;
};

type SpeakerCheck = {
  dedupeKey?: string;
  emptySpeaker?: boolean;
  teamWithoutUser?: boolean;
  internalUserWithoutTeam?: boolean;
  externalAuthorWithTeam?: boolean;
  wrongTeamMessage?: string;
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
        hasEmptySpeakers: false,
        hasTeamWithoutUser: false,
        hasInternalUserWithoutTeam: false,
        hasExternalAuthorAndTeam: false,
        userAssociatedWithWrongTeam: [] as string[],
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

    const checks: SpeakerCheck[] = await Promise.all(
      entries.items.map(async (item): Promise<SpeakerCheck> => {
        const team = item.fields?.team?.['en-US'];
        const user = item.fields?.user?.['en-US'];

        if (!user && !team) {
          return { emptySpeaker: true };
        }

        if (!user) {
          return {
            teamWithoutUser: true,
            dedupeKey: `${team.sys.id}-undefined`,
          };
        }

        const dedupeKey = `${team?.sys?.id}-${user.sys.id}`;

        const userEntry = await sdk.cma.entry.get({
          entryId: user.sys.id,
        });
        const isExternalAuthor =
          userEntry.sys.contentType.sys.id === 'externalAuthors';

        if (isExternalAuthor) {
          return team
            ? { externalAuthorWithTeam: true, dedupeKey }
            : { dedupeKey };
        }

        if (!team) {
          return { internalUserWithoutTeam: true, dedupeKey };
        }

        const userTeamMembershipIds = userEntry.fields.teams?.['en-US']?.map(
          (t: Link<'Entry'>) => t.sys.id,
        );

        const teamMembership = await sdk.cma.entry.getMany({
          query: {
            'sys.id[in]': userTeamMembershipIds,
          },
        });

        const teamIds = (teamMembership.items || []).map(
          (membership) => membership.fields.team['en-US']?.sys?.id,
        );

        if (!teamIds.includes(team.sys.id)) {
          const teamEntry = await sdk.cma.entry.get({
            entryId: team.sys.id,
          });

          return {
            dedupeKey,
            wrongTeamMessage: `User ${userEntry.fields.firstName['en-US']} ${userEntry.fields.lastName['en-US']} does not belong to team ${teamEntry.fields.displayName['en-US']}.`,
          };
        }

        return { dedupeKey };
      }),
    );

    return {
      hasDuplicateSpeakers: hasDuplicates(
        checks
          .map((check) => check.dedupeKey)
          .filter((key): key is string => Boolean(key)),
      ),
      hasEmptySpeakers: checks.some((check) => check.emptySpeaker),
      hasTeamWithoutUser: checks.some((check) => check.teamWithoutUser),
      hasInternalUserWithoutTeam: checks.some(
        (check) => check.internalUserWithoutTeam,
      ),
      hasExternalAuthorAndTeam: checks.some(
        (check) => check.externalAuthorWithTeam,
      ),
      userAssociatedWithWrongTeam: checks
        .map((check) => check.wrongTeamMessage)
        .filter((message): message is string => Boolean(message)),
    };
  };

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    const validate = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const {
          hasDuplicateSpeakers,
          hasEmptySpeakers,
          hasTeamWithoutUser,
          hasInternalUserWithoutTeam,
          hasExternalAuthorAndTeam,
          userAssociatedWithWrongTeam,
        } = await getValidations();

        if (cancelled) return;

        const newErrors: string[] = [];
        const newWarnings: string[] = [];

        if (hasDuplicateSpeakers) {
          newErrors.push(DUPLICATE_SPEAKERS_MESSAGE);
        }

        if (hasExternalAuthorAndTeam) {
          newErrors.push(EXTERNAL_AUTHOR_WITH_TEAM_MESSAGE);
        }

        if (hasEmptySpeakers) {
          newErrors.push(EMPTY_SPEAKER_MESSAGE);
        }

        if (hasTeamWithoutUser) {
          newErrors.push(TEAM_WITHOUT_USER_MESSAGE);
        }

        if (hasInternalUserWithoutTeam) {
          newErrors.push(INTERNAL_USER_WITHOUT_TEAM_MESSAGE);
        }

        userAssociatedWithWrongTeam.forEach((message) => {
          newWarnings.push(message);
        });

        setErrors(newErrors);
        setWarnings(newWarnings);

        const value = newErrors.length === 0 ? 'true' : 'false';
        if (sdk.field.getValue?.() !== value) {
          sdk.field.setValue(value);
        }
      } finally {
        inFlight = false;
      }
    };

    const unsubscribe = onEntryChanged(sdk, validate);
    // linked speaker entries are edited in their own slide-in editor and never
    // notify this entry, so poll and revalidate on window focus as well
    const interval = setInterval(validate, REVALIDATE_INTERVAL_MS);
    window.addEventListener('focus', validate);
    validate();

    return () => {
      cancelled = true;
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', validate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk]);

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
