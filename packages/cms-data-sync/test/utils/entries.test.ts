import { publishContentfulEntries } from '../../src/utils';
import { entry } from '../fixtures';

describe('publishContentfulEntries', () => {
  it('calls entry publish function', async () => {
    await publishContentfulEntries([entry]);
    expect(entry.publish).toHaveBeenCalledTimes(1);
  });

  it('outputs a message when publish fails', async () => {
    console.log = jest.fn();
    await publishContentfulEntries([entry]);
    expect(console.log).toHaveBeenCalledWith(
      `Entry with id ${entry.sys.id} could not be published.`,
    );
  });

  it('outputs a message when publish is successful', async () => {
    jest
      .spyOn(entry, 'publish')
      .mockImplementationOnce(() => Promise.resolve(entry));
    console.log = jest.fn();
    await publishContentfulEntries([entry]);
    expect(console.log).toHaveBeenCalledWith(
      `Published entry ${entry.sys.id}.`,
    );
  });
});
