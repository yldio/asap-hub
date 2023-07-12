import { render, screen } from '@testing-library/react';

import DiscoverGuides from '../DiscoverGuides';

it('renders all the sections', () => {
  const guides = [
    {
      title: 'Post-Award Guidelines',
      content: [
        {
          title: '',
          text: 'All you need to know about the Network, the Hub, budgeting, sharing meetings, communications, publishing and more.',
          linkText: 'Open Folder',
          linkUrl:
            'https://drive.google.com/drive/folders/100b28nnuKwto7rmN_sYg8iTYnKRo7ZQo',
        },
      ],
    },
  ];
  render(<DiscoverGuides guides={guides} />);

  expect(screen.getByText('Post-Award Guidelines')).toBeVisible();
});
