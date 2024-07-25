import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  ref,
  watchEffect,
} from "vue";
import { ItemAdd, ItemRemove, ItemUpdate, MasonryFlowItemProps } from "./type";
import { IMasonryFlowItem, IMasonryFlowItemInfo } from "../core";

let _internalId = 0;
export const MasonryFlowItem = defineComponent<MasonryFlowItemProps>(
  (props, { slots }) => {
    const addItem = inject<ItemAdd>("addItem");
    const removeItem = inject<ItemRemove>("removeItem");
    const updateItem = inject<ItemUpdate>("updateItem");
    const info = ref<IMasonryFlowItemInfo>({
      styleMap: {
        display: "none",
        width: "0",
        left: "0",
        top: "0",
        transform: "none",
      },
      show: false,
      width: 0,
      x: 0,
      y: 0,
    });

    const id = _internalId++;

    const item = computed<IMasonryFlowItem>(() => ({
      id,
      height: props.height,
      index: props.index ?? id,
      onUpdate: (v) => v && (info.value = v),
    }));

    addItem?.(item.value);

    onBeforeUnmount(() => {
      removeItem?.(id);
    });

    watchEffect(() => {
      updateItem?.(id, item.value);
    });

    return () =>
      h(
        "div",
        {
          style: [
            info.value.styleMap,
            {
              height: `${props.height}px`,
              position: "absolute",
              transition:
                "all var(--transition-duration) var(--transition-timing)",
            },
          ],
          class: "masonry-flow-root",
          "data-x": info.value.x,
          "data-y": info.value.y,
        },
        slots.default?.()
      );
  },
  { name: "MasonryFlowItem", props: ["height", "index"] }
);
