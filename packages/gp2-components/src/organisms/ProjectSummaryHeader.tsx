import { gp2 as gp2Model } from '@asap-hub/model';
import { crossQuery, ExternalLink, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import StatusPill from '../molecules/StatusPill';

const { rem } = pixels;

const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  [crossQuery]: {
    flexDirection: 'row',
  },
});

type ProjectSummaryHeaderProps = Pick<
  gp2Model.ProjectResponse,
  'status' | 'projectProposalUrl'
>;

const ProjectSummaryHeader: React.FC<ProjectSummaryHeaderProps> = ({
  status,
  projectProposalUrl,
}) => (
  <div css={[rowStyles, css({ gap: rem(4) })]}>
    <div css={css({ display: 'inline-flex' })}>
      <StatusPill status={status} />
    </div>
    {projectProposalUrl && (
      <div
        css={css({
          [crossQuery]: {
            marginLeft: 'auto',
          },
        })}
      >
        <ExternalLink
          href={projectProposalUrl}
          label="View proposal"
          noMargin
          full
        />
      </div>
    )}
  </div>
);

export default ProjectSummaryHeader;
