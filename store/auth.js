import { auth } from '~/plugins/firebase';

export const state = () => ({
  user: null,
});

export const mutations = {
  setUser(state, user) {
    state.user = {
      name: user.displayName,
      photoUrl: user.photoURL,
      email: user.email,
    };
  },
  logout(state) {
    state.user = null;
  },
};

export const actions = {
  setUser({ commit }, user) {
    commit('setUser', user);
  },
  async logout({ commit }) {
    await auth.signOut();
    commit('logout');
  },
}
