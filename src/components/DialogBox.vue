<script setup lang="ts">
import { storeToRefs } from 'pinia'

const dialogStore = useDialogStore()

const { msg, btns, show } = storeToRefs(dialogStore)
const { invokeAction } = dialogStore
</script>

<template>
  <v-dialog v-model="show">
    <v-card density="compact">
      <v-card-text>{{ msg }}</v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          v-for="(btn, idx) in btns"
          :key="btn.text"
          :color="btn.color"
          density="default"
          variant="flat"
          @click="invokeAction(idx, btn.actionParams)"
        >
          {{ btn.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
