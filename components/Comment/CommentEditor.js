import { useContext } from "react";
import { FirebaseContext, postData } from "../../components/firebase";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";
import { connect } from "react-redux";
import Button from "../Generic/Button";
import QuillNoSSRWrapper from "../QuillWrapper";

import "firebase/database";
import "firebase/compat/database";
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import clsx from "clsx";

const CommentEditor = ({ loggedIn, problemId, discussion }) => {
    const { db } = useContext(FirebaseContext);

    async function postComment() {
        const comment_content =
            document.getElementsByClassName("ql-editor")[0].innerHTML;

        if (comment_content === "") return;

        const commentId = pushid();

		firebase
		.database()
		.ref(`/problem/${problemId}/`)
		.child("comments")
		.set(firebase.database.ServerValue.increment(1));

        await postData(db, `/comment/${problemId}/${commentId}`, {
            comment: comment_content,
            owner: loggedIn.username,
            upvote: 0,
            downvote: 0
        }).catch((e) => {
            console.log(e);
        }).then(() => {
			setTimeout(() => {
				if(location)
					location.reload();
			}, 150)
		});
    }

    return (
        discussion ? <div>
		<QuillNoSSRWrapper
			className="quill mb-8"
			placeholder="Post your comment here..."
			modules={{
			toolbar: [
				['bold', 'italic', 'underline', 'strike'],
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'script': 'sub'}, { 'script': 'super' }],
				['link', 'formula']
			]
		}} />
		<div>
			<Button variant="secondary" onClick={() => postComment()}>Post Comment</Button>
		</div>
	</div> : <div>
		Discussion is not enabled in this question.
	</div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);
