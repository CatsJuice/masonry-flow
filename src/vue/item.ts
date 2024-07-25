import {
  computed,
  CSSProperties,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  ref,
  watchEffect,
} from "vue";
import { ItemAdd, ItemRemove, ItemUpdate, MasonryFlowItemProps } from "./type";
import { IMasonryFlowItem } from "../core";

let _internalId = 0;
export const MasonryFlowItem = defineComponent<MasonryFlowItemProps>(
  (props, { slots }) => {
    const addItem = inject<ItemAdd>("addItem");
    const removeItem = inject<ItemRemove>("removeItem");
    const updateItem = inject<ItemUpdate>("updateItem");
    const posStyle = ref<Partial<CSSProperties>>({ display: "none" });

    const id = _internalId++;

    const item = computed<IMasonryFlowItem>(() => ({
      id,
      height: props.height,
      index: props.index ?? id,
      setPos: (pos) => (posStyle.value = { ...pos }),
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
            posStyle.value,
            {
              height: `${props.height}px`,
              position: "absolute",
              transition:
                "all var(--transition-duration) var(--transition-timing)",
            },
          ],
          class: "masonry-flow-root",
        },
        slots.default?.()
      );
  },
  { name: "MasonryFlowItem", props: ["height", "index"] }
);
