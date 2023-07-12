import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import GuideDescription from '../GuideDescription';

const mockDescriptionBlocksNoTitle: gp2.GuideBlockDataObject[] = [
  {
    id: '1',
    bodyText: 'Paragraph 1',
  },
];
const mockDescriptionBlocksNoLink: gp2.GuideBlockDataObject[] = [
  {
    id: '1',
    bodyText: 'Paragraph 1',
    title: 'Topic 1',
  },
];

const mockDescriptionBlocks: gp2.GuideBlockDataObject[] = [
  {
    id: '2',
    bodyText: 'Paragraph 2',
    title: 'Topic 2',
    linkUrl: 'https://example.com',
    linkText: 'Click here',
  },
];
describe('GuideDescription', () => {
  it('should render 2 articles', () => {
    render(<GuideDescription blocks={mockDescriptionBlocks} />);
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('should render just the text', () => {
    render(<GuideDescription blocks={mockDescriptionBlocksNoTitle} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
  it('should render just the text and title', () => {
    render(<GuideDescription blocks={mockDescriptionBlocksNoLink} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Topic 1');
    expect(screen.getByText('Paragraph 1')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
  it('should render the text and the link', () => {
    render(<GuideDescription blocks={mockDescriptionBlocks} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Topic 2');
    expect(screen.getByText('Paragraph 2')).toBeVisible();
    expect(screen.getByRole('link')).toHaveTextContent(/Click here/);
  });
});
