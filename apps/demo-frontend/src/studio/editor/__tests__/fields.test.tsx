import { limits } from '@asap-hub/demo-timeline';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC, useState } from 'react';
import { TextField } from '../fields';

const Editable: FC<{ readonly label: string }> = ({ label }) => {
  const [value, setValue] = useState('');
  return <TextField label={label} value={value} onChange={setValue} />;
};

describe('TextField', () => {
  // the server rejects the whole document over one long string, and the only
  // sign of it was "Could not save, retrying on the next edit", forever
  it('cannot take more text than the document allows', async () => {
    render(<Editable label="Heading" />);

    const field = screen.getByLabelText('Heading');
    await userEvent.click(field);
    await userEvent.paste('a'.repeat(limits.textLength + 100));

    expect(field).toHaveValue('a'.repeat(limits.textLength));
  });

  it('is not offered an unrelated saved value by the browser', () => {
    render(<TextField label="Subtitle" value="" onChange={jest.fn()} />);

    expect(screen.getByLabelText('Subtitle')).toHaveAttribute(
      'autocomplete',
      'off',
    );
  });
});
