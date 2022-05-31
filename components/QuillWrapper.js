import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper= dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <></>,
});

export default QuillNoSSRWrapper;