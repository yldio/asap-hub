export const pause = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
};
