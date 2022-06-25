/*
		Given a question type, compare the user's answers
		(obj1) with the answer key (obj2).
	*/
export function compareAnswers(type, obj1, obj2) {
	switch (type) {
		case 0:
			return obj1.string === obj2.string;
		case 1:
			return obj1.choice === obj2.choice;
		case 2:
			// If matrix size doesn't match, immediately return false.
			if (
				obj1.matrix.rows !== obj2.matrix.rows ||
				obj1.matrix.columns !== obj2.matrix.columns
			)
				return false;

			// Else, compare each element.
			for (let j = 0; j < obj1.matrix.rows; j++) {
				for (let i = 0; i < obj1.matrix.columns; i++) {
					if (obj1.matrix.matrix[j][i] !== obj2.matrix.matrix[j][i])
						return false;
				}
			}
			return true;
	}
}
