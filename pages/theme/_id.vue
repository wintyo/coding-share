<template lang="pug">
div
  .layout
    .layout__item.-left
      .theme-info
        .theme-info__title {{ $data.theme.title }}
        .theme-info__detail {{ $data.theme.detail }}
    .layout__item.-right
      form(@submit="onCodePenSubmit")
        label.form-item
          span codepen url:
          input.input(
            v-model="$data.codepenForm.url"
            type="text"
            placeholder="https://codepen.io/wintyo/pen/oNXxBwG"
          )
        button(type="submit") {{ _myPen ? '更新' : '登録' }}
      br
      form(
        action="https://codepen.io/pen/define"
        method="POST"
        target="_blank"
      )
        //- typescriptは型チェックが無いので一旦noneで
        input(
          type="hidden"
          name="data"
          :value="JSON.stringify({\
            title: $data.theme.title,\
            html_pre_processor: 'pug',\
            css_pre_processor: 'scss',\
            js_pre_processor: 'none',\
          })"
        )
        input(type="submit", value="Penを新しく作る")
    .layout__item.-bottom
      button.preview-reload(@click="onPreviewReloadButtonClick") Penの更新
      transition-group(
        name="flip"
        tag="div"
        class="preview-list"
      )
        template(v-for="codePen in _sortedCodePens")
          .preview-list__item(:key="codePen.id")
            .preview
              .preview__info
                .preview__info__user
                  .user
                    .user__icon(
                      :style="{ backgroundImage: `url(${getUserInfo(codePen.email).photoUrl})` }"
                    )
                    .user__name {{ getUserInfo(codePen.email).name }}
                .preview__info__good
                  .good(
                    :class="{ '-active': isGoodChecked(codePen) }"
                    @click="onGoodButtonClick(codePen)"
                  )
                    | 👍 {{ (codePen.goodUsers || []).length }}
                    .good__detail
                      template(v-for="goodUser in codePen.goodUsers || []")
                        div ・{{ getUserInfo(goodUser).name }}
              iframe.preview__iframe(
                :key="$data.previewTimestamp.getTime()"
                scrolling="no"
                :src="`https://codepen.io/${codePen.accountName}/embed/${codePen.penId}`"
                frameborder="no"
                allowtransparency="true"
                allowfullscreeen="true"
              )
</template>

<script>
import Vue from 'vue';
import { sortBy } from 'lodash-es';

import { database } from '~/plugins/firebase';

export default Vue.extend({
  data() {
    this.themeRef = database.ref(`themes/${this.$route.params.id}`);
    this.pensRef = database.ref(`themes/${this.$route.params.id}/pens`);
    return {
      theme: {},
      codepenForm: {
        url: '',
      },
      codePens: [],
      previewTimestamp: new Date(),
    };
  },
  computed: {
    _myPen() {
      const email = this.$store.state.auth.user ? this.$store.state.auth.user.email : '';
      const codePen = this.$data.codePens.find((codePen) => codePen.email === email);
      return codePen ? codePen : null;
    },
    _sortedCodePens() {
      return sortBy(
        this.$data.codePens,
        [(codePen) => (codePen.goodUsers || []).length]
      ).reverse();
    }
  },
  created() {
    this.themeRef.on('value', (snapshot) => {
      this.$data.theme = snapshot.val();
    });
    this.pensRef.on('value', (snapshot) => {
      const value = snapshot.val();
      this.$data.codePens = Object.keys(value || {}).map((key) => ({
        id: key,
        ...value[key],
      }));

      if (this._myPen) {
        this.$data.codepenForm.url = `https://codepen.io/${this._myPen.accountName}/pen/${this._myPen.penId}`;
      }
    });
  },
  beforeDestroy() {
    this.themeRef.off('value');
    this.pensRef.off('value');
  },
  methods: {
    getUserInfo(email) {
      return this.$store.state.user.users.find((user) => user.email === email) || {};
    },
    onCodePenSubmit(event) {
      event.preventDefault();

      const match = this.$data.codepenForm.url.match(/https:\/\/codepen.io\/(.+?)\/pen\/(.+?)$/);
      if (!match) {
        console.error('cannot parse pen data!');
        return;
      }
      const [_, accountName, penId] = match;

      const email = this.$store.state.auth.user.email;
      const data = {
        email,
        accountName,
        penId,
        goodUsers: this._myPen ? (this._myPen.goodUsers || []) : [],
      };

      if (this._myPen) {
        this.pensRef.child(this._myPen.id).set(data);
        return;
      }

      this.pensRef.push(data);
    },
    isGoodChecked(codePen) {
      const goodUsers = codePen.goodUsers || [];
      const email = this.$store.state.auth.user ? this.$store.state.auth.user.email : '';
      return !!goodUsers.find((goodUser) => goodUser === email);
    },
    onGoodButtonClick(codePen) {
      const email = this.$store.state.auth.user.email;
      const goodUsers = (codePen.goodUsers || []);
      const newGoodUsers = (codePen.goodUsers || []).find((goodUser) => goodUser === email)
        ? goodUsers.filter((goodUser) => goodUser !== email)
        : goodUsers.concat(email);
      this.pensRef.child(`${codePen.id}/goodUsers`).set(newGoodUsers);
    },
    onPreviewReloadButtonClick() {
      this.$data.previewTimestamp = new Date();
    }
  },
});
</script>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;

  &__item {
    padding: 10px;
    border: solid 1px #ccc;

    &.-bottom {
      grid-row: 2;
      grid-column: 1 / span 2;
    }
  }
}

.theme-info {
  &__detail {
    white-space: pre-wrap;
  }
}

.form-item {
  display: block;
}

.input {
  width: 300px;
}

.preview-list {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  &__item {
    width: 350px + 20px;
    padding: 10px;
    background-color: #fff;
    transition: all 0.5s;
  }
}

.preview {
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__iframe {
    margin-top: 5px;
    width: 100%;
    height: 400px;
  }
}

.user {
  display: flex;
  align-items: center;
  justify-content: center;

  &__icon {
    width: 30px;
    height: 30px;
    background: center / cover no-repeat;
    border-radius: 50%;
  }

  &__name {
    margin-left: 5px;
  }
}

.good {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 5px;
  border-radius: 10px;
  border: solid 1px #ccc;
  background-color: #f5f5f5;
  cursor: pointer;

  &.-active {
    color: #0aa;
    font-weight: 600;
    border-color: #0aa;
    background-color: #cff;
  }

  &__detail {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    font-size: 13px;
    padding: 5px;
    color: #000;
    background-color: #fff;
    white-space: nowrap;
  }

  &:hover &__detail {
    display: block;
  }
}

.flip {
  // 要素が動くときにtransitionを設定する（.itemでtransitionを設定しているため-moveで書く必要はない）
  // &-move {
  //   transition: transform 0.5s;
  // }

  // 要素が入るときのアニメーション
  &-enter {
    &-active {
      opacity: 0;
      transform: translate3d(0, -30px, 0);
    }
    &-to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  // 要素が消える時のアニメーション
  &-leave {
    &-active {
      position: absolute;
    }
    &-to {
      opacity: 0;
      transform: translate3d(0, -30px, 0);
    }
  }
}
</style>
