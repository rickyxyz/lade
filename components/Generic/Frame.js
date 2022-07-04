import Meta from "./Meta";
import Side from "./Side";

const Frame = ({ uid, title, page, problem, desc, children }) => {
	const meta = problem ? {
		page: `Edit - ${problem.statement.replace(/\<[^\>]*\>/g, '').slice(0, 24)}...`,
		desc: desc,
	} : {
		title: title,
		page: page,
		desc: desc,
	};

	return (
		<>
			<Meta {...meta} />
			<main className="relative w-full mt-12 pl-64">
				<Side uid={uid} />
				<div className="frame-content relative top-0">
					{ children }
				</div>
			</main>
		</>
	);
};

export default Frame;
