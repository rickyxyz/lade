export function properifyMatrix(id = "") {
	let matrix = [[null, null, null], [null, null, null], [null, null, null]];
	let rows = 0, cols = 0;

	[0, 1, 2].forEach((row) => {
		[0, 1, 2].forEach((col) => {
			const value = document.getElementById(`cell-${row}-${col}-${id}`).value;
			if(value !== "") {
				if(col + 1 > cols)
					cols = col + 1;
				if(row + 1 > rows)
					rows = row + 1;
			
				matrix[row][col] = value;
			}
		})
	});

	let properMatrix = [];

	for(let j = 0; j < rows; j++) {
		let properRow = [];

		for(let i = 0; i < cols; i++) {
			if(!matrix[j][i])
				matrix[j][i] = 0;

			properRow.push(matrix[j][i]);
		}

		properMatrix.push(properRow);
	}

	console.log(properMatrix);

	if(properMatrix.length === 0) {
		properMatrix.push([ 0 ]);
	}

	return {
		matrix: properMatrix,
		rows: properMatrix.length,
		columns: properMatrix[0].length,
	};
}