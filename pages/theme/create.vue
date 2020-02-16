<template lang="pug">
div
  p.title お題作成
  form(@submit="onSubmit")
    label.form-item
      span タイトル：
      input(v-model="$data.title", type="text")
    label.form-item
      span 詳細：
      br
      textarea(v-model="$data.detail", cols="60", rows="5")
    button(type="submit") 作成
</template>

<script>
import Vue from 'vue';
import { database } from '~/plugins/firebase';

export default Vue.extend({
  data() {
    this.themesRef = database.ref('themes');

    return {
      title: '',
      detail: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      this.themesRef.push({
        title: this.$data.title,
        detail: this.$data.detail,
        author: this.$store.state.auth.user.name,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: 600;
}

.form-item {
  display: block;

  & + & {
    margin-top: 10px;
  }
}
</style>
