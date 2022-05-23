import Head from "next/head";
import Side from "./Side";

const Frame = ({ title, description, children }) => {
	return (
		<>
			<Head>
				<title>{ title }</title>
				<meta
					name="description"
					content={description}
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="relative w-full mt-12 pl-64">
				<Side />
				<div className="frame-content relative top-0">
					{ children }
				</div>
			</main>
		</>
	);
};

export default Frame;
