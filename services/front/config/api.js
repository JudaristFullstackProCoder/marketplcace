const apiServerUrl = process.env.API_SERVER;

export default {
  home: apiServerUrl,
  userSignUp: `${apiServerUrl}/users`,
  userLogin: `${apiServerUrl}/auth/user/login`,
  openStore: `${apiServerUrl}/stores/open`,
  getSession: `${apiServerUrl}/session`,
  openStore: `${apiServerUrl}/stores/open`,
};
