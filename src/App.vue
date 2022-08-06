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
