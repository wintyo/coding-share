import { auth } from '~/plugins/firebase';

export default ({ route, store, redirect }) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      store.dispatch('auth/setUser', user);
      return;
    }

    if (route.path !== '/login') {
      redirect('/login');
    }
  });
}
