import { ComponentProps } from 'react';
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
  orcid?: ComponentProps<typeof UserProfileRecentWorks>['orcid'];

  editBiographyHref?: string;
  editOrcidWorksHref?: string;
}

const UserProfileAbout: React.FC<UserProfileAboutProps> = ({
  biography,
  biosketch,
  orcidWorks,
  orcid,
  editBiographyHref,
  editOrcidWorksHref,
}) => {
  const { isEnabled } = useFlags();

  return (
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
        editLink:
          editOrcidWorksHref === undefined
            ? undefined
            : {
                href: editOrcidWorksHref,
                label: 'Edit recent works visibility',
                enabled: isEnabled('USER_PROFILE_EDIT_WORKS'),
              },
      }}
    </ProfileCardList>
  );
};

export default UserProfileAbout;
