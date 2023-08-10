<script setup lang="ts">
import { storeToRefs } from 'pinia'

const studyId = ref<string>()

const studiesStore = useStudiesStore()
const { setCurrentQuestionIndex } = studiesStore
const { currentQuestionIndex, currentQuestion, currentStudy } = storeToRefs(studiesStore)

// todo: fix route to questions
// todo: prev/next buttons
// todo: finish button
// todo: question text
// todo: answer fields

/**
 * Goes to previous question
 */
function prevQuestion() {
  let newIdx = currentQuestionIndex.value - 1
  if (newIdx < 0) newIdx = 0

  setCurrentQuestionIndex(newIdx)
}

/**
 * Goes to next question
 */
function nextQuestion() {
  let newIdx = currentQuestionIndex.value + 1
  if (newIdx > currentStudy.value.questions.length - 1)
    newIdx = currentStudy.value.questions.length - 1

  setCurrentQuestionIndex(newIdx)
}

onBeforeMount(() => {
  studyId.value = router.currentRoute.value.params.studyId as string
})
</script>

<template>
  <v-sheet color="primary-container" class="px-4 py-2" rounded>
    <h2 class="text-h5">{{ currentQuestion?.text }}</h2>
  </v-sheet>
  <section class="d-flex align-center justify-space-between">
    <v-btn density="default" color="secondary-container" @click="prevQuestion">Precedenta</v-btn>
    <v-btn density="default" color="secondary-container" @click="nextQuestion">Urmatoarea</v-btn>
    <v-btn density="default" class="add-btn" color="primary-container" @click="saveAnswers"
      >Incheie</v-btn
    >
  </section>
</template>
