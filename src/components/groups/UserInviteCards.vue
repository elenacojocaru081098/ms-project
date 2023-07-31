<script setup lang="ts">
const props = defineProps<{
  users:
    | Array<{
        id: string
        fname: string
        lname: string
        field: string
      }>
    | undefined
  allowInvite: boolean | undefined
}>()

defineEmits(['removeUser', 'addUserToGroup'])

function getKey(user: any) {
  return user.fname + user.lname + user.field
}
</script>

<template>
  <v-card density="compact" v-for="user in props.users" :key="getKey(user)">
    <v-card-item density="compact">
      <v-card-title tag="section" class="d-flex align-center justify-space-between">
        <span>{{ `${user.fname} ${user.lname}` }}</span>
        <section class="card-controls">
          <v-btn
            v-if="allowInvite"
            density="comfortable"
            size="small"
            color="secondary"
            class="mr-2"
            @click="$emit('addUserToGroup', user.id)"
            icon
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-else
            density="comfortable"
            size="small"
            color="error"
            class="mr-2"
            @click="$emit('removeUser', user.id)"
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </section>
      </v-card-title>
      <v-card-subtitle>
        {{ user.field }}
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
