import { ComponentProps } from 'react';

import {
  UserProfileBiography,
  UserProfileRecentWorks,
  ProfileCardList,
} from '../organisms';

export interface UserProfileAboutProps {
  biography?: ComponentProps<typeof UserProfileBiography>['biography'];
  biosketch?: ComponentProps<typeof UserProfileBiography>['biosketch'];
  orcidWorks?: ComponentProps<typeof UserProfileRecentWorks>['orcidWorks'];
  orcid?: ComponentProps<typeof UserProfileRecentWorks>['orcid'];

  editBiographyHref?: string;
}

const UserProfileAbout: React.FC<UserProfileAboutProps> = ({
  biography,
  biosketch,
  orcidWorks,
  orcid,
  editBiographyHref,
}) => (
  <ProfileCardList>
    {{
      card: (
        <UserProfileBiography biosketch={biosketch} biography={biography} />
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
      card: <UserProfileRecentWorks orcid={orcid} orcidWorks={orcidWorks} />,
    }}
  </ProfileCardList>
);

export default UserProfileAbout;
