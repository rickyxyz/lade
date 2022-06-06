import { BsCheck2Square } from "react-icons/bs";

const Landing = () => {
	const lists = [
		"Post your questions",
		"Answer practice questions",
		"Send questions to other",
	];

	return (
		<section className="pt-16 px-8">
			<h1 class="h1">
				Practice Makes Perfect
			</h1>
			<ul className="mt-4 px-8">
				{lists.map((list) => {
					return (
						<li key={list} className="flex flex-row items-center my-2 text-lg font-medium">
							<BsCheck2Square className="mr-4" />
							{list}
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default Landing;
