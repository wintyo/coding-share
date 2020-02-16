<template lang="pug">
div
  p ログイン
  Auth
</template>

<script>
import Vue from 'vue';
import { auth, authProviders, database, storage } from '~/plugins/firebase';
import Auth from '~/components/Auth.vue';

export default Vue.extend({
  components: {
    Auth,
  },
});
</script>

<style>

</style>
