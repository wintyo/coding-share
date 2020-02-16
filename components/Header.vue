<template lang="pug">
div
  .header
    .header__link
      nuxt-link(to="/", class="link") TOP
    .header__user
      template(v-if="$store.state.auth.user")
        .user
          .user__icon(
            :style="{ backgroundImage: `url(${$store.state.auth.user.photoUrl})` }"
          )
          .user__hover
            button(@click="onLogoutButtonClick") ログアウト
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onLogoutButtonClick() {
      this.$store.dispatch('auth/logout');
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: solid 1px #ccc;
}

.link {
  color: #000;
  text-decoration: none;
}

.user {
  $root: &;
  position: relative;

  &__icon {
    width: 30px;
    height: 30px;
    background: center / cover no-repeat;
    border-radius: 50%;
  }

  &__hover {
    position: absolute;
    top: 100%;
    right: 0;
    display: none;
    width: 85px;

    #{$root}:hover & {
      display: block;
      background-color: #fff;
    }
  }
}
</style>
