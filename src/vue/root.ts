import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from "vue";
import { ItemAdd, ItemRemove, ItemUpdate, MasonryFlowRootProps } from "./type";
import { calculate, IMasonryFlowItem, IMasonryFlowOptions } from "../core";

export const MasonryFlowRoot = defineComponent<MasonryFlowRootProps>(
  (props, { slots }) => {
    const scrollable = props.scrollable ?? true;
    const transitionDuration = props.transitionDuration ?? 230;
    const transitionTiming = props.transitionTiming ?? "ease";

    const contents = slots.default?.() ?? [];

    const containerRef = ref<HTMLDivElement | null>(null);
    const contentRef = ref<HTMLDivElement | null>(null);
    const items = ref<IMasonryFlowItem[]>([]);
    const sortedItems = computed(() => {
      return [...items.value].sort((a, b) => a.index - b.index);
    });
    const addItem: ItemAdd = (item) => items.value.push(item);
    const removeItem: ItemRemove = (id) =>
      (items.value = items.value.filter((item) => item.id !== id));
    const updateItem: ItemUpdate = (id, item) => {
      const index = items.value.findIndex((item) => item.id === id);
      if (index === -1) return;
      items.value[index] = { ...items.value[index], ...item };
    };

    provide("addItem", addItem);
    provide("removeItem", removeItem);
    provide("updateItem", updateItem);

    let i = 0;
    contents.forEach((vnode) => {
      i++;
      if (Array.isArray(vnode.children)) {
        vnode.children.forEach((vnode) => {
          i++;
          if (!vnode) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((vnode as any).type?.name === "MasonryFlowItem") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (vnode as any).props.index = i;
          }
        });
      }
    });

    const calcOptions = computed(() => {
      return {
        width: props.width,
        gap: props.gap,
        gapX: props.gapX,
        gapY: props.gapY,
        locationMode: props.locationMode,
        strategy: props.strategy,
      } satisfies IMasonryFlowOptions;
    });

    //
    const update = () => {
      const content = contentRef.value;
      const container = containerRef.value;
      if (!container || !content) return;
      const rect = container.getBoundingClientRect();
      const { totalHeight, infoMap } = calculate(
        sortedItems.value,
        rect,
        calcOptions.value
      );
      content.style.height = `${totalHeight}px`;
      sortedItems.value.forEach((item) => {
        const info = infoMap.get(item.id);
        if (!info) return;
        const { styleMap } = info.info;
        item.setPos(styleMap);
      });
    };

    let resizeObserver: ResizeObserver;
    onMounted(() => {
      watch(calcOptions, update, { immediate: true });
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(containerRef.value!);
    });
    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });

    return () =>
      h(
        "div",
        {
          ref: containerRef,
          class: "masonry-flow-root",
          style: {
            position: "relative",
            overflowY: scrollable ? "auto" : undefined,
            "--transition-duration": `${transitionDuration}ms`,
            "--transition-timing": transitionTiming,
          },
        },
        h(
          "div",
          {
            ref: contentRef,
            class: "masonry-flow-content",
          },
          contents
        )
      );
  },
  {
    name: "MasonryFlowRoot",
    props: [
      "width",
      "gap",
      "gapX",
      "gapY",
      "scrollable",
      "transitionDuration",
      "transitionTiming",
      "onScroll",
      "locationMode",
      "strategy",
    ],
  }
);
