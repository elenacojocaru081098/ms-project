import { storeToRefs } from 'pinia'

export function useDbInfo() {
  const { user } = storeToRefs(useUserStore())

  function addCreatedTags() {
    return {
      created_at: new Date().toISOString(),
      created_by: user.value?.id || null
    }
  }

  function addModifiedTags() {
    return {
      modified_at: new Date().toISOString(),
      modified_by: user.value?.id || null
    }
  }

  function addTimestamps() {
    return {
      ...addCreatedTags(),
      ...addModifiedTags()
    }
  }

  return {
    addCreatedTags,
    addModifiedTags,
    addTimestamps
  }
}
