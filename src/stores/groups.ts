import type { IBusToast } from '@/interfaces/bus_events'
import type { IGroup } from '@/interfaces/group'
import type { IUser } from '@/interfaces/user'
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
  const { getParticipantsByIdList } = useUsersStore()

  // groups of the current user
  const groups = ref<Array<IGroup>>([])
  const groupsInitialized = ref<boolean>(false)
  fetchCurrentUserGroups()

  // current group we're working on
  const currentGroupIndex = ref<number>(0)
  const currentGroup = computed(() => groups.value[currentGroupIndex.value])

  /**
   * Gets the groups
   */
  async function getAllGroups() {
    if (!groupsInitialized.value) await fetchCurrentUserGroups()
    return groups.value
  }

  /**
   * Sets a group as the current group
   *
   * @param { string } gid
   */
  function setGroupAsCurrentGroup(gid: string = '') {
    if (gid === '') currentGroupIndex.value = groups.value.length
    else currentGroupIndex.value = groups.value.findIndex((g) => g.id === gid)
  }

  /**
   * Fetches current user's groups
   */
  async function fetchCurrentUserGroups() {
    if (groupsInitialized.value) return
    if (user.value && user.value.role === 'Admin') groups.value.length = 0
    else if (user.value) await fetchUserGroups(user.value)
  }

  /**
   * Fetches the groups of a user
   * If the user's a coordinator, fetches the groups they coordinate
   * otherwise the groups they're a part of
   */
  async function fetchUserGroups(u: IUser) {
    const column: string = u.role === 'Coordinator' ? 'coords' : 'users'

    const q = query(collection(db, 'groups'), where(column, 'array-contains', u.id))

    const qss = await getDocs(q)
    if (groupsInitialized.value) groups.value.length = 0

    qss.forEach((d) => groups.value.push({ id: d.id, ...d.data() } as IGroup))
    groupsInitialized.value = !!groups.value
  }

  /**
   * Gets a group by its id
   *
   * @param { string } gid The db group id
   */
  // function getGroupById(gid: string) {
  //   if (!groupsInitialized.value) fetchCurrentUserGroups()
  //   return groups.value.find((g) => g.id === gid)
  // }

  /**
   * Gets the member's list of the current group
   *
   * @param gid
   */
  async function getCurrentGroupMembers() {
    const memberIds = currentGroup.value.users || []
    const memberList = await getParticipantsByIdList(memberIds)
    return memberList
  }

  /**
   * Gets the list with all participants available to be invited in group
   */
  async function getAvailableParticipants() {
    const memberIds = currentGroup.value?.users || []
    const participants = await getParticipantsByIdList(memberIds, 'not-in')
    return participants
  }

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
      g && groups.value.splice(groups.value.indexOf(g), 1)

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
   * Updates group info
   *
   * @param { IGroup } group
   */
  async function updateGroup(group: IGroup) {
    const g = {
      id: group.id,
      name: group.name,
      users: group.users,
      studies: group.studies,
      ...addModifiedTags()
    }

    try {
      const group = doc(db, 'groups', g.id)
      await updateDoc(group, { ...g })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.GROUP_UPDATED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.GROUP_UPDATED_FAIL,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Changes/Updates a group's studies
   *
   * @param { string } gid The db group id
   * @param { Array<string> } sids Studies ids
   */
  async function updateGroupStudies(gid: string, sids: Array<string>) {
    const g = {
      studies: sids,
      ...addModifiedTags()
    }

    const group = doc(db, 'groups', gid)
    await updateDoc(group, { ...g })
  }

  /**
   * Gets groups that participate in a certain study
   *
   * @param { string } sid
   */
  function getGroupsWithStudy(sid: string) {
    return groups.value.filter((g) => g.studies.includes(sid))
  }

  /**
   * Changes/Updates a group's coordinators
   *
   * @param { string } gid The db group id
   * @param { Array<string> } cids Coordinators ids
   */
  async function updateGroupCoordinators(gid: string, cids: Array<string>) {
    const g = {
      coords: cids,
      ...addModifiedTags()
    }

    try {
      const group = doc(db, 'groups', gid)
      await updateDoc(group, { ...g })

      return true
    } catch (e: any) {
      console.error(e.message)

      return false
    }
  }

  /**
   * Creates a new group
   *
   * @param { IGroup } group
   */
  async function createGroup(group: IGroup) {
    try {
      await addDoc(collection(db, 'groups'), {
        name: group.name,
        users: group.users,
        coords: group.coords,
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
    groupsInitialized,
    currentGroupIndex,
    currentGroup,
    getAllGroups,
    setGroupAsCurrentGroup,
    fetchCurrentUserGroups,
    getCurrentGroupMembers,
    getAvailableParticipants,
    deleteGroupById,
    updateGroup,
    updateGroupStudies,
    getGroupsWithStudy,
    updateGroupCoordinators,
    createGroup
  }
})
