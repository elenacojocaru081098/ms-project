<script setup lang="ts">
import { storeToRefs } from 'pinia'

interface INavCard {
  title: string
  subtitle: string
  btnText: string
  btnRoute: string
  color: string
  show: boolean
}

const { user } = storeToRefs(useUserStore())
const { hasCoordinatorRights, isParticipant } = useUserPermission()

const cards: Array<INavCard> = [
  {
    title: 'Adauga utilizator',
    subtitle: 'Creeaza un cont pentru un utilizator nou',
    btnText: 'Creeaza cont',
    btnRoute: '/auth/register',
    color: 'primary-container',
    show: hasCoordinatorRights(user.value)
  },
  {
    title: 'Creeaza grup',
    subtitle: 'Infiinteaza un grup nou de utilizatori',
    btnText: 'Grup nou',
    btnRoute: '/groups/create',
    color: 'secondary-container',
    show: hasCoordinatorRights(user.value)
  },
  {
    title: 'Incepe studiu',
    subtitle: 'Creeaza un nou studiu de grup',
    btnText: 'Adauga studiu',
    btnRoute: '/studies/create',
    color: 'tertiary-container',
    show: hasCoordinatorRights(user.value)
  },
  {
    title: 'Vezi grupuri',
    subtitle: 'Vezi lista cu grupuri in care esti inclus',
    btnText: 'Lista grupuri',
    btnRoute: '/groups/',
    color: 'secondary-container',
    show: isParticipant(user.value)
  },
  {
    title: 'Vezi studii',
    subtitle: 'Consulta studiile in care esti implicat',
    btnText: 'Lista studii',
    btnRoute: '/studies/all',
    color: 'tertiary-container',
    show: isParticipant(user.value)
  }
]
</script>

<template>
  <section v-for="card in cards" :key="card.title">
    <v-card v-show="card.show" :color="card.color" class="my-4">
      <v-card-title class="text-h6">{{ card.title }}</v-card-title>
      <v-card-subtitle class="text-body-1 my-2">{{ card.subtitle }}</v-card-subtitle>
      <v-card-actions class="justify-end">
        <v-btn @click="$router.push({ path: card.btnRoute })">{{ card.btnText }}</v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>
