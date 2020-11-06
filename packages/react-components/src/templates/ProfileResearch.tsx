import React, { ComponentProps } from 'react';
import { UserResponse } from '@asap-hub/model';

import {
  ProfileBackground,
  ProfileSkills,
  QuestionsSection,
  ProfileCardList,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

type ProfileResearchProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileSkills> &
  Pick<ComponentProps<typeof ProfileBackground>, 'firstName' | 'displayName'> &
  Pick<UserResponse, 'email'> & {
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
    >;
  } & {
    editBackgroundHref?: string;
    editSkillsHref?: string;
    editQuestionsHref?: string;
  };

const ProfileResearch: React.FC<ProfileResearchProps> = ({
  firstName,
  displayName,
  email,
  teams,
  skills,
  skillsDescription,
  questions,

  editBackgroundHref,
  editSkillsHref,
  editQuestionsHref,
}) => {
  return (
    <ProfileCardList>
      {{
        card: teams.length
          ? teams.map((team) => (
              <ProfileBackground
                key={team.id}
                {...team}
                firstName={firstName}
              />
            ))
          : null,
        editLink:
          editBackgroundHref === undefined
            ? undefined
            : { href: editBackgroundHref, label: 'Edit role on ASAP' },
      }}
      {{
        card: skills.length ? (
          <ProfileSkills
            skillsDescription={skillsDescription}
            skills={skills}
          />
        ) : null,
        editLink:
          editSkillsHref === undefined
            ? undefined
            : {
                href: editSkillsHref,
                label: 'Edit expertise and resources',
              },
      }}
      {{
        card: questions.length ? (
          <QuestionsSection firstName={firstName} questions={questions} />
        ) : null,
        editLink:
          editQuestionsHref === undefined
            ? undefined
            : { href: editQuestionsHref, label: 'Edit open questions' },
      }}
      {{
        card: (
          <CtaCard href={createMailTo(email)} buttonText="Contact">
            <strong>Interested in what you have seen?</strong> <br />
            Why not get in touch with {displayName}?
          </CtaCard>
        ),
      }}
    </ProfileCardList>
  );
};

export default ProfileResearch;
