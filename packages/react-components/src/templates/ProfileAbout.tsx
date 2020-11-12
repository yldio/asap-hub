import React, { ComponentProps } from 'react';
import { useFlags } from '@asap-hub/react-context';

import {
  ProfileBiography,
  ProfileRecentWorks,
  ProfileCardList,
} from '../organisms';

export interface ProfileAboutProps {
  biography?: ComponentProps<typeof ProfileBiography>['biography'];
  biosketch?: ComponentProps<typeof ProfileBiography>['biosketch'];
  orcidWorks?: ComponentProps<typeof ProfileRecentWorks>['orcidWorks'];

  editBiographyHref?: string;
  editOrcidWorksHref?: string;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({
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
          <ProfileBiography biosketch={biosketch} biography={biography} />
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
            <ProfileRecentWorks orcidWorks={orcidWorks} />
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

export default ProfileAbout;
