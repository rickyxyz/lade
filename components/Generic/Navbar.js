import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { getData, FirebaseContext } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import clsx from "clsx";
import { MdSearch } from "react-icons/md";
import Button from "./Button";
import LinkButton from "./LinkButton";
import { genericToast, ToastContext } from "./Toast";

const Navbar = ({ loggedIn, loginUser, logoutUser }) => {
    const auth = getAuth();
    let uid =  auth.currentUser ? auth.currentUser.uid : null;
    const { db } = useContext(FirebaseContext);
    const router = useRouter();

	// Contexts to invoke toasts.
	const { addToast } = useContext(ToastContext);

	async function logout() {
		try {
			await signOut(auth);
			logoutUser();
			router.push("/");
			addToast({
				title: "Logout Success!",
				desc: "See you later!",
				variant: "success",
			});
		} catch(e) {
			addToast(genericToast("generic-fail"));
		}
	}

    // listen for changes in user's level and update loggedIn object
    const dbRef = getDatabase();
    const levelRef = ref(dbRef, "user/" + uid + "/level");
    onValue(levelRef, (snapshot) => {
        const newLevel = snapshot.val();
        if(newLevel != loggedIn.level){
            loginUser({...loggedIn, level:newLevel});
        }
    });


    return (
        <nav
            className={clsx(
                "flex flex-row items-center justify-between fixed top-0",
                "w-full h-16 px-8",
                "border-b-2 bg-white z-30"
            )}
        >
            <div className="flex items-center mr-4">
                <Link href={loggedIn ? "/problems" : "/"} passHref>
                    <a className="flex items-center">
                        <Image src="/assets/lade.webp" width="96" height="32" />
                    </a>
                </Link>
            </div>
            <div className="flex-grow flex align-center justify-center relative">
                <input
                    placeholder="Search"
                    className="w-full h-10 pl-16 pr-8 border-2 rounded-lg"
                />
                <MdSearch className="absolute left-6 top-2 w-6 h-6 text-gray-500" />
            </div>
            <div className="flex flex-row items-center ml-4">
                {loggedIn ? (
                    <>
                        <LinkButton className="mr-4" variant="ghost" href="#">
                            {loggedIn.username} | Level {loggedIn.level}
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
