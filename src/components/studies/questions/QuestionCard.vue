<script setup lang="ts">
import { CONSTANTS } from '@/constants'
import type { IStudyQuestion } from '@/interfaces/study'

const props = defineProps<{
  question: IStudyQuestion
}>()

/**
 * Deletes a question
 *
 * @param { string } qid
 */
function deleteQuestion(qid: string) {
  useStudiesStore().deleteQuestionFromStudy(qid)
}

/**
 * Triggers a dialog box based on the pressed button
 *
 * @param { string } act The action that triggers the dialog box
 */
function promptAction(act: string) {
  const { triggerDialog, hideDialog } = useDialogStore()

  switch (act) {
    case CONSTANTS.PROMPT_DELETE:
      triggerDialog(
        'Vreti sa stergeti intrebarea?',
        [hideDialog, deleteQuestion],
        [
          {
            text: 'Nu',
            color: 'error-container'
          },
          {
            text: 'Da',
            color: 'secondary',
            actionParams: [props.question.id]
          }
        ]
      )
      break
    default:
      break
  }
}
</script>

<template>
  <v-card class="my-2">
    <v-card-item prepend-icon="mdi-help-box-multiple-outline">
      <v-card-title tag="section" class="d-flex align-center justify-space-between">
        <span>{{ question.text }}</span>
        <section class="group-controls">
          <v-btn
            density="comfortable"
            size="small"
            color="error"
            @click="promptAction(CONSTANTS.PROMPT_DELETE)"
            icon
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </section>
      </v-card-title>
    </v-card-item>
  </v-card>
</template>
