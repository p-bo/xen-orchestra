<!-- v2 -->
<template>
  <div class="ui-toggle-wrapper">
    <div class="typo c4-semi-bold">
      <slot />
    </div>
    <label class="form-toggle" v-bind="wrapperAttrs">
      <input v-model="value" :disabled="isDisabled" type="checkbox" class="ui-toggle" v-bind="attrs" />
      <span class="fake-checkbox" :class="{ busy }">
        <VtsIcon :busy accent="success" :fixed-width="false" :icon class="icon" />
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import VtsIcon from '@core/components/icon/VtsIcon.vue'
import { useContext } from '@core/composables/context.composable'
import { DisabledContext } from '@core/context'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { computed, type HTMLAttributes, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    busy?: boolean
    wrapperAttrs?: HTMLAttributes
  }>(),
  { disabled: undefined }
)

const value = defineModel<boolean>('modelValue')

defineSlots<{
  default(): any
}>()

const attrs = useAttrs()

const isDisabled = useContext(DisabledContext, () => props.disabled)

const icon = computed(() => {
  return faCircle
})
</script>

<style lang="postcss" scoped>
.ui-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 1.6rem;

  .form-toggle {
    position: relative;
    display: flex;

    .fake-checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 4rem;
      background-color: white;
      transition:
        background-color 0.125s ease-in-out,
        border-color 0.125s ease-in-out;
      border: 0.1rem solid var(--color-neutral-txt-secondary);
      border-radius: 9rem;

      .icon {
        font-size: 1.7rem;
        position: absolute;
        color: var(--color-neutral-background-primary);
        border: 0.1rem solid var(--color-neutral-txt-secondary);
        border-radius: 9rem;
        transition: transform 0.125s ease-in-out;
        transform: translateX(-1.02rem);
      }

      &.busy {
        border-color: var(--color-neutral-border);
        background-color: var(--color-neutral-background-disabled);

        .icon {
          color: var(--color-normal-item-base);
          border: 0.1rem solid var(--color-neutral-border);
          background-color: var(--color-neutral-background-primary);
          font-size: 1.4rem;
          transform: translateX(-1.05rem);
        }
      }
    }

    .ui-toggle {
      font-size: inherit;
      position: absolute;
      pointer-events: none;
      opacity: 0;

      &:checked + .fake-checkbox > .icon {
        transform: translateX(1.02rem);
      }

      &:disabled {
        & + .fake-checkbox {
          border-color: var(--color-neutral-border);
          background-color: var(--color-neutral-background-disabled);

          .icon {
            border-color: var(--color-neutral-border);
            color: var(--color-neutral-background-primary);
          }
        }

        &:checked + .fake-checkbox {
          background-color: var(--color-success-item-disabled);
        }
      }

      &:not(:disabled) {
        &:checked + .fake-checkbox {
          border-color: var(--color-neutral-txt-secondary);
          background-color: var(--color-success-item-base);

          &.busy {
            border-color: var(--color-neutral-border);
            background-color: var(--color-success-item-disabled);

            .icon {
              transform: translateX(1.05rem);
            }
          }
        }
      }
    }
  }
}
</style>
