import React, { useEffect, useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK, Link } from '@contentful/app-sdk';
import {
  useSDK,
  useFieldValue,
  useAutoResizer,
} from '@contentful/react-apps-toolkit';

const getTitle = (teamName?: string, userName?: string) => {
  if (teamName && userName) return `${teamName} - ${userName}`;
  if (userName) return userName;
  if (teamName) return teamName;
  return '';
};

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  useAutoResizer();

  const [title, setTitle] = useFieldValue<string>('title');
  const [team] = useFieldValue<Link>('team');
  const [user] = useFieldValue<Link>('user');

  const [teamName, setTeamName] = useState('');
  const [userName, setUserName] = useState('');

  const updateTeam = async (id: string) => {
    const entry = await sdk.space.getEntry(id);
    setTeamName(entry.fields.displayName['en-US']);
  };

  const updateUser = async (id: string) => {
    const entry = await sdk.space.getEntry(id);
    if (entry.fields.name) {
      setUserName(entry.fields.name['en-US']);
    } else if (entry.fields.firstName) {
      setUserName(
        `${entry.fields.firstName['en-US']} ${entry.fields.lastName['en-US']}`,
      );
    }
  };

  useEffect(() => {
    if (team?.sys?.id) {
      updateTeam(team.sys.id);
    } else {
      setTeamName('');
    }
  }, [team]);

  useEffect(() => {
    if (user?.sys?.id) {
      updateUser(user.sys.id);
    } else {
      setUserName('');
    }
  }, [user]);

  useEffect(() => {
    const titleValue = getTitle(teamName, userName);
    if (titleValue || (!user && !team)) {
      setTitle(titleValue);
    }
  }, [teamName, userName, user, team]);

  return <Paragraph>{title}</Paragraph>;
};

export default Field;
