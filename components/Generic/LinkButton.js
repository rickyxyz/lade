import Link from "next/link";
import Button from "./Button";

const LinkButton = ({ href, children }) => {
	return (
		<Link href={href} passHref>
			<a>
				<Button variant="link">{children}</Button>
			</a>
		</Link>
	);
};

export default LinkButton;
