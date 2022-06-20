export function getQuestionType(type) {
	switch(type) {
		case 0:
			return "Short Answer";
		case 1:
			return "Multiple Choice";
		case 2:
			return "Matrix";
		default:
			return "Unknown";
	}
}