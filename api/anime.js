const BREAKOUT_CODE = 11000;
const REJECT_CODE = 10015;

const getPrefix = v => v ? '/user' : '/public';

export default (axios) => () => ({
    getOngoingsList: ({authenticated = false}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${getPrefix(authenticated)}/title/list`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({ongoingsList: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getCalendar: ({personal = false, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${getPrefix(personal)}/calendar`, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({calendar: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getTitle: ({authenticated = false, tid, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${getPrefix(authenticated)}/title/${tid}`, params)
                .then(({data: {payload: {title, marked, broadcast: {tabs}, comments: {nodes, total, fromPath}}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({
                            title,
                            marked,
                            tabs,
                            nodes,
                            total,
                            fromPath
                        })
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    titleToggle: ({tid}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`/user/title/${tid}/toggle`)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getComments: ({tid, offset}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`/public/title/${tid}/comments/root/${offset}`)
                .then(({data: {payload: {nodes, fromPath}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({nodes, fromPath})
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getCommentsChilds: ({tid, path, id, offset}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`/public/title/${tid}/comments/${path}.${id}/${offset}`)
                .then(({data: {payload: {nodes, fromPath}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({nodes, fromPath})
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    addComment: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`/user/title/comments/add`, params)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    addCommentAction: ({tid, id, action}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`/user/title/${tid}/comments/${id}/${action}/add`)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getSearchSupply: () =>
        new Promise((resolve, reject) =>
            axios
                .post(`/public/es/supply`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({supply: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    searchAutocomplete: ({authenticated = false, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${getPrefix(authenticated)}/es/autocomplete`, params)
                .then(({data: {payload, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({
                            countPages: Math.ceil(payload.count / 12) || 1,
                            animes: payload
                        })
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    addFeedback: ({authenticated = false, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${getPrefix(authenticated)}/feedback/add`, params)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getTimezones: () =>
        new Promise((resolve, reject) =>
            axios
                .post(`/public/timezones`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({timezones: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    adminApi: ({path, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`/admin/${path}`, params)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getAdminData: () =>
        new Promise((resolve, reject) =>
            axios
                .post(`/admin/data`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({items: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),
})
