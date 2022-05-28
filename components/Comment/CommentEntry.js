import { Interweave } from "interweave";
import UpvoteDownvote from "./UpvoteDownvote";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import { connect } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { FirebaseContext } from "../firebase";

const CommentEntry = ({ loggedIn, comment, problemId }) => {
	
	const { db } = useContext(FirebaseContext);
	
    return (
        <article className="flex flex-col items-start gap-2 mb-8 mt-8">
            <div className="flex flex-row items-end gap-2">
                <h1 className="text-xl text-black font-semibold">
                    {comment.owner}
                </h1>
            </div>
            <Interweave content={comment.comment} />
            {/* pass problemId to UpvoteDownvote.js */}
            <UpvoteDownvote comment={comment} problemId={problemId}/>
        </article>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEntry);