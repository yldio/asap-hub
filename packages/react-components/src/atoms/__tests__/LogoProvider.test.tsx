import { render, screen } from '@testing-library/react';
import { LogoProvider, useLogo } from '../LogoProvider';

const LogoConsumer = () => {
  const logo = useLogo();
  return <div>{logo}</div>;
};

describe('LogoProvider', () => {
  it('renders CRN logo when appName is CRN', async () => {
    render(
      <LogoProvider appName="CRN">
        <LogoConsumer />
      </LogoProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const crnLogo = await screen.findByTitle('CRN Logo');
    expect(crnLogo).toBeInTheDocument();
  });

  it('renders GP2 logo when appName is GP2', async () => {
    render(
      <LogoProvider appName="GP2">
        <LogoConsumer />
      </LogoProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    const gp2Logo = await screen.findByTitle('GP2 Logo');
    expect(gp2Logo).toBeInTheDocument();
  });
});
