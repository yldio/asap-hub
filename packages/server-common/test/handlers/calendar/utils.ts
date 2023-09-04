export const expectChannelId = (id: string) =>
  // starting with specific id
  // and ending with timestamp
  expect.stringMatching(new RegExp(`^${id}_\\d+`));
