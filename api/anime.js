import { BREAKOUT_CODE, REJECT_CODE, getAuthPrefix } from './config.js';

export default (axios) => () => ({
  getOngoingsList: ({ authenticated = false }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${getAuthPrefix(authenticated)}/title/list`)
        .then(({ data: { payload, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ ongoingsList: payload }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getCalendar: ({ personal = false, params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${getAuthPrefix(personal)}/calendar`, params)
        .then(({ data: { payload, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ calendar: payload }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getTitle: ({ authenticated = false, tid, params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${getAuthPrefix(authenticated)}/title/${tid}`, params)
        .then(({ data: { payload: { title, marked, broadcast: { tabs }, comments: { nodes, total, fromPath } }, status: { code } } }) =>
          code >= BREAKOUT_CODE
            ? resolve({
              title,
              marked,
              tabs,
              nodes,
              total,
              fromPath
            })
            : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  titleToggle: ({ tid }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`/user/title/${tid}/toggle`)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getComments: ({ tid, offset }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`/public/title/${tid}/comments/root/${offset}`)
        .then(({ data: { payload: { nodes, fromPath }, status: { code } } }) =>
          code >= BREAKOUT_CODE
            ? resolve({ nodes, fromPath })
            : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getCommentsChilds: ({ tid, path, id, offset }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`/public/title/${tid}/comments/${path}.${id}/${offset}`)
        .then(({ data: { payload: { nodes, fromPath }, status: { code } } }) =>
          code >= BREAKOUT_CODE
            ? resolve({ nodes, fromPath })
            : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  addComment: ({ params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`/user/title/comments/add`, params)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  addCommentAction: ({ tid, id, action }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`/user/title/${tid}/comments/${id}/${action}/add`)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getSearchSupply: () =>
    new Promise((resolve, reject) =>
      axios
        .post(`/public/es/supply`)
        .then(({ data: { payload, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ supply: payload }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  searchAutocomplete: ({ authenticated = false, params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${getAuthPrefix(authenticated)}/es/autocomplete`, params)
        .then(({ data: { payload, status: { code } } }) =>
          code >= BREAKOUT_CODE
            ? resolve({
              countPages: Math.ceil(payload.count / 12) || 1,
              animes: payload
            })
            : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  addFeedback: ({ authenticated = false, params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`${getAuthPrefix(authenticated)}/feedback/add`, params)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getTimezones: () =>
    new Promise((resolve, reject) =>
      axios
        .post(`/public/timezones`)
        .then(({ data: { payload, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ timezones: payload }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  adminApi: ({ path, params }) =>
    new Promise((resolve, reject) =>
      axios
        .post(`/admin/${path}`, params)
        .then(({ data: { status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ code }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

  getAdminData: () =>
    new Promise((resolve, reject) =>
      axios
        .post(`/admin/data`)
        .then(({ data: { payload, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({ items: payload }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),
})
