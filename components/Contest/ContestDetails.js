import clsx from "clsx";
import { Interweave } from "interweave";
import Button from "../Generic/Button";

const ContestDetails = ({ contest, warning, status, disabled }) => {
	return (
		<div>
			<h2 className="h4">Contest Details</h2>
			<Interweave content={contest.description} />
			<div className="mt-16 text-red-600">{warning.message}</div>
			<div className="mt-4">
				<Button
					variant={clsx(status === 1 ? "warning" : "primary")}
					onClick={() => participate()}
					disabled={disabled}
				>
					{status === 1
						? "Continue"
						: status === 2
						? "View Results"
						: "Participate"}
				</Button>
			</div>
		</div>
	);
};

export default ContestDetails;
