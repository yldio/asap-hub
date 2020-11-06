import React, { ComponentProps } from 'react';

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
}) => (
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
            },
    }}
  </ProfileCardList>
);

export default ProfileAbout;
