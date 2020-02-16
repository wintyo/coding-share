<template lang="pug">
div
  #auth-container(v-show="!$store.state.auth.user")
  template(v-if="$store.state.auth.user")
    button(@click="onLogoutButtonClick") ログアウト
</template>

<script>
import Vue from 'vue';
import { auth, authProviders, database } from '~/plugins/firebase';
import * as firebaseui from 'firebaseui';

export default Vue.extend({
  data() {
    this.usersRef = database.ref('users');
    return {};
  },
  mounted() {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.start('#auth-container', {
      signInOptions: [
        authProviders.Google,
      ],
      callbacks: {
        // Nuxtのローカルサーバーで起こるCORSエラー対策
        signInSuccessWithAuthResult: (authResult) => {
          const data = {
            name: authResult.user.displayName,
            photoUrl: authResult.user.photoURL,
            email: authResult.user.email,
          };
          const user = this.$store.state.user.users.find((user) => user.email === data.email);
          if (user) {
            this.usersRef.child(user.id).set(data);
            return;
          }
          this.usersRef.push(data);
          window.location.href = '/';
          return false; // falseにするとsignInSuccessUrlにはリダイレクトしなくなる
        },
      },
      signInSuccessUrl: '/',
      signInFlow: 'popup',
    });
  },
  methods: {
    onLogoutButtonClick() {
      this.$store.dispatch('auth/logout');
    },
  },
});
</script>

<style>

</style>
