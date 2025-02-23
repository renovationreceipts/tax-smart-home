
export enum AuthStatus {
  INITIALIZING = 'initializing',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated'
}

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  session: AuthSession | null;
  signOut: () => Promise<void>;
}
