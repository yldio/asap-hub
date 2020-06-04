import React from 'react';
import { render } from '@testing-library/react';

import AdminInviteUserPage from '../AdminInviteUserPage';

describe('in initial state', () => {
  it('renders a headline', () => {
    const { getByRole } = render(<AdminInviteUserPage state="initial" />);
    expect(getByRole('heading')).toHaveTextContent(/invite/i);
  });

  it('renders a user invitation form', () => {
    const { getByRole } = render(<AdminInviteUserPage state="initial" />);
    expect(getByRole('button')).toHaveTextContent(/invite/i);
  });
});

describe('in loading state', () => {
  it('does not render a headline', () => {
    const { queryByRole } = render(<AdminInviteUserPage state="loading" />);
    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('does not render a user invitation form', () => {
    const { queryByRole } = render(<AdminInviteUserPage state="loading" />);
    expect(queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('in success state', () => {
  it('renders a headline', () => {
    const { getByRole } = render(<AdminInviteUserPage state="success" />);
    expect(getByRole('heading')).toHaveTextContent(/invite/i);
  });

  it('renders a user invitation form', () => {
    const { getByRole } = render(<AdminInviteUserPage state="success" />);
    expect(getByRole('button')).toHaveTextContent(/invite/i);
  });

  it('renders a success message', () => {
    const { getByText } = render(<AdminInviteUserPage state="success" />);
    expect(getByText(/invited/i).textContent).toMatchInlineSnapshot(
      `"User invited."`,
    );
  });
});

describe('in error state', () => {
  it('renders a headline', () => {
    const { getByRole } = render(
      <AdminInviteUserPage state={new Error('oops')} />,
    );
    expect(getByRole('heading')).toHaveTextContent(/invite/i);
  });

  it('renders a user invitation form', () => {
    const { getByRole } = render(
      <AdminInviteUserPage state={new Error('oops')} />,
    );
    expect(getByRole('button')).toHaveTextContent(/invite/i);
  });

  it('renders a success message', () => {
    const { getByText } = render(
      <AdminInviteUserPage state={new Error('oops')} />,
    );
    expect(getByText(/failed/i).textContent).toMatchInlineSnapshot(
      `"Failed to invite user. Error: oops"`,
    );
  });
});
