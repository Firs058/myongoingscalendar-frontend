const BREAKOUT_CODE = 11000;
const REJECT_CODE = 10015;

export default (axios, store) => () => ({
    getOngoingsList: () =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/title/list`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({ongoingsList: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getCalendar: ({forUser, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${forUser ? process.env.USER_API_URL : process.env.API_URL}/calendar`, params)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({calendar: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getSearchSupply: () =>
        new Promise((resolve, reject) =>
            axios
                .post(`${process.env.API_URL}/es/supply`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({supply: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    searchAutocomplete: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/es/autocomplete`, params)
                .then(({data: {payload, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({
                            countPages: Math.ceil(payload.count / 12) || 1,
                            animes: payload
                        })
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getTitle: ({tid, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/title/${tid}`, params)
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
                .post(`${store.getters.apiUrl}/title/${tid}/toggle`)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getComments: ({tid, offset}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/title/${tid}/comments/root/${offset}`)
                .then(({data: {payload: {nodes, fromPath}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({nodes, fromPath})
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getCommentsChilds: ({tid, path, id, offset}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/title/${tid}/comments/${path}.${id}/${offset}`)
                .then(({data: {payload: {nodes, fromPath}, status: {code}}}) =>
                    code >= BREAKOUT_CODE
                        ? resolve({nodes, fromPath})
                        : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    addComment: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/title/comments/add`, params)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    addCommentAction: ({tid, id, action}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/title/${tid}/comments/${id}/${action}/add`)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    addFeedback: ({params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${store.getters.apiUrl}/feedback/add`, params)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    adminApi: ({path, params}) =>
        new Promise((resolve, reject) =>
            axios
                .post(`${process.env.ADMIN_API_URL}/${path}`, params)
                .then(({data: {status: {code}}}) => code >= BREAKOUT_CODE ? resolve({code}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),

    getAdminData: () =>
        new Promise((resolve, reject) =>
            axios
                .post(`${process.env.ADMIN_API_URL}/data`)
                .then(({data: {payload, status: {code}}}) => code >= BREAKOUT_CODE ? resolve({items: payload}) : reject({code}))
                .catch(() => reject({code: REJECT_CODE}))),
})
