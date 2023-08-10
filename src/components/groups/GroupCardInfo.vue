<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { currentGroup } = storeToRefs(useGroupsStore())
const { user } = storeToRefs(useUserStore())
const { hasCoordinatorRights } = useUserPermission()
</script>

<template>
  <p class="text-body-2" v-if="hasCoordinatorRights(user)">
    {{
      `${currentGroup.users.length} ${
        currentGroup.users.length === 1 ? 'participant' : 'participanti'
      }`
    }}
  </p>
  <p class="text-body-2">
    {{
      `${currentGroup.studies.length} ${currentGroup.studies.length === 1 ? 'studiu' : 'studii'}`
    }}
  </p>
</template>
