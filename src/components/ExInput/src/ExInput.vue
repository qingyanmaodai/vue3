<template>
  <Input
    class="input"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :value="props.value"
    :allowClear="props.allowClear"
  >
    <template #suffix>
      <CloseIcon class="icon" v-if="props.value && !props.show" @click="clearEvent" />
      <SearchIcon class="icon" v-if="!props.show" @click="searchEvent" style="margin-left: 5px" />
    </template>
  </Input>
</template>
<script lang="ts" setup>
  import { Input } from 'ant-design-vue';
  import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons-vue';
  const CloseIcon = CloseCircleFilled;
  const SearchIcon = SearchOutlined;
  const props = defineProps({
    value: String,
    disabled: String,
    placeholder: String,
    allowClear: Boolean,
    show: Boolean,
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
