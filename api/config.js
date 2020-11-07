const BREAKOUT_CODE = 11000;
const REJECT_CODE = 10015;

const AUTH_PREFIX = '/auth';
const SETTINGS_PREFIX = '/user/settings';

const getAuthPrefix = authenticated => authenticated ? '/user' : '/public';

export {
    BREAKOUT_CODE,
    REJECT_CODE,
    AUTH_PREFIX,
    SETTINGS_PREFIX,
    getAuthPrefix
}
