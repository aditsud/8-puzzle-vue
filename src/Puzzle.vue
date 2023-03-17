<template>
  <div class="puzzle mx-auto text-center row text-blue-darken-4">
    <div :class="checkClass(0,0)" id="block00" @click="moveBlock(0,0)">{{ getValue(0,0) }}</div>
    <div :class="checkClass(0,1)" id="block01" @click="moveBlock(0,1)">{{ getValue(0,1) }}</div>
    <div :class="checkClass(0,2)" id="block02" @click="moveBlock(0,2)">{{ getValue(0,2) }}</div>
    <div :class="checkClass(1,0)" id="block10" @click="moveBlock(1,0)">{{ getValue(1,0) }}</div>
    <div :class="checkClass(1,1)" id="block11" @click="moveBlock(1,1)">{{ getValue(1,1) }}</div>
    <div :class="checkClass(1,2)" id="block12" @click="moveBlock(1,2)">{{ getValue(1,2) }}</div>
    <div :class="checkClass(2,0)" id="block20" @click="moveBlock(2,0)">{{ getValue(2,0) }}</div>
    <div :class="checkClass(2,1)" id="block21" @click="moveBlock(2,1)">{{ getValue(2,1) }}</div>
    <div :class="checkClass(2,2)" id="block22" @click="moveBlock(2,2)">{{ getValue(2,2) }}</div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { reset, shuffle } from './assets/algoritma';

const emitter = inject('emitter')

// representasi block dalam array 2 dimensi
const blocks = ref([
  [1,2,3],
  [4,5,6],
  [7,8,0]
])

// fungsi untuk menampilkan angka yang ada di indeks ke-x dan ke-y
const getValue = (x,y) => {
  let value = blocks.value[x][y];
  return value === 0 ? '' : value
}

// fungsi untuk memberikan nama class pada block yang ada di indeks ke-x dan ke-y
const checkClass = (x,y) => {
  let value = blocks.value[x][y];
  return  value === 0 ? 'empty' : 'block'
}

// fungsi untuk mencari index x dan y pada block kosong
const emptyBlockIndex = () => {
  // mengambil lokasi x,y dari blok kosong
  let x0 = null;
  let y0 = null;
  for(let i=0; i<blocks.value.length; i++)
    for(let j=0; j<blocks.value[i].length; j++)
      if(blocks.value[i][j]===0){
        x0 = i;
        y0 = j;
        break;
      }
  return { x0, y0 }
}

const loading = ref(false); // untuk indikator yang menyatakan bahwa block sedang digerakkan

// fungsi untuk menggerakkan block jika diklik
const moveBlock = (x,y, withAnimation=true) => {
  let value = blocks.value[x][y];

  // jika yang diklik adalah blok kosong, maka tidak terjadi apa-apa
  if(value===0) return;

  // mengambil lokasi x,y dari blok kosong
  let {x0, y0} = emptyBlockIndex()

  // memeriksa apakah block kosong bertetanggaan dengan block yang dipilih
  let tetangga = '';
  if(x0-1===x && y0===y) tetangga = 'down'; // artinya block kosong berada tepat di bawah block yang dipilih
  else if(x0+1===x && y0===y) tetangga = 'up'; // artinya block kosong berada tepat di atas block yang dipilih
  else if(x0===x && y0-1===y) tetangga = 'right'; // artinya block kosong berada tepat di kanan block yang dipilih
  else if(x0===x && y0+1===y) tetangga = 'left'; // artinya block kosong berada tepat di kiri block yang dipilih

  // jika block dipilih bukan tetangga block kosong, maka tidak terjadi apa-apa
  if(tetangga==='') return; 
  
  
  if(withAnimation === true){ // jika menggunakan animasi
    // memberi animasi perpindahan block dipilih menuju block kosong
    let elementBlockDipilih = document.getElementById(`block${x}${y}`)
    elementBlockDipilih.classList.add(`move-${tetangga}`);

    loading.value = true;
    setTimeout(() => {
      elementBlockDipilih.classList.remove('moving', 'move-left', 'move-right', 'move-up', 'move-down');
      // menaruh angka yang ada pada indeks x,y ke dalam indeks x0, y0
      blocks.value[x0][y0] = value;
      // menaruh block kosong pada indeks x,y
      blocks.value[x][y] = 0;
      loading.value = false;
    }, 100);
  }else{
    // menaruh angka yang ada pada indeks x,y ke dalam indeks x0, y0
    blocks.value[x0][y0] = value;
    // menaruh block kosong pada indeks x,y
    blocks.value[x][y] = 0;
  }
  

  
}

// untuk capture arrow key supaya lebih mudah menggerakkan block
document.onkeydown = (e) => {
  e = e || window.event;
  if(e.keyCode < 37 || e.keyCode > 40 || loading.value) return;

  // mengambil lokasi x,y dari blok kosong
  let {x0, y0} = emptyBlockIndex()

  if (e.keyCode === 38) { // tombol atas dipencet
    // cek apakah ada block di bawah block kosong yang bisa diangkat ke atas
    if(x0 + 1 > blocks.value.length - 1 || x0 + 1 < 0) return;
    moveBlock(x0 + 1, y0)
  } else if (e.keyCode === 40) { // tombol bawah dipencet
    // cek apakah ada block di atas block kosong yang bisa turunin ke bawah
    if(x0 - 1 > blocks.value.length - 1 || x0 - 1< 0) return;
    moveBlock(x0 - 1, y0)
  } else if (e.keyCode === 37) { // tombol kiri dipencet
    // cek apakah ada block di kanan block kosong yang bisa dipindah ke kiri
    if(y0 + 1 > blocks.value[x0].length - 1 || y0 + 1 < 0) return;
    moveBlock(x0 , y0 + 1)
  } else if (e.keyCode === 39) { // tombol kanan dipencet
    // cek apakah ada block di kiri block kosong yang bisa dipindah ke kanan
    if(y0 - 1 > blocks.value[x0].length - 1 || y0 - 1 < 0) return;
    moveBlock(x0 , y0 - 1)
  }
}

emitter.on('reset', () => {
  blocks.value = [
    [1,2,3],
    [4,5,6],
    [7,8,0]
  ]
})

emitter.on('shuffle', () => {
  for(let i=0; i<100; i++){ // jumlah iterasi untuk mengacak

    // memilih arah untuk memindahkan block kosong
    let randomBetween0and3 = Math.floor(Math.random() * (3 - 0 + 1) + 0);
    let availableMove = ['up', 'down', 'left', 'right']
    let choosenMove = availableMove[randomBetween0and3];

    // mengambil lokasi x,y dari blok kosong
    let {x0, y0} = emptyBlockIndex()

    if (choosenMove === 'up') { 
      // cek apakah ada block di bawah block kosong yang bisa diangkat ke atas
      if(!(x0 + 1 > blocks.value.length - 1 || x0 + 1 < 0))
        moveBlock(x0 + 1, y0, false)
    } else if (choosenMove === 'down') { 
      // cek apakah ada block di atas block kosong yang bisa turunin ke bawah
      if(!(x0 - 1 > blocks.value.length - 1 || x0 - 1< 0))
        moveBlock(x0 - 1, y0, false)
    } else if (choosenMove === 'left') { 
      // cek apakah ada block di kanan block kosong yang bisa dipindah ke kiri
      if(!(y0 + 1 > blocks.value[x0].length - 1 || y0 + 1 < 0))
        moveBlock(x0 , y0 + 1, false)
    } else if (choosenMove === 'right') {
      // cek apakah ada block di kiri block kosong yang bisa dipindah ke kanan
      if(!(y0 - 1 > blocks.value[x0].length - 1 || y0 - 1 < 0))
        moveBlock(x0 , y0 - 1, false)
    }
  }
})

</script>

<style>
.puzzle {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 300px;
  height: 300px;
  margin: auto;
  margin-top: 100px;
  border: 1px solid #00579B;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: #f2f2f2;
  padding-left: 1px;
  padding-top: 1px;
  padding-bottom: 1px;
}

.block {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  user-select: none;
  background-color: #ffffff;
  width: calc((100%) - 1px);
  border: 1px solid #00579B;
}

.empty {
  background-color: #f2f2f2;
}

.move-left {
  transform: translateX(-100%);
}

.move-right {
  transform: translateX(100%);
}

.move-up {
  transform: translateY(-100%);
}

.move-down {
  transform: translateY(100%);
}

</style>