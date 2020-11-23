import React, { ComponentProps } from 'react';
import { useFlags } from '@asap-hub/react-context';

import {
  UserProfileBiography,
  UserProfileRecentWorks,
  ProfileCardList,
} from '../organisms';

export interface UserProfileAboutProps {
  biography?: ComponentProps<typeof UserProfileBiography>['biography'];
  biosketch?: ComponentProps<typeof UserProfileBiography>['biosketch'];
  orcidWorks?: ComponentProps<typeof UserProfileRecentWorks>['orcidWorks'];

  editBiographyHref?: string;
  editOrcidWorksHref?: string;
}

const UserProfileAbout: React.FC<UserProfileAboutProps> = ({
  biography,
  biosketch,
  orcidWorks,

  editBiographyHref,
  editOrcidWorksHref,
}) => {
  const { isEnabled } = useFlags();

  return (
    <ProfileCardList>
      {{
        card: biography && (
          <UserProfileBiography biosketch={biosketch} biography={biography} />
        ),
        editLink:
          editBiographyHref === undefined
            ? undefined
            : {
                href: editBiographyHref,
                label: 'Edit biography',
                enabled: isEnabled('PROFILE_EDITING'),
              },
      }}
      {{
        card:
          orcidWorks && orcidWorks.length ? (
            <UserProfileRecentWorks orcidWorks={orcidWorks} />
          ) : null,
        editLink:
          editOrcidWorksHref === undefined
            ? undefined
            : {
                href: editOrcidWorksHref,
                label: 'Edit recent works visibility',
                enabled: isEnabled('PROFILE_EDITING'),
              },
      }}
    </ProfileCardList>
  );
};

export default UserProfileAbout;
