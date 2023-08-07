<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'
import type { IAnswerOptions, IAnswerRange, IStudyQuestion } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  formFields: Array<IFormField>
}>()

const valid = ref<boolean>(false)
const studiesStore = useStudiesStore()
const { currentStudy, studiesInitialized } = storeToRefs(studiesStore)
const { addQuestionToStudy, fetchCurrentUserStudies, setStudyAsCurrentStudy } = studiesStore

const answerType = ref<string>('')
const formStructure = useFormStructure()
const answerFields = ref<Array<IFormField>>(formStructure.getAdditionalQuestionFields())

/**
 * Based on the selected answer type retrieves the fields
 * needed to fill in the answer options
 *
 * @param { 'range' | 'unique' | 'multiple' | 'text' } answer_type
 */
function getAnswerFields(answer_type: 'range' | 'unique' | 'multiple' | 'text' = 'text') {
  answerFields.value = formStructure.getAdditionalQuestionFields(answer_type)
  answerType.value = answer_type
}

/**
 * Iterates through the fields and adds the question to the state
 */
function addQuestion() {
  if (!valid.value) return

  // sets the question fields
  let q: IStudyQuestion = {
    id: '',
    text: '',
    answer_type: 'text'
  }

  props.formFields.forEach((f) => {
    q[f.key] = f.value
  })

  // sets the "values" property (answer options)
  q.values =
    answerType.value === 'range'
      ? ({ min: 0, max: 0, unit: '' } as IAnswerRange)
      : answerType.value !== 'text'
      ? ({ options: [] } as IAnswerOptions)
      : undefined

  q.values &&
    answerFields.value.forEach((af) => {
      if (Object.prototype.hasOwnProperty.call(q.values, 'options')) {
        q.values!.options.push(af.value)
      } else if (Object.prototype.hasOwnProperty.call(q.values, 'unit')) {
        q.values[af.key] = af.value
      }
    })

  addQuestionToStudy(q)

  props.formFields.forEach((f) => (f.value = f.key === 'select' ? null : ''))
  answerFields.value = formStructure.getAdditionalQuestionFields()
}

onBeforeMount(async () => {
  if (!studiesInitialized.value) await fetchCurrentUserStudies()
  setStudyAsCurrentStudy(router.currentRoute.value.params.studyId as string)
})
</script>

<template>
  {{ currentStudy?.questions }}
  <v-card>
    <v-card-item prepend-icon="mdi-help-box-multiple-outline">
      <v-card-title tag="section">Creeaza o intrebare</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-form
        id="question-form"
        @submit.prevent="addQuestion"
        validate-on="blur"
        v-model:model-value="valid"
      >
        <section v-for="(field, idx) in formFields" :key="idx">
          <v-textarea
            v-if="field.type === 'textarea'"
            :label="field.label"
            v-model="field.value"
            variant="solo-filled"
            color="primary"
          />
          <v-autocomplete
            v-if="field.type === 'select'"
            :label="field.label"
            :items="field.items"
            item-title="title"
            item-value="value"
            v-model="field.value"
            variant="solo-filled"
            color="on-background"
            theme="light"
            @update:model-value="getAnswerFields(field.value || '')"
          />
        </section>
        <section class="answer_fields" v-if="answerFields.length > 0">
          <v-text-field
            v-for="(af, idx) in answerFields"
            :key="idx"
            :label="af.label"
            v-model="af.value"
            variant="solo-filled"
            color="primary"
          />
          <!-- TODO: add button for multiple options -->
        </section>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn
        form="question-form"
        type="submit"
        append-icon="mdi-help-box-multiple-outline"
        class="px-4"
        color="secondary"
      >
        Alta intrebare
      </v-btn>
      <v-btn
        form="question-form"
        type="button"
        append-icon="mdi-check"
        class="px-4"
        color="primary"
      >
        Salveaza
      </v-btn>
    </v-card-actions>
  </v-card>
</template>