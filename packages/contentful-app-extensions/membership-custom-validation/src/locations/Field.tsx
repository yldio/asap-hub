import { Entry, FieldAppSDK } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState } from 'react';
import { getEntry, onEntryChanged } from '../utils';

export const DUPLICATE_MEMBERS_MESSAGE =
  'The same membership has been added multiple times';
export const VALID_ENTRY_MESSAGE = 'Valid membership list';
const hasDuplicates = (array: string[]) => {
  const uniqueItems = new Set(array);
  return uniqueItems.size !== array.length;
};

const Field = () => {
  useAutoResizer();

  const sdk = useSDK<FieldAppSDK>();

  const [warnings, setWarnings] = useState<string[]>([]);

  const getValidations = async () => {
    const entry = getEntry(sdk);

    if (!entry.fields.members || !entry.fields.members.length) {
      return null;
    }

    const memberIds = entry.fields.members.map((e: Entry) => e.sys.id);

    const entries = await sdk.cma.entry.getMany({
      query: {
        'sys.id[in]': memberIds,
      },
    });

    const groupedUsers = entries.items.reduce(
      (groups: { [key: string]: string[] }, membership) => {
        const userId = membership.fields?.user?.['en-US']?.sys?.id;
        const role = membership.fields?.role?.['en-US'];
        if (!userId) return groups;
        if (!groups[userId]) {
          // eslint-disable-next-line no-param-reassign
          groups[userId] = [];
        }
        groups[userId].push(role);
        return groups;
      },
      {},
    );

    const validationMessages = await Promise.all(
      Object.entries(groupedUsers).map(async ([userId, duplicateRoles]) => {
        if (duplicateRoles?.length > 1) {
          const userEntry = await sdk.cma.entry.get({
            entryId: userId,
          });
          const roles = duplicateRoles.join(', ');
          return `User ${userEntry.fields.firstName['en-US']} ${userEntry.fields.lastName['en-US']} has been added in multiple roles [${roles}].`;
        }
        return null;
      }),
    );

    return {
      duplicateMembers: hasDuplicates(memberIds),
      duplicateUserMessages: validationMessages.filter(
        (x) => x !== null,
      ) as string[],
    };
  };

  useEffect(
    () =>
      onEntryChanged(sdk, async () => {
        const newWarnings: string[] = [];

        const validationMessages = await getValidations();
        if (validationMessages?.duplicateMembers) {
          newWarnings.push(DUPLICATE_MEMBERS_MESSAGE);
        }

        if (validationMessages?.duplicateUserMessages?.length) {
          validationMessages.duplicateUserMessages.forEach((message) => {
            newWarnings.push(message);
          });
        }

        setWarnings(newWarnings);
        sdk.field.setValue(newWarnings.length === 0 ? 'true' : 'false');
      }),
    [sdk],
  );

  return (
    <Stack flexDirection="column" alignItems="flex-start">
      {warnings.length > 0 ? (
        warnings.map((warning, index) => (
          <Note key={index} variant="warning">
            {warning}
          </Note>
        ))
      ) : (
        <Note variant="positive">{VALID_ENTRY_MESSAGE}</Note>
      )}
    </Stack>
  );
};

export default Field;
