<template>
  <div class="singlePage multi MFlex">
    <h2>This page is a demo for multi mode to load OpenAd ads! </h2>
    <template v-for="(item, index) in openAdExtend.adList" :key="index">
      <div class="openAdExtend" v-if="item.img.src && item.img.width && item.img.height">
        <a href="javascript:void(0)" class="Flex" rel="noopener nofollow" @click="clickCb(index)">
          <img
            :src="item.img.src"
            :width="item.img.width"
            :height="item.img.height"
            style="max-width: 100%;max-height: 100%;object-fit: contain;"
          >
        </a>
      </div>
    </template>
    <van-button @click="router.push('/')" type="primary">
      Go Home
    </van-button>
  </div>
</template>
<script>
import { Button } from 'vant';
import { defineComponent, getCurrentInstance, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SinglePageMulti',
  components: {
    'van-button': Button,
  },
  setup(){
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const openAdExtend = reactive({
      key: 'openADSDK',
      APP: null,
      adList: [{ zoneId: proxy.$AppEnv.zoneId, reviveId: proxy.$AppEnv.reviveId, img: { } },
        { zoneId: 13, reviveId: proxy.$AppEnv.reviveId, img: { } }],
    })

    onMounted(async () => {
      /** index.html should be preloaded https://alpha.openad.network/www/delivery/async.v2.php **/
      openAdExtend.APP = window[openAdExtend.key];
      //console.log('openADSDK', Object);
      let item;
      for(let i=0;i<openAdExtend.adList.length;i++){
        item = openAdExtend.adList[i];
        let res = await openAdExtend.APP.init({ zoneId: item.zoneId, reviveId: item.reviveId });
        console.log('res', JSON.stringify(res));
        if(res.code === 0){
          item.img = res.data;
          openAdExtend.adList[i] = item;
        }
      }
      /**
       * code: 0, data: {  } // img object and values
       * code: -1, msg: 'load extend js error!'
       * code: -2, msg: 'get openAD ads error!'
       * code: -3, msg: 'No openAD Ads available yet!'
       **/
    });

    const clickCb = (index) => {
      let img = openAdExtend.adList[index].img, params = { bannerid: img.bannerid, zoneid: img.zoneid, sig: img.sig };
      let openFn = null;
      if(window.Telegram){
        // if you have loaded the telegram js in the index.html
        if(window.Telegram.WebApp){
          openFn = window.Telegram.WebApp;
        }else{
          //if you have used the third party components such as @telegram-apps/sdk
          //import { initUtils } from '@telegram-apps/sdk';
          //const utils = initUtils();
          //openFn = utils;
        }
      }
      openAdExtend.APP.click.cb(params, openFn);
    }

    return { router, openAdExtend, clickCb }
  },
});
</script>

<style scoped lang="less">
@import '@/shared/share.less';
</style>
