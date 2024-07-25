<script setup lang="ts">
// @ts-nocheck
import { MasonryFlowRoot } from "../../../src/vue/root";
import { MasonryFlowItem } from "../../../src/vue/item";
import { computed, reactive, ref } from "vue";

let _id = 0;
const newItem = () => ({ id: _id++ });

const list = ref(Array.from({ length: 10 }, (_, id) => newItem()));
const states = reactive<Record<number, number>>({});

const count = (id) => (states[id] = (states[id] ?? 0) + 1);
const reorder = () => list.value.sort(() => Math.random() - 0.5);
const remove = (id) => {
  list.value = list.value.filter((item) => item.id !== id);
  delete states[id];
};
const insertBefore = (id) => {
  const index = list.value.findIndex((item) => item.id === id);
  list.value.splice(index, 0, newItem());
};
const insertAfter = (id) => {
  const index = list.value.findIndex((item) => item.id === id);
  list.value.splice(index + 1, 0, newItem());
};
</script>

<template>
  <button @click="reorder">Reorder</button>
  <masonry-flow-root
    :transition-duration="400"
    class="root"
    width="200,300"
    :style="{ width: '100%', height: '100%' }"
    :gap="10"
  >
    <masonry-flow-item
      :height="300"
      class="item"
      v-for="(item, index) in list"
      :key="item.id"
    >
      <div
        class="content"
        :style="{
          background: item.color,
        }"
      >
        {{ item.id }}
        <button @click="() => count(item.id)">
          Count {{ states[item.id] ?? 0 }}
        </button>
        <button @click="remove(item.id)">Remove</button>
        <button @click="() => insertBefore(item.id)">Insert Before</button>
        <button @click="() => insertAfter(item.id)">Insert After</button>
      </div>
    </masonry-flow-item>
  </masonry-flow-root>
</template>

<style scoped>
.root {
  width: 100%;
}
.item {
  width: 0;
  border-radius: 20px;
  border: 1px solid #333;
  overflow: hidden;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #eee;
  animation: shine 0.3s ease 0s 1 normal backwards;
}
@keyframes shine {
  0% {
    background: #ff000060;
  }
  50% {
    background: #ff000090;
  }
  100% {
    background: #ff000060;
  }
}
</style>
