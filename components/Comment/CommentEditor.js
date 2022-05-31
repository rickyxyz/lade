import { useContext } from "react";
import { FirebaseContext, postData } from "../../components/firebase";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import pushid from "pushid";
import { connect } from "react-redux";
import Button from "../Generic/Button";
import QuillNoSSRWrapper from "../QuillWrapper";

const CommentEditor = ({ loggedIn, problemId }) => {
    const { db } = useContext(FirebaseContext);

    async function postComment() {
        const comment_content =
            document.getElementsByClassName("ql-editor")[0].innerHTML;

        if (comment_content === "") return;

        const commentId = pushid();
        await postData(db, `/comment/${problemId}/${commentId}`, {
            comment: comment_content,
            owner: loggedIn.username,
            upvote: 0,
            downvote: 0
        }).catch((e) => {
            console.log(e);
        });
    }

    return (
        <div>
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
                <Button onClick={() => postComment()}>Post Comment</Button>
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);
