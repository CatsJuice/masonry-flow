<script setup lang="ts">
// @ts-nocheck
import { MasonryFlowRoot } from "../../../src/vue/root";
import { MasonryFlowItem } from "../../../src/vue/item";
</script>

<template>
  <masonry-flow-root
    :transition-duration="150"
    class="root"
    width="200,300"
    :style="{ width: '100%', height: '100%' }"
    :gap="10"
  >
    <masonry-flow-item :height="300" class="item" v-for="i in 10" :key="i">{{
      i
    }}</masonry-flow-item>
    <masonry-flow-item class="item" :height="300">
      <div>1</div>
      <div>2</div>
    </masonry-flow-item>
    <masonry-flow-item class="item" :height="300">2</masonry-flow-item>
    <masonry-flow-item class="item" :height="300">3</masonry-flow-item>
  </masonry-flow-root>
</template>

<style scoped>
.root {
  width: 100%;
  background: #eee;
}
.item {
  width: 0;
  background: #aaa;
  border-radius: 20px;
  border: 1px solid #333;
}
</style>
