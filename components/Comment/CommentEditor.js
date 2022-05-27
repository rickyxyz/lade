import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

import { useContext } from "react";
import { FirebaseContext, postData } from "../../components/firebase";
import { mapDispatchToProps, mapStateToProps } from "../Redux/setter";
import "react-quill/dist/quill.snow.css";
import pushid from "pushid";
import { connect } from "react-redux";
import Button from "../Generic/Button";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <></>,
});

const CommentEditor = ({ loggedIn, problem_id }) => {
    const { db } = useContext(FirebaseContext);

    async function postComment() {
        const comment_content =
            document.getElementsByClassName("ql-editor")[0].innerHTML;

        if (comment_content === "") return;

        const comment_id = pushid();
        await postData(db, `/comment/${problem_id}/${comment_id}`, {
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
            />
            <div>
                <Button onClick={() => postComment()}>Post Comment</Button>
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentEditor);
