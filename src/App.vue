<template>
  <v-layout>
    <v-system-bar class="bg-light-blue-darken-4">
      <v-icon icon="mdi-menu" class="ms-2" @click="drawer = !drawer"></v-icon>
      <v-spacer></v-spacer>
      <span class="ms-2">8-Puzzle Solver</span>
    </v-system-bar>

    <v-navigation-drawer
      v-model="drawer"
      class="bg-light-blue-lighten-5 elevation-5"
      :image="background"
    >
      <v-list>
        <v-list-item
          :prepend-avatar="foto"
          title="Aditya Sudyana"
          subtitle="23222063"
          class="text-light-blue-darken-4"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>
      
      <v-card 
        class="ma-2 rounded"
      >
        <v-card-title class="bg-light-blue-darken-4">
          Playground
        </v-card-title>

        <v-card-text class="bg-light-blue-lighten-5 pt-5">
          <v-btn
            block
            variant="tonal"
            prepend-icon="mdi-shuffle"
            @click="shuffle"
          >
            Shuffle
          </v-btn>
          <v-btn
            block
            variant="tonal"
            prepend-icon="mdi-refresh"
            class="mt-2"
            @click="reset"
          >
            Reset
          </v-btn>
        </v-card-text>

      </v-card>

    </v-navigation-drawer>

    <v-main class="pattern" :style="`background-image: url(${pattern});`">
      <Puzzle></Puzzle>
    </v-main>
  </v-layout>
</template>

<script setup>
import Puzzle from './Puzzle.vue'
import { ref, inject } from 'vue'
import pattern from './assets/pattern.jpeg'
import foto from './assets/foto'
import background from './assets/background.jpeg'

const drawer = ref(true)
const emitter = inject('emitter')
const reset = () => {
  emitter.emit('reset')
}
const shuffle = () => {
  emitter.emit('shuffle')
}
</script>

<style>
html { overflow-y: auto !important }

.pattern{
  background-size:auto auto;
  background-repeat:repeat;
  height: 100vh;
}
</style>


