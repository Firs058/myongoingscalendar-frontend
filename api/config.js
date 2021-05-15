const BREAKOUT_CODE = 11000;
const REJECT_CODE = 10015;

const AUTH_PREFIX = '/auth';
const USER_PREFIX = '/user';
const SETTINGS_PREFIX = `${USER_PREFIX}/settings`;

const getAuthPrefix = authenticated => authenticated ? '/user' : '/public';

export {
  BREAKOUT_CODE,
  REJECT_CODE,
  AUTH_PREFIX,
  USER_PREFIX,
  SETTINGS_PREFIX,
  getAuthPrefix
};
