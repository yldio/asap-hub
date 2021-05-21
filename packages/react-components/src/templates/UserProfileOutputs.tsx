import { ComingSoon, ProfileCardList } from '../organisms';

const UserProfileOutputs: React.FC<Record<string, never>> = () => (
  <ProfileCardList>
    {[
      {
        card: (
          <ComingSoon>
            As individuals create and share more research outputs - such as
            datasets, protocols, code and other resources - they will be listed
            here. As information is shared, teams should be mindful to respect
            intellectual boundaries. No investigator or team should act on any
            of the privileged information shared within the Network without
            express permission from and credit to the investigator(s) that
            shared the information.
          </ComingSoon>
        ),
      },
    ]}
  </ProfileCardList>
);

export default UserProfileOutputs;
