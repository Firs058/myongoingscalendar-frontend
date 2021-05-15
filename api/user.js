import { BREAKOUT_CODE, REJECT_CODE, USER_PREFIX } from './config.js';

export default (axios) => () => ({
  getUserStatistics: () =>
    new Promise((resolve, reject) =>
      axios
        .post(`${USER_PREFIX}/statistics`)
        .then(({ data: { payload: { scoresSection, genresSection, animeSection, commentsSection }, status: { code } } }) => code >= BREAKOUT_CODE ? resolve({
          scoresSection,
          genresSection,
          animeSection,
          commentsSection
        }) : reject({ code }))
        .catch(() => reject({ code: REJECT_CODE }))),

})
