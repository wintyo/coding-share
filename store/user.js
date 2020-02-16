// interface IUser {
//   name: string;
//   photoUrl: string;
//   email: string;
// }

export const state = () => ({
  users: [],
});

export const mutations = {
  setUsers(state, users) {
    state.users = users;
  },
};
