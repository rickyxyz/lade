import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { getData } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { FirebaseContext } from "../firebase";
import clsx from "clsx";
import { MdSearch } from "react-icons/md";
import Button from "./Button";
import LinkButton from "./LinkButton";

const Navbar = ({ loggedIn, loginUser, logoutUser }) => {
	const auth = getAuth();
	const { db } = useContext(FirebaseContext);
	const router = useRouter();

	async function getUserData(uid) {
		await getData(db, `/user/${uid}`)
			.then((result) => {
				console.log(result);
				loginUser(result);
			})
			.catch((e) => {
				console.log(e);
				console.log("Something went wrong");
			});
	}

	async function logout() {
		await signOut(auth).then(() => {
			logoutUser();
			router.push("/");
		});
	}

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			console.log(loggedIn);
			if (user && (!loggedIn || (loggedIn && user.email !== loggedIn.email))) {
				getUserData(user.uid);
			}
		});
	}, [ auth ]);

	return (
		<nav
			className={clsx(
				"flex flex-row items-center justify-between fixed top-0",
				"w-full h-16 px-8",
				"border-b-2 bg-white z-30"
			)}
		>
			<div className="flex items-center mr-4">
				<Link href={ (loggedIn) ? "/problems" : "/" } passHref>
					<a className="flex items-center">
						<Image src="/assets/lade.webp" width="96" height="32" />
					</a>
				</Link>
			</div>
			<div className="flex-grow flex align-center justify-center relative">
				<input
					placeholder="Search"
					className=" w-full h-10 pl-16 pr-8 border-2 rounded-lg"
				/>
				<MdSearch className="absolute left-6 top-2 w-6 h-6 text-gray-500" />
			</div>
			<div className="flex flex-row items-center ml-4">
				{loggedIn ? (
					<>
						<LinkButton
							className="mr-4"
							variant="ghost"
							href="#"
						>
							{ loggedIn.username }
						</LinkButton>
						<Button variant="danger" onClick={() => logout()}>
							Logout
						</Button>
					</>
				) : (
					<>
						<LinkButton
							className="mr-4"
							variant="ghost"
							href="/login"
						>
							Log In
						</LinkButton>
						{/* <div className="w-0.5 h-10 bg-gray-300 mx-4"></div> */}
						<LinkButton variant="primary" href="/register">
							Sign Up
						</LinkButton>
					</>
				)}
			</div>
		</nav>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
