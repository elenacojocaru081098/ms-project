import type { RouteLocationNormalized } from 'vue-router'

export function useFetchOnNavigation() {
  async function fetchStudiesResources(studyId: string | null = null) {
    const studiesStore = useStudiesStore()
    const { getAllStudies, setStudyAsCurrentStudy, fetchCurrentStudyQuestions } = studiesStore

    await getAllStudies()

    if (studyId) {
      setStudyAsCurrentStudy(studyId)
      await fetchCurrentStudyQuestions()
    }
  }

  async function fetchGroupsResources(groupId: string | null = null) {
    const groupsStore = useGroupsStore()
    const { getAllGroups, setGroupAsCurrentGroup } = groupsStore

    await getAllGroups()

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
    fetchResources,
    fetchGroupsResources,
    fetchStudiesResources
  }
}
