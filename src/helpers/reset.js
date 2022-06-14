import {
  AUTH,
  REDIRECT_EVENT,
  REDIRECT_URL,
} from '../configuration/SessionKey';

export function resetSession(event = 'Invalid Session! Please login again.') {
  localStorage.setItem(AUTH, '');
  sessionStorage.setItem(REDIRECT_EVENT, event);
  sessionStorage.setItem(REDIRECT_URL, window.location.href);
  window.location.replace('/');
}
