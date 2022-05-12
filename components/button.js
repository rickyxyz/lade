import clsx from "clsx";

const Button = ({
    children,
    variant = "primary",
    className,
    ...rest
}) => {
    return (
        <button
            className={clsx(
                "px-4 py-2 shadow-md",
                "transition-colors duration-100",
                "disabled:cursor-not-allowed disabled:bg-opacity-50",
                [
                    variant === "primary" && [
                        `bg-blue-600 text-white`,
                        `hover:bg-blue-700`,
                        `active:bg-blue-800`,
                    ],
                    variant === "secondary" && [
                        `bg-gray-500 text-white`,
                        `hover:bg-gray-600`,
                        `active:bg-gray-700`,
                    ],
                    variant === "danger" && [
                        `bg-red-500 text-white`,
                        `hover:bg-red-600`,
                        `active:bg-red-700`,
                    ],
                ],
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
