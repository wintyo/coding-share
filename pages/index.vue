<template lang="pug">
.container
  div
    Auth
    div {{ $store.state.auth }}
    input(v-model="$data.input", type="text")
    button(@click="onSubmit") 送信
    div
      template(v-for="item in $data.list")
        div
          | {{ item.value }}
          button(@click="deleteItem(item.key)") 削除
    img(:src="$data.imageUrl")
    br
    input(
      type="file"
      value="アップロード"
      @change="onUpload"
    )
    br
    button(@click="onDeleteImageButtonClick") 削除
</template>

<script>
import { auth, authProviders, database, storage } from '~/plugins/firebase';
import * as firebaseui from 'firebaseui';
import Logo from '~/components/Logo.vue'
import Auth from '~/components/Auth.vue';

export default {
  components: {
    Auth,
  },
  data() {
    return {
      input: '',
      list: [],
      imageUrl: '',
    };
  },
  created() {
    const testRef = database.ref().child('test');
    testRef.on('value', (snapshot) => {
      console.log(snapshot);
      console.log(snapshot.val());
      const value = snapshot.val();
      this.$data.list = Object.keys(value).map((key) => ({
        key,
        value: value[key],
      }));
      console.log(this.$data.list);
    });
    // testRef.push('hoge');

    const imageRef = storage.ref().child('types.png');
    imageRef.getDownloadURL()
      .then((url) => {
        console.log(url);
        this.$data.imageUrl = url;
      });
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
  },
  methods: {
    onSubmit() {
      const testRef = database.ref().child('test');
      testRef.push(this.$data.input);
    },
    deleteItem(key) {
      // database.ref(`test/${key}`).remove();
      const testRef = database.ref().child('test');
      testRef.child(key).remove();
    },
    onUpload(event) {
      const uploadRef = storage.ref().child('hoge/upload.png');
      const file = event.target.files[0];

      uploadRef.put(file).then((snapshot) => {
        console.log('snapshot', snapshot);

        uploadRef.getDownloadURL().then((url) => {
          this.$data.imageUrl = url;
        });
      });
    },
    onDeleteImageButtonClick() {
      const uploadRef = storage.ref().child('hoge/upload.png');
      uploadRef.delete()
        .then(() => {
          console.log('success delete');
          // this.$data.imageUrl = '';
        });
    },
  },
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
