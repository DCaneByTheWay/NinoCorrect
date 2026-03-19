const keyNeighborDict = getAllNeighbors();

/** returns a dictionary of all neighbors for each key on a qwerty keyboard */
function getAllNeighbors() {
    // keyboard neighbor dictionary
    const keyNeighborDict = {};
    const keyboard = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '['],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '/']
    ];

    // for each row in keyboard
    for (let r = 0; r < keyboard.length; r++) {
        const row = keyboard[r];

        // for each key in row
        for (let c = 0; c < row.length; c++) {
            const key = row[c];

            // iterate through neighboring keys, -1, -1 offset to 1, 1 offset
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {

                    // base cases

                    // current decision to include 6 neighbors instead of 8
                    // it made sense to exclude neighbors further away from key
                    // ex: neighbors '1' and 'd' are excluded from key 'w' as they are on the diagonal
                    // therefore -1, -1 and 1, 1 are excluded

                    if (Math.abs(i + j) === 2) continue;

                    // continue if key is out of bounds of row
                    if (c + i < 0 || c + i >= row.length) continue;

                    // continue if row is out of bounds of keyboard
                    if (r + j < 0 || r + j >= keyboard.length) continue;

                    // continue if neighbor is same as key
                    if (i === 0 && j === 0) continue;

                    // add neighbor to dictionary
                    if (!keyNeighborDict[key]) keyNeighborDict[key] = [];
                    keyNeighborDict[key].push(keyboard[r + j][c + i]);
                }
            }

            // if row is bottom row of keyboard, add space as a neighbor
            if (r === keyboard.length - 1) {
                if (!keyNeighborDict[key]) keyNeighborDict[key] = [];
                keyNeighborDict[key].push(' ');
            }
        }
    }

    // return dict
    return keyNeighborDict;
}

/** returns true or false with a percentSuccess chance to be true */
function getProbabilitySuccess(percentSuccess) {
    return percentSuccess > Math.floor(Math.random() * 100);
}

/** returns random neighbor of key */
function getRandomNeighbor(key) {
    const neighbors = keyNeighborDict[key];
    if (neighbors && neighbors.length > 0) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }
    return key;
}

/** swaps a random letter in the word with a neighboring letter */
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

/** takes input string and returns ninocorrected string */
export function ninocorrect(input, multiplier = 1) {
    // these integers represent the percentage chance that the specific error will occur
    const CHANCE_SWAP = 5 * multiplier;
    const CHANCE_DUPLICATE = 15 * multiplier;
    const CHANCE_NEIGHBOR_SUBSTITUTE = 20 * multiplier;
    console.log(multiplier)

    const lines = input.toLowerCase().split('\n');
    let output = '';

    // for each line
    for (let line of lines) {
        let words = line.split(' ');

        // for each word in line
        for (let word of words) {
            if (!word) continue;

            // swap neighboring letter
            if (getProbabilitySuccess(CHANCE_SWAP)) {
                word = swapNeighboringLetter(word);
            }

            // duplicate letter
            let tempWord = '';
            for (const c of word) {
                tempWord += c;
                if (getProbabilitySuccess(CHANCE_DUPLICATE)) {
                    tempWord += c;
                }
            }

            // subsitute with neighboring key
            for (const c of tempWord) {
                if (getProbabilitySuccess(CHANCE_NEIGHBOR_SUBSTITUTE)) {
                    output += getRandomNeighbor(c);
                } else {
                    output += c;
                }
            }
            output += ' ';
        }
        output += '\n';
    }
    output = output.trim(); // trim output
    return output == '' ? input : output; // ensure that there is output
}