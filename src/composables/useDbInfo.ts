import { storeToRefs } from 'pinia'

/**
 * Exposes functions to deal with various db related stuff
 */
export function useDbInfo() {
  const { user } = storeToRefs(useUserStore())

  /**
   * Inserts created_at and created_by fields
   */
  function addCreatedTags() {
    return {
      created_at: new Date().toISOString(),
      created_by: user.value?.id || null
    }
  }

  /**
   * Inserts modified_at and modified_by fields
   */
  function addModifiedTags() {
    return {
      modified_at: new Date().toISOString(),
      modified_by: user.value?.id || null
    }
  }

  /**
   * Inserts created_at, created_by, modified_at and modified_by fields
   */
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
