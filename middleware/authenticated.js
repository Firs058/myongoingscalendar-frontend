export default function ({ store, redirect }) {
  if (store.getters.authenticated) return;
  return redirect('/login');
}
