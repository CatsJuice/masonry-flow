import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  ref,
  watchEffect,
} from "vue";
import { ItemAdd, ItemRemove, ItemUpdate, MasonryFlowItemProps } from "./type";

let _internalId = 0;
export const MasonryFlowItem = defineComponent<MasonryFlowItemProps>(
  ({ height, style, index }, { slots }) => {
    const addItem = inject<ItemAdd>("addItem");
    const removeItem = inject<ItemRemove>("removeItem");
    const updateItem = inject<ItemUpdate>("updateItem");
    const posStyle = ref({ left: "0", top: "0", width: "100%" });

    const id = _internalId++;

    addItem?.({
      id,
      height,
      index: index ?? id,
      setPos: (pos) => {
        posStyle.value = pos;
      },
    });

    onBeforeUnmount(() => {
      removeItem?.(id);
    });

    watchEffect(() => {
      updateItem?.(id, { height });
    });

    return () =>
      h(
        "div",
        {
          style: [
            style,
            posStyle.value,
            {
              height: `${height}px`,
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
  { name: "MasonryFlowItem", props: ["height", "style", "index"] }
);
