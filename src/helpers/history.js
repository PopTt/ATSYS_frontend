import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const pushHistory = (url) => {
  var newurl = window.location.protocol + '//' + window.location.host + url;
  window.history.pushState({ path: newurl }, '', newurl);
};
