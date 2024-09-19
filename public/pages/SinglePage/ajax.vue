<template>
  <div class="singlePage ajax MFlex">
    <h2>This page is a demo for ajax request OpenAd ads! </h2>
    <div class="openAdAjax" v-if="openAdAjax.img.src && openAdAjax.img.width && openAdAjax.img.height">
      <a href="javascript:void(0)" class="Flex" rel="noopener nofollow" @click="openAdAjax.click.cb">
        <img
          :src="openAdAjax.img.src"
          :width="openAdAjax.img.width"
          :height="openAdAjax.img.height"
          style="max-width: 100%;max-height: 100%;object-fit: contain;"
        >
      </a>
    </div>
    <van-button @click="openAdAjax.init(openAdAjax.adInfo)" type="primary" v-if="!openAdAjax.img.src && !openAdAjax.img.width && !openAdAjax.img.height">
      Ajax Request
    </van-button>
    <van-button @click="router.push('/')" type="primary">
      Go Home
    </van-button>
  </div>
</template>
<script>
import { Button } from 'vant';
import { defineComponent, reactive, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Obj2String from '@/utils/Obj2String';

export default defineComponent({
  name: 'SinglePageAjax',
  components: {
    'van-button': Button,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const openAdAjax = reactive({
      key: 'openAdExtend',
      APP: null,
      env: {
        hasTelegramJs: false,
        hasThirdPartySDK: false,
        openAdExtend: false,
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
      userInfo: {
        Cid: '',
        FirstName: '',
        LastName: '',
        UserName: '',
        lan: '',
        V: '',
        platform: '',
        fromType: 'ajax',
      },
      adInfo: {
        zoneId: proxy.$AppEnv.zoneId,
        reviveId: proxy.$AppEnv.reviveId,
      },
      params: {
        timeStamp: null,
        referer: window.location.origin+window.location.pathname,
        loc: window.location.href.substring(0, window.location.href.indexOf('?')) || window.location.href,
      },
      init: async function(adInfo){
        adInfo = {
          zones: adInfo.zoneId,
          prefix: 'revive-' + adInfo.zoneId + '-'+adInfo.reviveId,
        };
        this.params.timeStamp = new Date().valueOf();
        let key = 'openAdExtend';
        if(this.APP){
          return await this.getAD.cb(this, adInfo);
        }
        if(window.Telegram){
          if(window.Telegram.WebApp){
            this.env.hasTelegramJs = true;
            window.Telegram.WebApp.ready();
            this.APP = window.Telegram.WebApp;
          }else{
            this.env.hasThirdPartySDK = true;
          }
        }
        if(window[key]){
          this.env[key] = true;
          this.APP = window[key].WebApp;
        }
        if(!this.APP){
          let d = await this.loadExtendJS(key);
          if(d === true){
            this.env[key] = true;
            window[key].WebApp.ready();
            this.APP = window[key].WebApp;
          }else{
            return d;
          }
        }
        return await this.getAD.cb(this, adInfo);
      },
      getAD: {
        url: 'http:' === window.location.protocol ? 'http://alpha.openad.network/www/delivery/asyncspc.php' : 'https://alpha.openad.network/www/delivery/asyncspc.php',
        cb: function(_this, adInfo){
          _this.userInfo = _this.getUserInfo();
          return this.ajax(_this, adInfo);
        },
        ajax: async function (_this, adInfo){
          let error = { code: -2, msg: 'get openAD ads error!' };
          try {
            let res = await _this.ajax(_this.getAD.url+Obj2String({ ...adInfo, ..._this.userInfo, ..._this.params }), 'json');
            if(res && Array.isArray(res)){
              return error;
            }
            let d = res[adInfo.prefix+'0'] || {};
            let img = {
              width: d.width,
              height: d.height,
            }
            d = _this.extractLinks(d.html);
            img.src = d.srcs[0];
            _this.click.url = d.hrefs[0];
            _this.log.url = d.srcs[1];
            if(!img.src || !img.width || !img.height || !_this.click.url || !_this.log.url){
              return { code: -3, msg: 'No openAD Ads available yet!' };
            }
            let l = _this.getURLParam({}, _this.log.url);
            let c = _this.getURLParam({}, _this.click.url);
            img = { ...img, ...l, ...c };
            _this.click.link[adInfo.zones] = _this.click.url.substring(_this.click.url.indexOf('dest=')+5);
            delete img.dest;
            _this.img = img;
            _this.log.url = _this.log.url.substring(0, _this.log.url.indexOf('?'));
            _this.click.url = _this.click.url.substring(0, _this.click.url.indexOf('?'));
            _this.log.cb(_this, img);
            return { code: 0, data: img };
          } catch (e) {
            return error;
          }
        },
      },
      log: {
        url: '',
        cb: function(_this, img){
          let params = {
              bannerid: img.bannerid, campaignid: img.campaignid, zoneid: img.zoneid, cb: img.cb,
              ..._this.userInfo,
              ..._this.params,
            }, info = 'send log msg to server success!';
          _this.ajax(this.url+Obj2String(params), 'json').then(res => {
            console.log('log', res);
          }).catch(e => {
            console.log('log', e);
          }).finally(() => {
            console.log(info);
          });
        },
      },
      click: {
        url: '',
        link: { },
        cb: function(){
          let _this = openAdAjax, img = _this.img;
          let params = { bannerid: img.bannerid, zoneid: img.zoneid, sig: img.sig };
          params = { ...params, ..._this.userInfo, ..._this.params };
          _this.ajax(this.url+Obj2String(params), 'html').then(() => {
            console.log('click', true);
          }).catch(() => {
            console.log('click', false);
          }).finally(() => {
            console.log('send click msg to sever success!');
          });
          this.open(_this, params.zoneid);
        },
        open: function(_this, zoneId){
          let openFn = null;
          /** if you have used the third party components such as @telegram-apps/sdk **/
          if(_this.env.hasThirdPartySDK){
            //import { initUtils } from '@telegram-apps/sdk';
            //const utils = initUtils();
            //openFn = utils;
          }else{
            openFn = _this.APP;
          }
          let url = this.link[zoneId], isTgURL = url.startsWith('https://t.me/');
          if(isTgURL){
            openFn.openTelegramLink(url);
          }else{
            openFn.openLink(url);
          }
        },
      },
      getUserInfo: function(){
        let user = this.APP.initDataUnsafe?.user || {};
        let UA = this.getBrowserInfo();
        return {
          Cid: user.id || 'browser',
          FirstName: user.id ? (user['first_name'] || 'FN'+user.id) : 'browser',
          LastName: user.id ? (user['last_name'] || 'LN'+user.id) : 'browser',
          UserName: user.id ? (user['username'] || 'UN'+user.id) : 'browser',
          lan: user.id ? user['language_code'] : window.navigator.language,
          V: user.id ? this.APP.version : UA.fullVersion,
          platform: user.id ? this.APP.platform : UA.browserName,
          fromType: 'script',
        }
      },
      loadExtendJS: async function(key){
        let error = { code: -1, msg: 'load extend js error!' };
        try {
          let res = await this.ajax('https://corsproxy.io/?'+encodeURIComponent('https://telegram.org/js/telegram-web-app.js'), 'text');
          if(res.includes('404')){
            return error;
          }
          res = res.replace(/window.Telegram/g, 'window.'+key);
          let body = document.querySelector('body');
          let script = document.createElement('script');
          script.setAttribute('type', 'text/javascript');
          script.setAttribute('name', key);
          script.async = true;
          script.text = res;
          body.appendChild(script);
          return true;
        } catch (e) {
          return error;
        }
      },
      ajax: function(url, dataType){
        return new Promise((resolve, reject) => {
          window.J$.ajax({
            method: 'get',
            url: url,
            dataType,
            async: true,
            success: (res) => {
              return resolve(res);
            },
            error: () => {
              return reject(false);
            },
          });
        });
      },
      extractLinks: function(html){
        let hrefs = [];
        let hrefRegex = /href=['"]([^'"]*)['"]/g;
        let hrefMatch;
        while ((hrefMatch = hrefRegex.exec(html)) !== null) {
          hrefs.push(decodeURIComponent(hrefMatch[1]).replaceAll('&amp;', '&'));
        }

        let srcs = [];
        let srcRegex = /<img[^>]+src=['"]([^'"]*)['"]/g;
        let srcMatch;
        while ((srcMatch = srcRegex.exec(html)) !== null) {
          srcs.push(decodeURIComponent(srcMatch[1]).replaceAll('&amp;', '&'));
        }

        return {
          hrefs: hrefs,
          srcs: srcs,
        };
      },
      getBrowserInfo: function () {
        let UA = window.navigator.userAgent;
        let browserName = 'Unknown';
        let fullVersion = 'Unknown';

        // Chrome
        if (/Chrome/.test(UA) && /Google Inc/.test(navigator.vendor)) {
          browserName = 'Chrome';
          fullVersion = UA.match(/Chrome\/([\d.]+)/)[1];
          // eslint-disable-next-line brace-style
        }
        // Safari
        else if (/Safari/.test(UA) && /Apple Computer/.test(navigator.vendor)) {
          browserName = 'Safari';
          fullVersion = UA.match(/Version\/([\d.]+)/)[1];
          // eslint-disable-next-line brace-style
        }
        // Firefox
        else if (/Firefox/.test(UA)) {
          browserName = 'Firefox';
          fullVersion = UA.match(/Firefox\/([\d.]+)/)[1];
          // eslint-disable-next-line brace-style
        }
        // Edge
        else if (/Edg/.test(UA)) {
          browserName = 'Edge';
          fullVersion = UA.match(/Edg\/([\d.]+)/)[1];
          // eslint-disable-next-line brace-style
        }
        // IE
        else if (/Trident/.test(UA)) {
          browserName = 'Internet Explorer';
          fullVersion = UA.match(/rv:([\d.]+)/)[1];
          // eslint-disable-next-line brace-style
        }
        // Opera
        else if (/OPR/.test(UA)) {
          browserName = 'Opera';
          fullVersion = UA.match(/OPR\/([\d.]+)/)[1];
        }

        return {
          browserName: browserName,
          fullVersion: fullVersion,
        };
      },
      getURLParam: function (parameter, String) {
        let url = decodeURIComponent(String), params = {}, t, t1, t2, t3;
        t1 = url.indexOf('?');
        t2 = url.indexOf('#/');
        if(t2 > t1){
          let s = url.slice(t1+1, t2);
          url = url.slice(t2);
          t3 = url.indexOf('?');
          if(t3 > -1){
            s += '&'+url.slice(t3+1);
          }
          url = s;
        }else{
          url = url.slice(t1+1);
        }
        url = url.split('&');
        for(let i=0;i<url.length;i++){
          if(url[i].length > 0 && url[i].indexOf('=') > 0){
            t = url[i].indexOf('=');
            params[url[i].slice(0,t)] = url[i].slice(t+1);
          }
        }
        if(typeof parameter === 'string'){
          for(let key in params){
            if(key === parameter){
              return params[key];
            }
          }
        }else if(parameter instanceof Object){
          return params;
        }
      },
    });

    onMounted(() => {

    });

    return { router, openAdAjax };
  },
});
</script>

<style scoped lang="less">
@import '@/shared/share.less';
</style>
