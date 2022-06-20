import { useContext, useState } from "react";
import { FirebaseContext, postData } from "../../components/firebase";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";
import { connect } from "react-redux";
import Button from "../Generic/Button";
import QuillNoSSRWrapper from "../QuillWrapper";
import { useRouter } from "next/router";
import "firebase/database";
import "firebase/compat/database";
import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import clsx from "clsx";

const CommentEditor = ({ loggedIn, problemId, discussion }) => {
    const { db } = useContext(FirebaseContext);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

    async function postComment() {
		setLoading(true);

        const comment_content =
            document.getElementsByClassName("ql-editor")[0].innerHTML;

        if (comment_content === "") return;

        const commentId = pushid();

		const now = new Date();

		firebase
		.database()
		.ref(`/problem/${problemId}/metrics`)
		.child("comments")
		.set(firebase.database.ServerValue.increment(1));

        await postData(db, `/comment/${problemId}/${commentId}`, {
            comment: comment_content,
            owner: loggedIn.username,
			createdAt: now.getTime(),
            upvote: 0,
            downvote: 0
        }).catch((e) => {
			setLoading(false);
            console.log(e);
        }).then(() => {});
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
			<Button loading={loading} variant="secondary" onClick={() => postComment()}>Post Comment</Button>
		</div>
	</div> : <div>
		Discussion is not enabled.
	</div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);
