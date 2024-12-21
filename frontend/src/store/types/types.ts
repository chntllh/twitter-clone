interface RootState {
  user: {
    currentUser: AppUser;
    error: string;
    loading: boolean;
  };
}
