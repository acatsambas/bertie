export const appleAuth = {
  isSupported: false,
  Operation: { LOGIN: 0 },
  Scope: { EMAIL: 0, FULL_NAME: 1 },
  performRequest: async () => {
    throw new Error('Apple Sign-In is only available on iOS');
  },
};
