export function parseMatrixSize(matrix: (string | number)[][]) {
  let maxLength = 0;
  let maxHeight = 0;

  if (!matrix || typeof matrix !== "object") return [0, 0];

  for (let y = 0; y < 3; y++) {
    if (matrix[y].some((cell) => cell !== "")) {
      maxHeight = Math.max(maxHeight, y + 1);
    }
    for (let x = 0; x < 3; x++) {
      if (matrix[y][x] !== "") {
        maxLength = Math.max(maxLength, x + 1);
      }
    }
  }

  return [maxHeight, maxLength];
}

export function parseMatrixCellWithValues(matrix: (string | number)[][]) {
  const [height, length] = parseMatrixSize(matrix);

  const result = [];

  for (let y = 0; y < height - 1; y++) {
    const row = [];
    for (let x = 0; x < length - 1; x++) {
      row.push(matrix[y][x]);
    }
    result.push(row);
  }

  return result;
}
