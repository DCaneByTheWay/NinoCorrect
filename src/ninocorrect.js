// Keyboard neighbor dictionary
function getAllNeighbors() {
  const keyNeighborDict = {};
  const keyboard = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '['],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '/']
  ];

  for (let r = 0; r < keyboard.length; r++) {
    const row = keyboard[r];
    for (let c = 0; c < row.length; c++) {
      const key = row[c];
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (Math.abs(i + j) === 2) continue;
          if (c + i < 0 || c + i >= row.length) continue;
          if (r + j < 0 || r + j >= keyboard.length) continue;
          if (i === 0 && j === 0) continue;
          
          if (!keyNeighborDict[key]) keyNeighborDict[key] = [];
          keyNeighborDict[key].push(keyboard[r + j][c + i]);
        }
      }
      if (r === keyboard.length - 1) {
        if (!keyNeighborDict[key]) keyNeighborDict[key] = [];
        keyNeighborDict[key].push(' ');
      }
    }
  }
  return keyNeighborDict;
}

const keyNeighborDict = getAllNeighbors();

function getProbabilitySuccess(percentSuccess) {
  return percentSuccess > Math.floor(Math.random() * 100);
}

function getNeighbor(key) {
  const neighbors = keyNeighborDict[key];
  if (neighbors && neighbors.length > 0) {
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }
  return key;
}

function swapNeighboringLetter(word) {
  const wordList = word.split('');
  const randomCharPos = Math.floor(Math.random() * wordList.length);

  if (randomCharPos !== wordList.length - 1) {
    const temp = wordList[randomCharPos];
    wordList[randomCharPos] = wordList[randomCharPos + 1];
    wordList[randomCharPos + 1] = temp;
  } else {
    const temp = wordList[randomCharPos];
    wordList[randomCharPos] = wordList[randomCharPos - 1];
    wordList[randomCharPos - 1] = temp;
  }
  return wordList.join('');
}

export function ninocorrect(input, chanceSwap = 5, chanceDuplicate = 15, chanceNeighborSubstitute = 20) {
  const words = input.toLowerCase().split(' ');
  let output = '';

  for (let word of words) {
    if (!word) continue;

    if (getProbabilitySuccess(chanceSwap)) {
      word = swapNeighboringLetter(word);
    }

    let tempWord = '';
    for (const c of word) {
      tempWord += c;
      if (getProbabilitySuccess(chanceDuplicate)) {
        tempWord += c;
      }
    }

    for (const c of tempWord) {
      if (getProbabilitySuccess(chanceNeighborSubstitute)) {
        output += getNeighbor(c);
      } else {
        output += c;
      }
    }
    output += ' ';
  }
  return output.trim();
}