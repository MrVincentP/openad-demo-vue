<template>
  <div class="singlePage async MFlex">
    <h2>This page is a demo for async mode to load OpenAd ad! </h2>
    <div class="openAdExtend" v-if="openAdExtend.img.src && openAdExtend.img.width && openAdExtend.img.height">
      <a href="javascript:void(0)" class="Flex" rel="noopener nofollow" @click="clickCb">
        <img
          :src="openAdExtend.img.src"
          :width="openAdExtend.img.width"
          :height="openAdExtend.img.height"
          style="max-width: 100%;max-height: 100%;object-fit: contain;"
        >
      </a>
    </div>
    <van-button @click="router.push('/')" type="primary">
      Go Home
    </van-button>
  </div>
</template>
<script>
import { Button } from 'vant';
import { defineComponent, getCurrentInstance, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AsyncLoadScript from '@/utils/AsyncScript';

export default defineComponent({
  name: 'SinglePageAsync',
  components: {
    'van-button': Button,
  },
  setup(){
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const openAdExtend = reactive({
      key: 'openADSDK',
      APP: null,
      adInfo: {
        zoneId: proxy.$AppEnv.zoneId,
        reviveId: proxy.$AppEnv.reviveId,
      },
      img: {
        'width': '',
        'height': '',
        'src': '',
        'bannerid': '',
        'campaignid': '',
        'zoneid': '',
        'loc': '',
        'referer': '',
        'cb': '',
        'sig': '',
      },
    })

    onMounted(() => {
      /** If index.html is not preloaded https://alpha.openad.network/www/delivery/async.v2.php **/
      let key = openAdExtend.key;
      // if you have loaded the file, this will be a cache, and then run the below codes
      AsyncLoadScript({
        name: key,
        version: 'V2',
        url: 'https://alpha.openad.network/www/delivery/async.v2.php',
        noCache: false,
      }, async (Object) => {
        openAdExtend.APP = Object;
        //console.log('openADSDK', Object);
        let res = await openAdExtend.APP.init(openAdExtend.adInfo);
        console.log('res', JSON.stringify(res));
        if(res.code === 0){
          openAdExtend.img = res.data;
        }
        /**
         * code: 0, data: {  } // img object and values
         * code: -1, msg: 'load extend js error!'
         * code: -2, msg: 'get openAD ads error!'
         * code: -3, msg: 'No openAD Ads available yet!'
         **/
      });
    });

    const clickCb = () => {
      let img = openAdExtend.img, params = { bannerid: img.bannerid, zoneid: img.zoneid, sig: img.sig };
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
