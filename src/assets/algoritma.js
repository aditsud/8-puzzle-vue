export const solve = async (matriks, matriks_tujuan, withAnimation, iteration, lastNode = null) => { 
  
  // cek, jika matriks awal sudah sama dengan matriks tujuan, maka berhenti
  if(JSON.stringify(matriks.value) === JSON.stringify(matriks_tujuan.value)){
    return;
  }

  // cek indeks block kosong ada dimana
  let { x0, y0 } = emptyBlockIndex(matriks);
  
  // cek kemungkinan block kosong bisa bergerak
  let possibilityMoves = getAllPossibilityMoves(x0, y0, matriks, lastNode);
  
  // menghitung f(n): fungsi heuristik untuk tiap-tiap kemungkinan arah
  // f(n) adalah jumlah block yang salah tempat 
  let possibility_fN = [];
  for(let i=0; i<possibilityMoves.length; i++){
    
    if(possibilityMoves[i] === 'bawah'){
      let temp_matriks = JSON.parse(JSON.stringify(matriks.value)); // clone matriks agar tidak melakukan refers ke matriks sebenarnya
      let value = temp_matriks[x0 + 1][y0]; // angka yang terletak pada block di bawah block kosong
      temp_matriks[x0][y0] = value; // menaruh angka yang ada pada indeks x+1,y ke dalam indeks x0, y0
      temp_matriks[x0 + 1][y0] = 0; // menaruh block kosong pada indeks x,y
      
      // menghitung nilai f(n) atau jumlah block yang kosong pada saat block kosong dipindah ke bawah
      let fN = manhattanDistance(temp_matriks, matriks_tujuan);
      possibility_fN.push({
        direction: possibilityMoves[i],
        fN: fN,
        next_x: x0 + 1,
        next_y: y0
      })
    }else if(possibilityMoves[i] === 'atas'){
      let temp_matriks = JSON.parse(JSON.stringify(matriks.value));
      let value = temp_matriks[x0 - 1][y0];
      temp_matriks[x0][y0] = value;
      temp_matriks[x0 - 1][y0] = 0; 
      
      let fN = manhattanDistance(temp_matriks, matriks_tujuan);
      possibility_fN.push({
        direction: possibilityMoves[i],
        fN: fN,
        next_x: x0 - 1,
        next_y: y0
      })
    }else if(possibilityMoves[i] === 'kanan'){
      let temp_matriks = JSON.parse(JSON.stringify(matriks.value));
      let value = temp_matriks[x0][y0 + 1];
      temp_matriks[x0][y0] = value;
      temp_matriks[x0][y0 + 1] = 0; 
      
      let fN = manhattanDistance(temp_matriks, matriks_tujuan);
      possibility_fN.push({
        direction: possibilityMoves[i],
        fN: fN,
        next_x: x0,
        next_y: y0 + 1
      })
    }else if(possibilityMoves[i] === 'kiri'){
      let temp_matriks = JSON.parse(JSON.stringify(matriks.value));
      let value = temp_matriks[x0][y0 - 1];
      temp_matriks[x0][y0] = value;
      temp_matriks[x0][y0 - 1] = 0; 
      
      let fN = manhattanDistance(temp_matriks, matriks_tujuan);
      possibility_fN.push({
        direction: possibilityMoves[i],
        fN: fN,
        next_x: x0,
        next_y: y0 - 1
      })
    }
  }

  // tentukan arah mana yang memiliki nilai fN terkecil
  // sort possibility_fN berdasarkan fN terkecil
  possibility_fN = possibility_fN.sort(function (a, b) {
    return a.fN - b.fN;
  });

  // hasil sorting kemudian dievaluasi, jika ada lebih dari 1 arah yang f(n) nya sama, maka opssibility moves tersebut dimasukkan ke dalam lowestFn_list
  let lowestFn_list = [];
  let lowestFn = possibility_fN[0].fN;
  lowestFn_list.push(possibility_fN[0])
  for(let i=1; i<possibility_fN.length; i++){
    if(possibility_fN[i].fN===lowestFn)
      lowestFn_list.push(possibility_fN[i])
  }


  let choosenIndex = 0;
  // jika ditemukan lebih dari 1 kemungkinan yang f(n) nya sama, pilih angka random
  if(lowestFn_list.length > 1){
    choosenIndex = Math.floor(Math.random() * ((lowestFn_list.length-1) - 0 + 1) + 0);
  }

  // jika ditemukan lebih dari 1 kemungkinan yang f(n)  nya sama, pilih angka random

  // dan inilah arah yang terpilih
  let choosenDirection = lowestFn_list[choosenIndex];

  // setelah di sort, indeks pertama pada possibility_fN otomatis adalah yang terpilih
  // lalu gerakkan block pada html
  await moveBlock(choosenDirection.next_x, choosenDirection.next_y, matriks, x0, y0, choosenDirection.direction, withAnimation);
  iteration.value++;

  await solve(matriks, matriks_tujuan, withAnimation, iteration, choosenDirection)

}

// fungsi untuk mencari indeks x dan y dari block kosong
export const emptyBlockIndex = (blocks) => {
  // cek lokasi block kosong ada dimana
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

// fungsi untuk melihat kemungkinan arah yang dapat dilakukan pada block kosong
export const getAllPossibilityMoves = (x0, y0, matriks, lastNode) => {
  let possibilityMoves = [];

  if(x0 + 1 <= matriks.value.length - 1) // apakah block kosong bisa pindah ke bawah? (dan memastikan tidak kembali ke block sebelumnya)
    if(lastNode === null || (lastNode !== null && lastNode.direction !=='atas'))
      possibilityMoves.push('bawah')

  if(x0 - 1 >= 0) // apakah block kosong bisa pindah ke atas?
    if(lastNode === null || (lastNode !== null && lastNode.direction !=='bawah'))
      if(!(x0 - 1 === 0 && matriks.value[0][0] === 1 && matriks.value[0][1] === 2 && matriks.value[0][2] === 3)) // khusus ini, jika baris paling atas sudah 1, 2, dan 3, maka block kosong tidak bisa mengambil jalur ke baris pertama
        possibilityMoves.push('atas')

  if(y0 + 1 <= matriks.value[x0].length - 1) // apakah block kosong bisa pindah ke kanan?
    if(lastNode === null || (lastNode !== null && lastNode.direction !=='kiri'))
      possibilityMoves.push('kanan')

  if(y0 - 1 >= 0) // apakah block kosong bisa pindah ke left?
    if(lastNode === null || (lastNode !== null && lastNode.direction !=='kanan')) 
      possibilityMoves.push('kiri')
  
  return possibilityMoves;
}


// fungsi untuk menghitung manhattan distance
export const manhattanDistance = (matriks, matriks_tujuan) => {
  let count = 0;
  for(let i=0; i<matriks.length; i++)
    for(let j=0; j<matriks[i].length; j++)
      if(matriks[i][j] !== matriks_tujuan.value[i][j] && matriks[i][j] !== 0){
        // kalau tidak sama, berarti cek lokasi yang sebenarnya ada dimana dan hitung jaraknya
        let currentValue = matriks[i][j];
        for(let x=0; x<matriks_tujuan.value.length; x++)
          for(let y=0; y<matriks_tujuan.value[x].length; y++)
            if(currentValue === matriks_tujuan.value[x][y]){
              // hitung jaraknya
              count = count + (Math.abs(i - x) + Math.abs(j - y)) 
            }
      }
        
  return count;
}

// untuk menggerakkan block yang ada di htmlnya
export const moveBlock = async (x, y, matriks, x0, y0, direction, withAnimation = true) => {
  return new Promise((resolve) => {
    let value = matriks.value[x][y];
    if(withAnimation === true){ // jika menggunakan animasi
      // memberi animasi perpindahan block dipilih menuju block kosong
      let elementBlockDipilih = document.getElementById(`block${x}${y}`)

      let fillBlockToEmptyBlock = '';
      if(direction==='atas') fillBlockToEmptyBlock = 'down';
      else if(direction==='bawah') fillBlockToEmptyBlock = 'up';
      else if(direction==='kiri') fillBlockToEmptyBlock = 'right';
      else if(direction==='kanan') fillBlockToEmptyBlock = 'left';
      elementBlockDipilih.classList.add(`move-${fillBlockToEmptyBlock}`);

      setTimeout(() => {
        elementBlockDipilih.classList.remove('moving', 'move-left', 'move-right', 'move-up', 'move-down');
        // menaruh angka yang ada pada indeks x,y ke dalam indeks x0, y0
        matriks.value[x0][y0] = value;
        // menaruh block kosong pada indeks x,y
        matriks.value[x][y] = 0;
        resolve()
      }, 100);
    }else{
      // menaruh angka yang ada pada indeks x,y ke dalam indeks x0, y0
      matriks.value[x0][y0] = value;
      // menaruh block kosong pada indeks x,y
      matriks.value[x][y] = 0;
      resolve()
    }
  })
}