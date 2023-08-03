<script setup lang="ts">
import { storeToRefs } from 'pinia'

const studiesStore = useStudiesStore()
const { studiesInitialized, currentStudy } = storeToRefs(studiesStore)
const { updateStudy: updateDBStudy, fetchCurrentUserStudies, setStudyAsCurrentStudy } = studiesStore
const formFields = ref(await useFormStructure().getCreateStudyForm())
const { getGroupsWithStudy } = useGroupsStore()

const computedFormFields = computed(() => {
  formFields.value.forEach((f) => {
    if (f.key === 'group') {
      const group = getGroupsWithStudy(currentStudy.value.id)
      f.value = group[0].id
    } else f.value = currentStudy.value[f.key]
  })

  return formFields.value
})

function updateStudy() {
  updateDBStudy()
}

onBeforeMount(async () => {
  if (!studiesInitialized.value) await fetchCurrentUserStudies()
  setStudyAsCurrentStudy(router.currentRoute.value.params.id as string)
})
</script>

<template>
  <StudyForm
    v-if="currentStudy"
    :action="updateStudy"
    title="Editare studiu"
    :form-fields="computedFormFields"
    :new-study="false"
    :study="currentStudy"
  />
</template>
