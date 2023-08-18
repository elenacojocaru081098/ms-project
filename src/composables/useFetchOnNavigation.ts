import type { RouteLocationNormalized } from 'vue-router'

export function useFetchOnNavigation() {
  async function fetchStudiesResources(studyId: string | null = null) {
    const studiesStore = useStudiesStore()
    const {
      getAllStudies,
      setStudyAsCurrentStudy,
      fetchCurrentStudyQuestions,
      fetchQuestionsAnswers
    } = studiesStore

    await useGroupsStore().getAllGroups()
    await getAllStudies()

    if (studyId) {
      setStudyAsCurrentStudy(studyId)
      await fetchCurrentStudyQuestions()
      await fetchQuestionsAnswers()
    }
  }

  async function fetchGroupsResources(groupId: string | null = null) {
    const groupsStore = useGroupsStore()
    const { getAllGroups, setGroupAsCurrentGroup } = groupsStore

    await getAllGroups()
    await useStudiesStore().getAllStudies()

    if (groupId) {
      setGroupAsCurrentGroup(groupId)
    }
  }

  function fetchResources(to: RouteLocationNormalized) {
    const path = to.path

    if (path.includes('/studies')) fetchStudiesResources(to.params.studyId as string)
    if (path.includes('/groups')) fetchGroupsResources(to.params.groupId as string)
  }

  return {
    fetchResources
  }
}
