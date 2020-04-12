import anime from '~/api/anime'
import auth from '~/api/auth'
import toast from '~/api/toast'

export default (ctx, inject) => {
    const animeWithAxios = anime(ctx.$axios);
    const authWithAxios = auth(ctx.$axios, ctx.redirect, ctx.store);
    const toastWithStore = toast(ctx.store);

    inject('anime', animeWithAxios());
    inject('auth', authWithAxios());
    inject('toast', toastWithStore())
}
