<script setup lang="ts">
const props = defineProps<{
  inviteCard: boolean
  users?: any[] | null
  allowInvite?: boolean | undefined
}>()

const emit = defineEmits(['changedUserRole', 'removeUser', 'addUserToGroup'])

const searchTerm = ref<string>('')

const { getFullName } = useUsers()

/**
 * Filters the user based on the search query
 */
const filteredList = computed(() => (list: string) => {
  const search = searchTerm.value.toLowerCase()
  let filtered: any[] = []
  if (!props.users) return []

  if (list === 'users') {
    filtered = props.users.filter((u) => {
      return (
        u.personal_info?.email.includes(search) ||
        u.personal_info?.pnc.includes(search) ||
        u.status?.includes(search) ||
        getFullName(u).toLowerCase().includes(search)
      )
    })
  } else if (list === 'members') {
    filtered = props.users.filter((u) => {
      return (
        (u.field && u.field.toLowerCase().includes(search)) ||
        `${u.fname} ${u.lname}`.toLowerCase().includes(search)
      )
    })
  }

  return filtered || []
})

function emitRemoveUser(uid: string) {
  emit('removeUser', uid)
}

function emitAddUserToGroup(uid: string) {
  emit('addUserToGroup', uid)
}
</script>

<template>
  <section>
    <v-text-field prepend-inner-icon="mdi-magnify" label="Cauta utilizator" v-model="searchTerm" />
    <UserInviteCards
      v-if="inviteCard"
      :users="filteredList('members')"
      :allow-invite="allowInvite"
      @remove-user="emitRemoveUser"
      @add-user-to-group="emitAddUserToGroup"
    />
    <UserCards
      v-else
      :users="filteredList('users')"
      @changed-user-role="$emit('changedUserRole')"
    />
  </section>
</template>
