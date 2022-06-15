require('dotenv').config();

export const FrontendHost = process.env.REACT_APP_FRONTEND_PORT;

//User Authorize
export const login = '/login';
export const register = '/register';
export const logout = '/logout';

//Home
export const home = '/AtHome';

export const GetURLSearchParams = (key) => {
  return new URLSearchParams(window.location.search).get(key);
};

export const RedirectToHomePage = () => {
  setTimeout(() => {
    window.location.href = home;
  }, 2000);
};
