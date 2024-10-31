<!-- v1 -->
<template>
  <div class="ui-checkbox-group-wrapper">
    <VtsLabel v-if="slots.default" :accent>
      <slot />
    </VtsLabel>
    <div class="ui-checkbox-group" :class="{ vertical }">
      <UiCheckbox v-for="(label, index) in labels" :key="index" :accent>
        {{ label }}
      </UiCheckbox>
    </div>
    <VtsInfo v-if="slots.info" :accent>
      <slot name="info" />
    </VtsInfo>
  </div>
</template>

<script setup lang="ts">
import VtsInfo from '@core/components/info/VtsInfo.vue'
import VtsLabel from '@core/components/input/VtsLabel.vue'
import UiCheckbox from '@core/components/ui/checkbox/UiCheckbox.vue'

type CheckboxGroupAccent = 'brand' | 'warning' | 'danger'

defineProps<{
  vertical?: boolean
  accent: CheckboxGroupAccent
  labels: string[]
}>()

const slots = defineSlots<{
  default?(): any
  info?(): any
}>()
</script>

<style scoped lang="postcss">
.ui-checkbox-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .ui-checkbox-group {
    display: flex;
    gap: 6.4rem;

    &.vertical {
      flex-direction: column;
      gap: 0.8rem;
    }
  }
}
</style>
