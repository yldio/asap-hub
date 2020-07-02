import React from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from '@asap-hub/react-components';
import api from "../api"

const Page: React.FC<{}> = () => {
  const {
    id
  } = useParams()
  
  api.users.fetchById(id)
    .then((resp) => {
      console.log(resp);
    })
    .catch((error) => {
      console.log(error);
    });

  const props = { 
    department: 'Biology Department',
    displayName: 'Phillip Mars, PhD',
    institution: 'Yale University',
    lastModified: new Date(),
    location: 'New Haven, Connecticut',
    role: 'Researcher',
    team: 'Team A',
    title: 'Assistant Professor',
  };

  return <Profile {...props} />;
};

export default Page;
