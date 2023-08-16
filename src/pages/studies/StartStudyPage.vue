<script setup lang="ts">
import { storeToRefs } from 'pinia'

const studiesStore = useStudiesStore()
const { currentStudy, studyQuestions } = storeToRefs(studiesStore)

// TODO: check if started
// TODO: if started go to first unanswered question

/**
 * Takes the user to the answer flow
 */
function goToQuestions() {
  const s = currentStudy.value
  if (!s.questions || s.questions.length === 0) return
  router.push({ path: `/studies/${s.id}/answer/questions` })
}
</script>

<template>
  <h2 class="text-h4">{{ currentStudy?.title }}</h2>
  <v-divider class="my-4" />
  <p class="text-body-1"><strong>Detalii studiu:</strong> {{ currentStudy?.details }}</p>

  <p class="text-body-1 my-4">
    <strong>Info:</strong> Ati ales sa raspundeti la studiul
    <strong>{{ currentStudy?.title }}</strong
    >. Acesta are {{ studyQuestions?.length }} intrebari. Daca nu il terminati intr-o sesiune,
    progresul se va salva si puteti continua alta data. Pentru a incepe, apasati pe butonul
    <strong>Start</strong> si raspundeti la intrebarile care apar. Pentru a raspunde la o intrebare,
    alegeti varianta sau completati raspunsul si apasati pe butonul
    <strong>Urmatoarea</strong> pentru a trece la intrebarea urmatoare. Cand vreti sa incheiati,
    apasati pe butonul <strong>Incheie</strong>, iar raspunsurile se vor salva in baza de date.
  </p>

  <v-card class="my-4" variant="flat" color="error">
    <v-card-text>
      <p class="text-body-1">
        <strong>
          ATENTIE! Daca iesiti de pe pagina intrebarii fara sa apasati pe "Incheie", raspunsurile nu
          se vor salva si va trebui sa o luati de la capat cand redeschideti studiul.
        </strong>
      </p>
    </v-card-text>
  </v-card>

  <v-btn
    density="default"
    color="primary"
    class="float-right"
    @click="goToQuestions"
    :disabled="!studyQuestions || studyQuestions.length === 0"
    >Start</v-btn
  >
</template>
