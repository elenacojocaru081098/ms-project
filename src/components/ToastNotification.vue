<script setup lang="ts">
import { CONSTANTS } from '@/constants'
import type { IBusToast } from '@/interfaces/bus_events'

const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
const toast = ref<IBusToast>({
  show: false,
  text: '',
  color: ''
})

// trigger toast notification when an event is emitted
busToast.on((e: IBusToast) => {
  toast.value.show = true
  toast.value.text = e.text
  toast.value.color = e.color
})
</script>

<template>
  <article class="text-center">
    <v-snackbar
      v-model="toast.show"
      location="bottom"
      :color="toast.color"
      :timeout="CONSTANTS.NOTIFICATION_TIMEOUT"
    >
      {{ toast.text }}
    </v-snackbar>
  </article>
</template>
