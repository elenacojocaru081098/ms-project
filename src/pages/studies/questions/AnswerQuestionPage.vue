<script setup lang="ts">
import type { IAnswerOptions, IAnswerRange } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const studyId = ref<string>()
const studiesStore = useStudiesStore()
const { setCurrentQuestionIndex, addAnswer, addAnswersToDB } = studiesStore
const { currentQuestionIndex, currentQuestion, currentStudy } = storeToRefs(studiesStore)
const answer = ref<string | number>()
const multipleAnswer = ref<Array<string>>([])

/**
 * Saves answers in the local store state
 */
function saveLocalAnswer() {
  addAnswer({
    question: currentQuestion.value.id!,
    answer:
      currentQuestion.value.answer_type === 'multiple' ? [...multipleAnswer.value] : answer.value!
  })
}

/**
 * Goes to previous question
 */
function prevQuestion() {
  if (answer.value || multipleAnswer.value.length > 0) saveLocalAnswer()

  let newIdx = currentQuestionIndex.value - 1

  if (newIdx < 0) {
    newIdx = 0
    return
  }

  setCurrentQuestionIndex(newIdx)
  answer.value = undefined
  multipleAnswer.value.length = 0
}

/**
 * Goes to next question
 */
function nextQuestion() {
  if (answer.value || multipleAnswer.value.length > 0) saveLocalAnswer()

  let newIdx = currentQuestionIndex.value + 1

  if (newIdx > currentStudy.value.questions.length - 1) {
    newIdx = currentStudy.value.questions.length - 1
    return
  }

  setCurrentQuestionIndex(newIdx)
  answer.value = undefined
  multipleAnswer.value.length = 0
}

/**
 * Checks if the value's in range
 */
function checkRangeValue() {
  const min = (currentQuestion.value.values! as IAnswerRange).min
  const max = (currentQuestion.value.values! as IAnswerRange).max

  // if not explicitly casting min and max as numbers they come as strings
  // this makes the ifs fail. wtf tho?!
  if ((answer.value as number) < (min as number)) answer.value = min
  else if ((answer.value as number) > (max as number)) answer.value = max
}

/**
 * Saves answers to db
 */
function saveAnswers() {
  if (answer.value || multipleAnswer.value.length > 0) saveLocalAnswer()
  addAnswersToDB()

  router.push({ path: '/dashboard' })
}

onBeforeMount(() => {
  studyId.value = router.currentRoute.value.params.studyId as string
})
</script>

<template>
  <section class="d-flex align-center justify-space-between">
    <v-btn density="default" color="secondary-container" @click="prevQuestion">Precedenta</v-btn>
    <v-btn density="default" color="secondary-container" @click="nextQuestion">Urmatoarea</v-btn>
    <v-btn density="default" class="add-btn" color="primary-container" @click="saveAnswers">
      Incheie
    </v-btn>
  </section>
  <v-sheet color="primary-container" class="px-4 py-2 my-4" rounded>
    <h2 class="text-h5">{{ currentQuestion?.text }}</h2>
  </v-sheet>
  <v-sheet rounded>
    <!-- if text answer -->
    <v-textarea
      v-if="currentQuestion?.answer_type === 'text'"
      label="Raspuns..."
      v-model="answer"
      variant="solo-filled"
      color="primary"
      hide-details
    />

    <!-- if slider answer -->
    <v-slider
      v-else-if="currentQuestion?.answer_type === 'range'"
      v-model="answer"
      class="align-center"
      :min="(currentQuestion?.values as IAnswerRange).min"
      :max="(currentQuestion?.values as IAnswerRange).max"
      color="primary"
      step="0.1"
      hide-details
    >
      <template v-slot:append>
        <v-text-field
          class="slider-input"
          v-model.number="answer"
          type="number"
          :min="(currentQuestion?.values as IAnswerRange).min"
          :max="(currentQuestion?.values as IAnswerRange).max"
          density="compact"
          variant="solo-filled"
          color="primary"
          @change="checkRangeValue"
          hide-details
        />
        <span class="ml-2">{{ (currentQuestion?.values as IAnswerRange).unit }}</span>
      </template>
    </v-slider>

    <!-- if unique answer -->
    <v-radio-group v-else-if="currentQuestion?.answer_type === 'unique'" v-model="answer">
      <v-radio
        v-for="option in (currentQuestion?.values as IAnswerOptions).options"
        :key="option"
        :value="option"
        :label="option"
        color="secondary"
      />
    </v-radio-group>

    <!-- if multiple answer -->
    <section v-else-if="currentQuestion?.answer_type === 'multiple'">
      <v-checkbox
        v-for="option in (currentQuestion?.values as IAnswerOptions).options"
        v-model="multipleAnswer"
        :key="option"
        :value="option"
        :label="option"
        color="secondary"
        hide-details
      />
    </section>
  </v-sheet>
</template>

<style lang="scss">
.slider-input {
  width: 70px;
}
</style>
