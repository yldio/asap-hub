export const handler = async (): Promise<unknown> => {
  const response = {
    isAuthorized: true,
    context: {
      exampleKey: 'exampleValue',
    },
  };

  return response;
};
