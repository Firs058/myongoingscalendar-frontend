export default function ({store, redirect}) {
    if (!store.state.user.authenticated) return;
    return redirect('/');
}