import clsx from "clsx";
import Card from "../Generic/Card";
import { ProblemCardSK } from "../Generic/Skeleton";
import ProblemCard from "../Problem/ProblemCard";

const Folder = ({ title, cards, loading }) => {
	return (
		<div>
			<h2 className="text-blue-600 font-bold text-3xl mb-4">{title}</h2>
			<div className="flex flex-col w-full bg-blue-200 p-4 border-dashed border-blue-600 border-2 rounded-lg">
				{loading ? (
					<>
						<ProblemCardSK className="p-4 bg-white" />
						<ProblemCardSK className="p-4 bg-white" />
						<ProblemCardSK className="p-4 bg-white" />
					</>
				) : (
					cards.map((problem, index) => (
						<ProblemCard
							key={problem.id}
							purpose="landing"
							problem={problem}
							className={clsx(index !== 0 && "mt-4")}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default Folder;
