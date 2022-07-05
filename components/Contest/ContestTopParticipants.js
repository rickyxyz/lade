import clsx from "clsx";
import { Interweave } from "interweave";
import Link from "next/link";
import Button from "../Generic/Button";
import { CircleLoad } from "../Generic/Skeleton";

const ContestTopParticipants = ({ participants, fetchParticipants, uid }) => {
	return (
		<div>
			<h2 className="h4">Top Participants</h2>
			<table className="mt-8">
				<thead>
					<tr>
						<th>No.</th>
						<th>Username</th>
						<th>Score</th>
						<th>Completion Time</th>
					</tr>
				</thead>
				<tbody>
					{fetchParticipants === 1 &&
						(participants.length > 0 ? (
							participants.map((participant, index) => (
								<tr
									key={participant.username}
									className={clsx(
										participant.id === uid &&
											"bg-yellow-100"
									)}
								>
									<td>{index + 1}</td>
									<td>
										<Link
											href={`/user/${participant.id}`}
											passHref
										>
											<a className="link">
												{participant.username}
											</a>
										</Link>
									</td>
									<td>{participant.score}</td>
									<td>
										{new Date(
											participant.submittedAt
										).toLocaleString()}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td className="text-center" colSpan="4">
									No one has done this contest yet.
								</td>
							</tr>
						))}
					{fetchParticipants === 0 && (
						<tr>
							<td className="text-center" colSpan="4">
								<CircleLoad />
							</td>
						</tr>
					)}
					{fetchParticipants === -1 && (
						<tr>
							<td className="text-center" colSpan="4">
								We couldn&apos;t get the data. Please try again
								later.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default ContestTopParticipants;
