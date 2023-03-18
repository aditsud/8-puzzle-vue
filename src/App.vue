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
          Status
        </v-card-title>

        <v-card-text class="bg-light-blue-lighten-5 pt-5">
          {{ status }}
        </v-card-text>

      </v-card>
      
      <v-card 
        class="ma-2 mt-5 rounded"
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
            :disabled="loading"
          >
            Shuffle
          </v-btn>
          <v-btn
            block
            variant="tonal"
            prepend-icon="mdi-refresh"
            class="mt-2"
            @click="reset"
            :disabled="loading"
          >
            Reset
          </v-btn>
          <v-btn
            block
            variant="tonal"
            prepend-icon="mdi-fire"
            class="mt-2 bg-red-darken-3"
            @click="solve"
            :disabled="loading"
          >
            Solve!
          </v-btn>
        </v-card-text>

      </v-card>

      <v-card 
        class="ma-2 mt-5 rounded"
      >
        <v-card-title class="bg-light-blue-darken-4">
          Documentation
        </v-card-title>

        <v-card-text class="bg-light-blue-lighten-5 ma-0 pa-2">
          <v-list density="compact" class="pa-0" nav>
            <v-list-item prepend-icon="mdi-github" title="Source Code" href="https://github.com/aditsud/8-puzzle-vue" target="_blank"></v-list-item>
            <v-list-item prepend-icon="mdi-microsoft-powerpoint" title="Slide Presentation" href="https://eight-puzzle-solver.web.app/slide_presentasi.pdf" target="_blank"></v-list-item>
            <v-list-item prepend-icon="mdi-web" title="Demo Application" href="https://eight-puzzle-solver.web.app/" target="_blank"></v-list-item>
          </v-list>
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
const loading = ref(false)
const status = ref('Ready')

const reset = () => {
  emitter.emit('reset')
  status.value = 'Ready'
}
const shuffle = () => {
  status.value = 'Shuffling ...'
  emitter.emit('shuffle')
}
const solve = () => {
  emitter.emit('solve')
}
emitter.on('setLoading', (val)=>{
  loading.value = val
})
emitter.on('setStatus', (val)=>{
  status.value = val
})
</script>

<style>
html { overflow-y: auto !important }

.pattern{
  background-size:auto auto;
  background-repeat:repeat;
  height: 100vh;
}
</style>


