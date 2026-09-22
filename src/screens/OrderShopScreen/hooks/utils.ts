export const needsRealContactEmail = (email?: string) =>
  !email || email.includes('@privaterelay.appleid.com');
