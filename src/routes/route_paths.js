require('dotenv').config();

export const FrontendHost = process.env.REACT_APP_FRONTEND_PORT;

//User Authorize
export const login = '/login';
export const register = '/register';
export const logout = '/logout';

//Home
export const home = '/AtHome';

//Event
export const event = '/AtEvent';
export const event_route = '/AtEvent/:event_id';

//Attendance
export const attendance = '/AtAttendance';
export const attendance_route = '/AtAttendance/:attendance_id';

export const GetURLSearchParams = (key) => {
  return new URLSearchParams(window.location.search).get(key);
};

export const RedirectToHomePage = () => {
  setTimeout(() => {
    window.location.href = home;
  }, 2000);
};
