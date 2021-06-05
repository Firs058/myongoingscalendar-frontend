import anime from '~/api/anime';
import auth from '~/api/auth';
import settings from '~/api/settings';
import user from '~/api/user';
import toast from '~/api/toast';

export default (ctx, inject) => {
  const animeWithAxios = anime(ctx.$axios);
  const authWithAxios = auth(ctx.$axios);
  const settingsWithAxios = settings(ctx.$axios);
  const userWithAxios = user(ctx.$axios);
  const toastWithStore = toast(ctx.store);

  inject('anime', animeWithAxios());
  inject('auth', authWithAxios());
  inject('settings', settingsWithAxios());
  inject('user', userWithAxios());
  inject('toast', toastWithStore());
}
