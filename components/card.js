import clsx from "clsx";

export default function Card({children, className, ...rest}){
    return (
        <div className={clsx("bg-white rounded-md border-1 border-gray-200 p-1 w-full flex flex-col", className, {...rest})}>
            {children}
        </div>
    );
}