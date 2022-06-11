import Head from "next/head";

const Meta = ({
	title,
	page,
	desc = "Find practice problems relating to Linear Algebra and Calculus with Differential Equations here!",
	favicon = "/favicon.ico",
}) => {
	const siteTitle = "LADE";

	return (
		<Head>
			{/* 
				Decide the title for the page. Use title to force a custom title,
				or use page for cases like "Web Title | Content Title"
			*/}
			<title>
				{title ? title : page ? `${page} | ${siteTitle}` : siteTitle}
			</title>
			<meta name="description" content={desc} />
			<link rel="icon" href={favicon} />
		</Head>
	);
};

export default Meta;
