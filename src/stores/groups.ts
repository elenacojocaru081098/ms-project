import type { IBusToast } from '@/interfaces/bus_events'
import type { IGroup } from '@/interfaces/group'
import {
  doc,
  deleteDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore'
import { storeToRefs, defineStore } from 'pinia'

export const useGroupsStore = defineStore(PINIA_STORE_KEYS.GROUPS, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addTimestamps, addModifiedTags } = useDbInfo()
  const { user } = storeToRefs(useUserStore())

  // groups of the current user
  const groups = ref<Array<IGroup>>([])

  /**
   * Fetches current user's groups
   */
  function fetchCurrentUserGroups() {
    if (user.value && user.value.role === 'Admin') groups.value.length = 0
    else if (user.value) fetchUserGroups()
  }

  /**
   * Fetches the groups of the current user
   * If the user's a coordinator, fetches the groups the coordinate
   * otherwise the groups they're a part of
   */
  async function fetchUserGroups() {
    const column: string = user.value!.role === 'Coordinator' ? 'coords' : 'users'

    const q = query(collection(db, 'groups'), where(column, 'array-contains', user.value!.id))

    const qss = await getDocs(q)
    if (groups.value.length) groups.value.length = 0

    qss.forEach((d) => groups.value.push({ id: d.id, ...d.data() } as IGroup))
  }

  /**
   * Gets a group by its id
   *
   * @param { string } gid The db group id
   */
  // async function getGroupById(gid: string) {
  //   return groups.value.find((g) => g.id === gid)
  // }

  /**
   * Deletes a group by its id (hard)
   *
   * @param { string } gid The db group id
   */
  async function deleteGroupById(gid: string) {
    try {
      const group = doc(db, 'groups', gid)
      await deleteDoc(group)

      const g = groups.value.find((g) => g.id === gid)
      g && groups.value.splice(groups.value.indexOf(g))

      busToast.emit({
        text: NOTIFICATION_MESSAGES.GROUP_DELETED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.GROUP_DELETED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Changes/Updates a group's coordinators
   *
   * @param { string } gid The db group id
   * @param { Array<string> } cids Coordinators ids
   */
  async function updateGroupCoordinators(gid: string, cids: Array<string>) {
    const g = {
      coordinators: cids,
      ...addModifiedTags()
    }

    try {
      const group = doc(db, 'groups', gid)
      await updateDoc(group, { ...g })

      // update in store as well
      groups.value.forEach((g) => {
        if (g.id !== gid) return
        g.coords = [...cids]
      })

      return true
    } catch (e: any) {
      console.error(e.message)

      return false
    }
  }

  /**
   * Creates a new group
   *
   * @param { string } name
   */
  async function createGroup(name: string) {
    try {
      await addDoc(collection(db, 'groups'), {
        name,
        coords: [user.value?.id],
        ...addTimestamps()
      })

      router.push({ path: '/groups' })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.GROUP_CREATED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.GROUP_CREATED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  return {
    groups,
    fetchCurrentUserGroups,
    deleteGroupById,
    updateGroupCoordinators,
    createGroup
  }
})
