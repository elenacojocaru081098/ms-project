<script setup lang="ts">
import { storeToRefs } from 'pinia'

const studiesStore = useStudiesStore()
const { currentStudy } = storeToRefs(studiesStore)
const { updateStudy: updateDBStudy } = studiesStore
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
