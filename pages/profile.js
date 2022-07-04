import { useContext, useEffect, useState } from "react";
import {
    FirebaseContext,
    setProblemsFromSnapshot,
    turnProblemsObjectToArray,
} from "../components/firebase";
import ProblemCard from "../components/Problem/ProblemCard";
import { getData } from "../components/firebase";
import { connect } from "react-redux";
import {
    mapDispatchToProps,
    mapStateToProps,
} from "../components/Redux/setter";
import Frame from "../components/Generic/Frame";
import { ProblemCardSK } from "../components/Generic/Skeleton";
import { genericToast, ToastContext } from "../components/Generic/Toast";

import "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";
import clsx from "clsx";
import Button from "../components/Generic/Button";
import { GoChevronDown, GoChevronUp, GoDash } from "react-icons/go";
import ViewTemplate from "../components/Generic/ViewTemplate";
import Bar from "../components/Generic/Bar";
import { getLevelFromExperience, getProgressToNextLevel } from "../components/Profile/experience";

const Profile = ({ loggedIn }) => {
    console.log(loggedIn);

    const upvoted = [loggedIn.upvote];
    const downvoted = [loggedIn.downvote];

    const upvoteList = upvoted.map((i) =>{
            <div className="flex">
                {}
            </div>
        }
    );

    return (
        <article className="w-10/12 mx-auto flex flex-col p-12 gap-8">
            <section className="flex flex-col gap-4">
                <span className="flex items-end gap-4">
                    <h1 className="text-2xl">{ loggedIn.username }</h1>
                    <h2 className="text-sm">Level: { getLevelFromExperience(loggedIn.experience) }</h2>
                </span>
				<Bar className="!w-full" percentage={getProgressToNextLevel(loggedIn.experience)} />
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: loggedIn.experience+"%"}}></div>
                </div>
                <h2 className="text-slate-400">Experience: {loggedIn.experience} / 100 </h2>
            </section>
            {/* <div className="flex flex-row text-center justify-around">
                <section className="grow">
                    <h2>Upvoted</h2>
                </section>
                <section className="grow">
                    <h2>Downvoted</h2>
                </section>
            </div> */}
        </article>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
