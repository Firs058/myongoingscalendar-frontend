import { BREAKOUT_CODE, REJECT_CODE, SETTINGS_PREFIX } from './config.js';

export default (axios) => () => ({
  save: ({ params }) => axios.post(`${SETTINGS_PREFIX}/save`, params),

  sync: () =>
    new Promise((resolve, reject) =>
      axios
        .post(`${SETTINGS_PREFIX}/sync`)
        .then(({ data: { payload: { email, social, roles, settings }, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({
          email,
          social,
          roles,
          settings
        }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  changeNickname: ({ params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${SETTINGS_PREFIX}/nickname/change`, params)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  changePass: ({ params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${SETTINGS_PREFIX}/pass/change`, params)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  changeAvatar: ({ formData }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${SETTINGS_PREFIX}/avatar/change`, formData)
        .then(({ data: { payload, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({
          avatar: payload,
          code
        }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  removeAvatar: () =>
    new Promise((resolve, reject) =>
      axios
        .post(`${SETTINGS_PREFIX}/avatar/remove`)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),
})
