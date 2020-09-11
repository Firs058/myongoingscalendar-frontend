import anime from '~/api/anime'
import auth from '~/api/auth'
import settings from '~/api/settings'
import toast from '~/api/toast'

export default (ctx, inject) => {
    const animeWithAxios = anime(ctx.$axios);
    const authWithAxios = auth(ctx.$axios);
    const settingsWithAxios = settings(ctx.$axios);
    const toastWithStore = toast(ctx.store);

    inject('anime', animeWithAxios());
    inject('auth', authWithAxios());
    inject('settings', settingsWithAxios());
    inject('toast', toastWithStore())
}
