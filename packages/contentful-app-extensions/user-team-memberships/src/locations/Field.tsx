import React, { useEffect, useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK, Link } from '@contentful/app-sdk';
import {
  useSDK,
  useFieldValue,
  useAutoResizer,
} from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  useAutoResizer();

  const [title, setTitle] = useFieldValue<string>('title');
  const [team] = useFieldValue<Link>('team');
  const [inactiveSince] = useFieldValue<string>('inactiveSinceDate');
  const [teamName, setTeamName] = useState();

  const updateTeamName = async (id: string) => {
    const teamEntry = await sdk.space.getEntry(id);
    setTeamName(teamEntry.fields.displayName['en-US']);
  };

  useEffect(() => {
    const id = team?.sys?.id;
    if (id) {
      updateTeamName(id);
    }
  }, [team]);

  useEffect(() => {
    if (teamName) {
      setTitle(`${teamName}${inactiveSince ? ' (inactive)' : ''}`);
    }
  }, [teamName, inactiveSince]);

  return <Paragraph>{title}</Paragraph>;
};

export default Field;
