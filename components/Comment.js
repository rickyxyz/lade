import clsx from "clsx";

const Comment = ({problemId}) => {
    return (
        <article className= "flex flex-col items-start gap-2 mb-8">
            <div className="flex flex-row items-end gap-2">
                <h1 className="text-xl text-black font-semibold">Username</h1>
                <h2 className="text-xs text-slate-600 font-medium">Posted at dd,MM,yyyy</h2>
            </div>
            <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa ipsum, modi earum enim obcaecati atque dolore exercitationem molestias ea. Possimus, molestiae enim! Nobis, reprehenderit sunt. Aut provident dolore voluptatibus expedita.</p>
        </article>
    );
};

export default Comment;