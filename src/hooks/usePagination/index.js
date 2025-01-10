import { ref, watch } from 'vue';

export const usePagination = () => {
  const currentPage = ref(1);
  const pageSize = ref(15);
  const pageSizes = ref([15, 30, 60, 100]);
  const total = ref(0);
  let callback = null;

  watch(
    () => [currentPage.value, pageSize.value],
    () => {
      callback ? callback() : null;
    }
  );

  const setPagination = (totalRow, callbackFunction) => {
    total.value = totalRow;
    callback = callbackFunction;
  };

  return {
    currentPage,
    pageSize,
    pageSizes,
    total,
    setPagination,
  };
};
