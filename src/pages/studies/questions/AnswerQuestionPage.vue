<script setup lang="ts">
import type { IAnswerOptions, IAnswerRange } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const studiesStore = useStudiesStore()
const { setCurrentQuestionIndex, addAnswer, addAnswersToDB } = studiesStore
const { currentQuestionIndex, currentQuestion, currentStudy, answers, answersFetched } =
  storeToRefs(studiesStore)

const answer = ref<string | number>()
const multipleAnswer = ref<Array<string>>([])
const currentAnswerId = ref<string>()

/**
 * Gets the answer to the current question
 */
const currentQuestionAnswer = computed(() => {
  const currentAnswer = answers.value.find((a) => currentQuestion.value.id === a.question)
  currentAnswerId.value = currentAnswer?.id

  if (currentAnswer) {
    if (currentQuestion.value.answer_type === 'multiple')
      return currentAnswer.answer as Array<string>
    else return currentAnswer.answer as string | number
  }

  return false
})

/**
 * Sets the answer to the value from the db
 */
function setCurrentAnswer() {
  const ans = currentQuestionAnswer.value

  if (ans !== false) {
    if (typeof ans === 'number' || typeof ans === 'string') answer.value = ans as string | number
    else multipleAnswer.value.push(...(ans as Array<string>))
  }
}

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
  if (answer.value || multipleAnswer.value.length > 0 || currentAnswerId.value) saveLocalAnswer()

  let newIdx = currentQuestionIndex.value - 1

  if (newIdx < 0) {
    newIdx = 0
    return
  }

  setCurrentQuestionIndex(newIdx)
  answer.value = undefined
  multipleAnswer.value.length = 0

  setCurrentAnswer()
}

/**
 * Goes to next question
 */
function nextQuestion() {
  if (answer.value || multipleAnswer.value.length > 0 || currentAnswerId.value) saveLocalAnswer()

  let newIdx = currentQuestionIndex.value + 1

  if (newIdx > currentStudy.value.questions.length - 1) {
    newIdx = currentStudy.value.questions.length - 1
    return
  }

  setCurrentQuestionIndex(newIdx)
  answer.value = undefined
  multipleAnswer.value.length = 0

  setCurrentAnswer()
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
  if (answer.value || multipleAnswer.value.length > 0 || currentAnswerId.value) saveLocalAnswer()
  addAnswersToDB()

  router.push({ path: '/dashboard' })
}

function initialize() {
  if (answers.value.length > 0 && answers.value.length !== currentStudy.value?.questions.length) {
    const qIdx = currentStudy.value.questions.findIndex(
      (q) => answers.value.findIndex((a) => q.id === a.question) === -1
    )
    if (qIdx !== -1) setCurrentQuestionIndex(qIdx)
    else setCurrentQuestionIndex(0)
  }

  setCurrentAnswer()
  render.value = true
}

// render component after we've set the starting question
const render = ref<boolean>(answersFetched.value)
watchOnce(answers.value, () => !answersFetched.value && initialize())

onBeforeMount(() => render.value && initialize())
</script>

<template>
  <article v-if="render">
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
  </article>
  <section v-else class="w-screen h-screen d-flex justify-center align-center">
    <v-progress-circular indeterminate :size="100" />
  </section>
</template>

<style lang="scss">
.slider-input {
  width: 70px;
}
</style>
