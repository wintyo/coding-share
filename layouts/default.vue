<template lang="pug">
div
  Header
  nuxt
</template>

<script>
import Vue from 'vue';

import { database } from '~/plugins/firebase';

import Header from '@/components/Header.vue';

export default Vue.extend({
  components: {
    Header,
  },
  data() {
    this.usersRef = database.ref('users');
    return {};
  },
  created() {
    this.usersRef.on('value', (snapshot) => {
      const value = snapshot.val();
      this.$store.commit('user/setUsers', Object.keys(value || {}).map((key) => ({
        id: key,
        ...value[key],
      })));
    });
  },
  beforeDestroy() {
    this.usersRef.off('value');
  },
});
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
