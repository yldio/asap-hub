import { render, screen } from '@testing-library/react';
import ExpandableText from '../ExpandableText';

describe('ExpandableText', () => {
  const text =
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt a itaque hic vel voluptatum commodi ab quisquam consectetur, explicabo reiciendis voluptatem iure dolorum sint praesentium atque. Sapiente laboriosam culpa consectetur?';
  it('renders the children', () => {
    render(<ExpandableText>{text}</ExpandableText>);
    expect(screen.getByText(text)).toBeVisible();
  });
});
