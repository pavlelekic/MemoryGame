// @flow weak

export default function generateTilesMatrix(size) {
    if (size % 2 !== 0) throw new Error('Size must be divisible by 2!');

    var matrix1d = generate1DMatrixOfPairs(size);
    fisherYatesShuffle(matrix1d);

    return convert1DMatrixTo2D(matrix1d, size);
}

const possibleTileValues = 'ABCDEFGHIJKLMNOPQRSTUWXYZ1234567890';

function generate1DMatrixOfPairs(size) {
    var matrix1d = [];

    for (var i = size * size - 1; i >= 0; i--) {
        matrix1d.push(possibleTileValues[Math.floor(i / size)]);
    }

    return matrix1d;
}

function convert1DMatrixTo2D(matrix1d, size) {
    var rowIndex, columnIndex, matrix2d = {};

    for (var i = matrix1d.length - 1; i >= 0; i--) {
        rowIndex = Math.floor(i / size);
        columnIndex = i % size;

        if (!matrix2d[rowIndex]) {
            matrix2d[rowIndex] = {};
        }

        matrix2d[rowIndex][columnIndex] = matrix1d[i];
    }

    return matrix2d;
}

function fisherYatesShuffle(array) {
    var m = array.length, t, i;

    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}
