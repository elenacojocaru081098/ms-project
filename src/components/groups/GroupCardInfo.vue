<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { IGroup } from '@/interfaces/group'

defineProps<{
  group: IGroup
}>()

const { user } = storeToRefs(useUserStore())
const { hasCoordinatorRights } = useUserPermission()
</script>

<template>
  <p class="text-body-2" v-if="hasCoordinatorRights(user)">
    <span v-if="group.users">
      {{
        `${group.users.length} ${
          group.users.length === 1 ? 'participant' : 'participanti'
        }`
      }}
    </span>
  </p>
  <p class="text-body-2">
    <span v-if="group.studies">
      {{
        `${group.studies.length} ${group.studies.length === 1 ? 'studiu' : 'studii'}`
      }}
    </span>
  </p>
</template>
