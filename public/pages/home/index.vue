<template>
  <!---->
  <div class="Home MFlex">
    <ul>
      <li v-for="(item,index) in paths" :key="index">
        <van-button type="primary" @click="router.push(item.path)">
          {{ item.desc }}
        </van-button>
      </li>
    </ul>
  </div>
  <!---->
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Button } from 'vant';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'HomeIndex',
  components: {
    'van-button': Button,
  },
  setup(){
    const paths = ref([
      { path: '/SinglePage/async', desc: 'load ad with async mode...' },
      { path: '/SinglePage/native', desc: 'load ad with native mode...' },
      { path: '/SinglePage/single', desc: 'load ad with single ad mode...' },
      { path: '/SinglePage/multi', desc: 'load ads with multi ads mode...' },
      { path: '/SinglePage/ajax', desc: 'load ads with ajax mode...' },
    ]);

    const router = useRouter();

    return { router, paths };
  },
});
</script>
<style scoped lang="less">
@import "index.less";
</style>
