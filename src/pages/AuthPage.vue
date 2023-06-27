<template>
  <div class="layout-login h-screen d-flex align-center justify-center">
    <v-card class="w-75">
      <v-card-item prepend-icon="mdi-login-variant">
        <v-card-title tag="section">Autentificare</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-form @submit.prevent>
          <v-text-field prepend-inner-icon="mdi-account" label="Utilizator" required />
          <v-text-field type="password" prepend-inner-icon="mdi-lock" label="Parola" required />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn type="submit" append-icon="mdi-arrow-right">Intra in cont</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
