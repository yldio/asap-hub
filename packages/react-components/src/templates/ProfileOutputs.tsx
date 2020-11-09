import React from 'react';

import { ComingSoon, ProfileCardList } from '../organisms';

const ProfileOutputs: React.FC<{}> = () => (
  <ProfileCardList>
    {[
      {
        card: (
          <ComingSoon>
            This is where you will update others on your research progress by
            sharing datasets, protocols, software and other resources with your
            team, a group, or the whole ASAP network.
          </ComingSoon>
        ),
      },
    ]}
  </ProfileCardList>
);

export default ProfileOutputs;
