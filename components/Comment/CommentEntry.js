import { Interweave } from "interweave";
import UpvoteDownvote from "./UpvoteDownvote";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { connect } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { FirebaseContext } from "../firebase";
import { getTimeDifference } from "../Utility/date";

const CommentEntry = ({ loggedIn, comment, problemId }) => {
	
	const { db } = useContext(FirebaseContext);
	
    return (
        <article className="flex flex-row items-start gap-2 mb-8 mt-8 w-full xl:w-1/2">
            {/* pass problemId to UpvoteDownvote.js */}
            <UpvoteDownvote comment={comment} problemId={problemId}/>
            <section className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 text-gray-600">
					<h3 className="text-black font-semibold leading-4">
						{comment.owner}
					</h3>
					<span className="text-sm leading-4">
						{getTimeDifference(comment.createdAt)}
					</span>
				</div>
				<Interweave content={comment.comment} />
            </section>
        </article>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEntry);