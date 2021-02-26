export const calendarMock = {
  list: jest.fn(),
};
const google = {
  calendar: jest.fn(() => calendarMock),
};

export default google;
