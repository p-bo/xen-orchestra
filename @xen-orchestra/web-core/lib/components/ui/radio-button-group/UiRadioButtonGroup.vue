<!-- v1 -->
<template>
  <div class="ui-radio-button-group-wrapper">
    <VtsLabel v-if="slots.default" :accent>
      <slot />
    </VtsLabel>
    <div class="ui-radio-button-group" :class="{ vertical }">
      <UiRadioButton
        v-for="(label, index) in labels"
        :key="index"
        v-model="selectedRadio"
        :accent
        :value="`radio-${index}`"
      >
        {{ label }}
      </UiRadioButton>
    </div>
    <VtsInfo v-if="slots.info" :accent>
      <slot name="info" />
    </VtsInfo>
  </div>
</template>

<script setup lang="ts">
import VtsInfo from '@core/components/info/VtsInfo.vue'
import VtsLabel from '@core/components/input/VtsLabel.vue'
import UiRadioButton from '@core/components/ui/radio-button/UiRadioButton.vue'
import { ref } from 'vue'

export type RadioButtonGroupAccent = 'brand' | 'warning' | 'danger'

defineProps<{
  vertical?: boolean
  accent: RadioButtonGroupAccent
  labels: string[]
}>()

const slots = defineSlots<{
  default?(): any
  info?(): any
}>()

const selectedRadio = ref('')
</script>

<style scoped lang="postcss">
.ui-radio-button-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .ui-radio-button-group {
    display: flex;
    gap: 6.4rem;

    &.vertical {
      flex-direction: column;
      gap: 0.8rem;
    }
  }
}
</style>
