<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive include="Material">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>

<style lang="less" scoped>
  :deep(.vxe-icon--square:before) {
    border-color: #606266 !important;
  }
  :deep(.vxe-toolbar) {
    border-color: #606266 !important;
  }
  :deep(.vxe-icon--zoomout:before, .vxe-icon--zoomout:after) {
    border-color: #606266 !important;
  }
  :deep(.vxe-icon--zoomout:after) {
    border-color: #606266 !important;
  }
  :deep(.vxe-sort--desc-btn) {
    border-color: #c0c4cc;
  }
  :deep(.vxe-sort--asc-btn) {
    border-color: #c0c4cc;
  }
</style>
