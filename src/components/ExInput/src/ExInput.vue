<template>
  <Input
    class="input"
    :addon-before="props.addonBeforeLabel"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :value="showVal"
  >
    <template #suffix>
      <CloseIcon class="icon" v-if="props.value && props.show" @click="clearEvent" />
      <SearchIcon class="icon" v-if="props.show" @click="searchEvent" style="margin-left: 5px" />
    </template>
  </Input>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Input } from 'ant-design-vue';
  import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons-vue';
  import { isString } from '/@/utils/is';
  const CloseIcon = CloseCircleFilled;
  const SearchIcon = SearchOutlined;
  interface ProType {
    value: any | undefined;
    disabled: boolean;
    placeholder: string;
    addonBeforeLabel?: string;
    show: boolean;
  }
  const props = withDefaults(defineProps<ProType>(), {
    value: undefined,
    disabled: false,
    show: true,
    placeholder: '',
    addonBeforeLabel: '',
  });
  const showVal = computed(() => {
    if (props.value) {
      return isString(props.value) ? props.value : props.value.name ? props.value.name : undefined;
    } else {
      return undefined;
    }
  });
  type Emits = {
    (event: 'search', key: string): void;
    (event: 'clear', key: string): void;
  };
  const emit = defineEmits<Emits>();
  const clearEvent = (key) => {
    emit('clear', key);
  };
  const searchEvent = (key) => {
    emit('search', key);
  };
</script>

<style>
  .icon {
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
  }
</style>
