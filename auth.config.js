export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/ui');

      if (isOnDashboard) {
        return isLoggedIn; 
      }
   
      return true;
    },
  },
  providers: [], 
};
