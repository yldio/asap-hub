import React, { useEffect, useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const getTitle = (teamName?: string, userName?: string) => {
  if (teamName && userName) return `${teamName} - ${userName}`;
  if (userName) return userName;
  if (teamName) return teamName;
  return undefined;
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const [title, setTitle] = useState(sdk.field.getValue());

  const [teamName, setTeamName] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  sdk.entry.onSysChanged(async () => {
    const teamId = sdk.entry.fields.team.getValue()?.sys?.id;
    if (teamId) {
      const team = await sdk.space.getEntry(teamId);
      setTeamName(team.fields.displayName['en-US']);
    }

    const userId = sdk.entry.fields.user.getValue()?.sys?.id;
    if (userId) {
      const user = await sdk.space.getEntry(userId);
      setUserName(user.fields.name['en-US']);
    }
  });

  useEffect(() => {
    const titleValue = getTitle(teamName, userName);
    sdk.field.setValue(titleValue);
    setTitle(titleValue);
  }, [teamName, userName, sdk.field]);

  return <Paragraph>{title ?? ''}</Paragraph>;
};

export default Field;
