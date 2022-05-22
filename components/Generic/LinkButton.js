import Link from "next/link";
import Button from "./Button";

const LinkButton = ({ className, href, variant="link", children }) => {
	return (
		<Link href={href} passHref>
			<a>
				<Button className={className} variant={variant}>{children}</Button>
			</a>
		</Link>
	);
};

export default LinkButton;
