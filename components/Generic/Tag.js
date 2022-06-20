import clsx from "clsx";
import { useEffect, useState } from "react";

const colors = [
	"red",
	"orange",
	"yellow",
	"lime",
	"green",
	"teal",
	"cyan",
	"blue",
	"purple",
	"fuchsia",
	"pink",
	"rose",
];

const Tag = ({ children, color, className }) => {
	const [seed, setSeed] = useState(0);
	const [col, setCol] = useState(color);

	useEffect(() => {
		// If color is specified, don't need to generate a random color.
		if (color) return;

		const _seed = 0;

		if (!children) {
			return;
		}

		// Assign colors to labels
		for (let i = 0; i < children.length; i++) {
			const char = children[i].charCodeAt(0);
			_seed += Math.pow(char, i) + char;
			if (i % 7 === 0) {
				_seed = Math.sqrt(_seed) * _seed + 1;
			}
			_seed = Math.floor(_seed);
		}

		setCol(colors[Math.floor(_seed % colors.length)]);
	}, []);

	return (
		<span
			className={clsx(
				"px-2 py-1 w-fit h-min",
				"transition-colors duration-100",
				"disabled:cursor-not-allowed disabled:bg-opacity-50",
				"rounded text-sm",
				[
					col === "red" && [
						`bg-red-100 text-red-700`,
						`hover:bg-red-200`,
						`active:bg-red-300`,
					],
					col === "orange" && [
						"text-orange-100 text-orange-700",
						`hover:bg-orange-200`,
						`active:bg-orange-300`,
					],
					col === "yellow" && [
						`bg-yellow-100 text-yellow-700`,
						`hover:bg-yellow-200`,
						`active:bg-yellow-300`,
					],
					col === "lime" && [
						`bg-lime-100 text-lime-700`,
						`hover:bg-lime-200`,
						`active:bg-lime-300`,
					],
					col === "green" && [
						`bg-green-100 text-green-700`,
						`hover:bg-green-200`,
						`active:bg-green-300`,
					],
					col === "teal" && [
						`bg-teal-100 text-teal-700`,
						`hover:bg-teal-200`,
						`active:bg-teal-300`,
					],
					col === "cyan" && [
						`bg-cyan-100 text-cyan-700`,
						`hover:bg-cyan-200`,
						`active:bg-cyan-300`,
					],
					col === "blue" && [
						`bg-blue-100 text-blue-700`,
						`hover:bg-blue-200`,
						`active:bg-blue-300`,
					],
					col === "purple" && [
						"bg-purple-100 text-purple-700",
						`hover:bg-purple-200`,
						`active:bg-purple-300`,
					],
					col === "fuchsia" && [
						"bg-fuchsia-100 text-fuchsia-700",
						`hover:bg-fuchsia-200`,
						`active:bg-fuchsia-300`,
					],
					col === "pink" && [
						"bg-pink-100 text-pink-700",
						`hover:bg-pink-200`,
						`active:bg-pink-300`,
					],
					col === "rose" && [
						"bg-rose-100 text-rose-700",
						`hover:bg-rose-200`,
						`active:bg-rose-300`,
					],
				],
				className
			)}
		>
			{children}
		</span>
	);
};

export default Tag;
