export const mockAlert = () => {
  const originalAlert = window.alert;
  const mockAlert: jest.MockedFunction<typeof window.alert> = jest.fn();

  const originalConfirm = window.confirm;
  const mockConfirm: jest.MockedFunction<typeof window.confirm> = jest.fn();

  beforeEach(() => {
    mockAlert.mockClear();
    window.alert = mockAlert;

    mockConfirm.mockClear().mockReturnValue(true);
    window.confirm = mockConfirm;
  });
  afterEach(() => {
    window.alert = originalAlert;
    window.confirm = originalConfirm;
  });
  return { mockAlert, mockConfirm };
};
