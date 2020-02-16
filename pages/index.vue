<template lang="pug">
div
  nuxt-link(to="/theme/create") お題作成
  br
  br
  p お題リスト
  ul.theme-list
    template(v-for="theme in $data.themes")
      li.theme-list__item(@click="onThemeClick(theme.id)")
        .theme-list__item__title {{ theme.title }}
        .theme-list__item__detail {{ theme.detail }}
        .theme-list__item__author Created by {{ theme.author }}
</template>

<script>
import { database, storage } from '~/plugins/firebase';

export default {
  components: {
  },
  data() {
    this.themesRef = database.ref('themes');
    return {
      themes: [],
    };
  },
  created() {
    this.themesRef.on('value', (snapshot) => {
      const value = snapshot.val();
      this.$data.themes = Object.keys(value).map((key) => ({
        id: key,
        ...value[key],
      }));
    });
  },
  beforeDestroy() {
    this.themesRef.off('value');
  },
  methods: {
    onThemeClick(themeId) {
      this.$router.push(`/theme/${themeId}`);
    },
  },
}
</script>

<style lang="scss" scoped>
.theme-list {
  padding: 0 10px;
  list-style: none;

  &__item {
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 5px 5px rgba(#000, 0.05);
    background-color: #fff;
    transition: box-shadow 0.5s;

    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 5px rgba(#000, 0.1);
    }

    & + & {
      margin-top: 10px;
    }

    &__detail {
      white-space: pre-wrap;
    }
  }
}
</style>
