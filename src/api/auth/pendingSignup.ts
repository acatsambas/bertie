export type PendingSignup = {
  email: string;
  password: string;
};

let pendingSignup: PendingSignup | null = null;

export const setPendingSignup = (signup: PendingSignup) => {
  pendingSignup = signup;
};

export const getPendingSignup = (): PendingSignup | null => pendingSignup;

export const clearPendingSignup = () => {
  pendingSignup = null;
};
