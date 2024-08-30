export const wait = (delay: number = 0) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};
