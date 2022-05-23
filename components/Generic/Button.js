import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Button = ({
    children,
    variant = "primary",
    className,
	loading = false,
	disabled = false,
	type,
	onClick,
}) => {
    return (
        <button
            className={clsx(
                "flex flex-row items-center justify-center px-4 py-2",
                "transition-colors duration-100",
                "disabled:cursor-not-allowed disabled:bg-opacity-50",
                "rounded",
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
                    variant === "ghost" && [
						'text-blue-700',
						`hover:bg-blue-50`,
						`active:bg-blue-100`
                    ],
					variant === "ghost-danger" && [
						'text-red-700',
						`hover:bg-red-50`,
						`active:bg-red-100`
                    ],
					variant === "link" && [
						'text-blue-700',
						'hover:underline hover:text-blue-500',
						'active:underline active:text-blue-500'
					],
                ],
                className
            )}
			type={type}
            onClick={!loading && !disabled ? onClick : () => {}}
			disabled={disabled || loading}
        >
            {!loading ? children : (
				<AiOutlineLoading3Quarters className="my-1 justify-self-center animate-spin" />
			)}
        </button>
    );
};

export default Button;
