<template lang="pug">
.container
  div
    Auth
    div {{ $store.state.auth }}
</template>

<script>
import { auth, authProviders } from '~/plugins/firebase';
import * as firebaseui from 'firebaseui';
import Logo from '~/components/Logo.vue'
import Auth from '~/components/Auth.vue';

export default {
  components: {
    Auth,
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        return;
      }
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

      const config = {
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
      };

      ui.start('#auth-container', config);
    });
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
