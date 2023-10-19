import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Link,
  pixels,
  editIcon,
  mail,
  RelatedEventsCard,
  SharedResearchDetailsTagsCard,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';

import { CtaCard } from '../molecules';
import { OutputCard } from '../organisms';
import OutputAdditionalInformationCard from '../organisms/OutputAdditionalInformationCard';
import PageNotifications from './PageNotifications';

const { rem, mobileScreen } = pixels;
const { createMailTo, INVITE_SUPPORT_EMAIL } = mail;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  overflow: 'auto',
});

const commonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
};

const commonMediaQueries = {
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    ...commonStyles,
    width: 'auto',
  },
};

const buttonsContainer = css({
  ...commonStyles,
  flexFlow: 'column',
  gap: rem(16),
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    flexFlow: 'row',
    width: '100%',
  },
});

const leftButtons = css({
  ...commonStyles,
  ...commonMediaQueries,
});

type OutputDetailPageProps = Pick<
  gp2Model.OutputResponse,
  | 'addedDate'
  | 'authors'
  | 'created'
  | 'documentType'
  | 'id'
  | 'lastUpdatedPartial'
  | 'link'
  | 'mainEntity'
  | 'projects'
  | 'subtype'
  | 'title'
  | 'type'
  | 'workingGroups'
  | 'relatedEvents'
  | 'sharingStatus'
  | 'gp2Supported'
  | 'publishDate'
  | 'description'
  | 'tags'
> & {
  isAdministrator: boolean;
};
const OutputDetailPage: React.FC<OutputDetailPageProps> = ({
  isAdministrator,
  ...output
}: OutputDetailPageProps) => {
  const tags = output.tags.map((tag) => tag.name);
  return (
    <PageNotifications page="output">
      {(notification) => (
        <article
          css={notification ? { position: 'relative', marginTop: rem(48) } : {}}
        >
          <div css={containerStyles}>
            {isAdministrator ? (
              <div css={buttonsContainer}>
                <div css={leftButtons}>
                  <Link
                    noMargin
                    href={
                      gp2Routing
                        .outputs({})
                        .output({ outputId: output.id })
                        .edit({}).$
                    }
                    buttonStyle
                    small
                    primary
                  >
                    {editIcon} Edit
                  </Link>
                </div>
              </div>
            ) : null}
            <OutputCard {...output} detailedView />
            {(output.description || !!output.tags.length) && (
              <SharedResearchDetailsTagsCard
                tags={tags}
                displayDescription={!!output.description}
                descriptionMD={output.description}
              />
            )}
            <RelatedEventsCard
              relatedEvents={output.relatedEvents}
              truncateFrom={3}
              hub="GP2"
            />
            <OutputAdditionalInformationCard {...output} />
          <CtaCard
              href={createMailTo(INVITE_SUPPORT_EMAIL)}
              buttonText="Contact Tech Support"
            >
              <strong>Have additional questions?</strong>
              <br /> Reach out to tech support if you need help.
            </CtaCard>
          </div>
        </article>
      )}
    </PageNotifications>
  );
};
export default OutputDetailPage;
