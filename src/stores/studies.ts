import type { IBusToast } from '@/interfaces/bus_events'
import type { IStudy, IStudyQuestion } from '@/interfaces/study'
import { addDoc, collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const useStudiesStore = defineStore(PINIA_STORE_KEYS.STUDIES, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addTimestamps } = useDbInfo()

  const groupsStore = useGroupsStore()
  const { getAllGroups, updateGroupStudies } = groupsStore

  // studies of the current user (creator/member)
  const studies = ref<Array<IStudy>>([])
  const studiesInitialized = ref<boolean>(false)
  fetchCurrentUserStudies()

  // current study we're working on
  const currentStudyIndex = ref<number>(0)
  const currentStudy = computed(() => studies.value[currentStudyIndex.value])

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
    if (!studiesInitialized.value) await fetchCurrentUserStudies()
    return studies.value
  }

  /**
   * Fetches current user's studies
   */
  async function fetchCurrentUserStudies() {
    if (studiesInitialized.value) return

    const groups = await getAllGroups()
    const studiesIds: Array<string> = []

    groups.forEach((g) => studiesIds.push(...g.studies))
    await getStudiesByIdList(studiesIds)
    studiesInitialized.value = !!studies.value
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
   */
  async function createStudy(study: IStudy, gid: string) {
    try {
      const s = await addDoc(collection(db, 'studies'), {
        title: study.title,
        details: study.details,
        questions: study.questions,
        ...addTimestamps()
      })

      updateGroupStudies(gid, [s.id])

      router.push({ path: '/studies' })

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

  // TODO: implement this
  async function updateStudy() {}

  /**
   * Adds a question to the current study's state
   *
   * @param q
   */
  function addQuestionToStudy(q: IStudyQuestion) {
    currentStudy.value.questions.push(q)
  }

  return {
    studies,
    studiesInitialized,
    currentStudy,
    setStudyAsCurrentStudy,
    getAllStudies,
    fetchCurrentUserStudies,
    createStudy,
    updateStudy,
    addQuestionToStudy
  }
})
