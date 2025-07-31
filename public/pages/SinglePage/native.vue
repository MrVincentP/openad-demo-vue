<template>
  <div class="singlePage native MFlex">
    <h2>This page is a demo for native mode to load OpenAd ad! </h2>
    <van-button @click="go('demo')" type="primary">  open native demo </van-button>
    <van-button @click="go('download')" type="primary"> download html file </van-button>
    <van-button @click="go('home')" type="primary"> Go Home </van-button>
  </div>
</template>
<script>
import { Button } from 'vant';
import { defineComponent, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SinglePageNative',
  components: {
    'van-button': Button,
  },
  setup(){
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const go = (type) => {
      if(type === 'demo'){
        window.open('https://minnievincent.com/');
      }
      if(type === 'home'){
        router.push('/');
      }
      if(type === 'download'){
        let a = document.createElement('a');
        a.href = proxy.$AppEnv.staticURL+'static/html/native.html?t='+new Date().valueOf();
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    return { go, proxy }
  },
});
</script>

<style scoped lang="less">
@import '@/shared/share.less';
</style>
