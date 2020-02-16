<template lang="pug">
div
  #auth-container(v-show="!$store.state.auth.user")
  template(v-if="$store.state.auth.user")
    button(@click="onLogoutButtonClick") ログアウト
</template>

<script>
import Vue from 'vue';
import { auth, authProviders } from '~/plugins/firebase';
import * as firebaseui from 'firebaseui';

export default Vue.extend({
  mounted() {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.start('#auth-container', {
      signInOptions: [
        authProviders.Google,
      ],
      callbacks: {
        // Nuxtのローカルサーバーで起こるCORSエラー対策
        signInSuccessWithAuthResult: (authResult) => {
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
