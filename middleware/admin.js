export default function ({store, redirect}) {
    if (store.state.user.role === 'admin') return;
    return redirect('/');
}