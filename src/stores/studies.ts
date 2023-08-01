import type { IBusToast } from '@/interfaces/bus_events'
import type { IStudy } from '@/interfaces/study'
import { addDoc, collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { defineStore, storeToRefs } from 'pinia'

export const useStudiesStore = defineStore(PINIA_STORE_KEYS.STUDIES, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addTimestamps, addModifiedTags } = useDbInfo()

  const groupsStore = useGroupsStore()
  const { groups, groupsInitialized } = storeToRefs(groupsStore)
  const { fetchCurrentUserGroups } = groupsStore

  // studies of the current user (creator/member)
  const studies = ref<Array<IStudy>>([])

  // current study we're working on
  const currentStudyIndex = ref<number>(0)
  const currentStudy = computed<IStudy>(() => studies.value[currentStudyIndex.value])

  /**
   * Sets a study as the current one
   *
   * @param { string } sid
   */
  function setStudyAsCurrentStudy(sid: string) {
    currentStudyIndex.value = studies.value.findIndex((s) => s.id === sid)
  }

  /**
   * Gets all the studies of the user
   */
  async function getAllStudies() {
    if (!groupsInitialized.value) await fetchCurrentUserGroups()
    if (groups.value.length > 0) {
      const studiesIds: Array<string> = []

      groups.value.forEach((g) => studiesIds.push(...g.studies))
      getStudiesByIdList(studiesIds)
    }
  }

  /**
   * Fetches the specified studies from the db
   *
   * @param { Array<string> } sids List of study ids
   */
  async function getStudiesByIdList(sids: Array<string>) {
    if (!sids.length) return []

    const q = query(collection(db, 'studies'), where(documentId(), 'in', sids))
    const qss = await getDocs(q)

    qss.forEach((d) => {
      studies.value.push({
        id: d.id,
        ...d.data()
      } as IStudy)
    })
  }

  /**
   * Creates a new study
   *
   * @param { string } name Name of the study
   * @param { string } details Details of the study
   */
  async function createStudy(name: string, details: string) {
    try {
      await addDoc(collection(db, 'studies'), {
        name,
        details,
        ...addTimestamps()
      })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_CREATED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_CREATED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  return {
    studies,
    currentStudyIndex,
    currentStudy,
    setStudyAsCurrentStudy,
    getAllStudies,
    createStudy
  }
})
