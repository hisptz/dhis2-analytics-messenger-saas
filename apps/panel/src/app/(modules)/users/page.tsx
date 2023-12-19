"use client";

import { ParseClient } from "@/utils/parse/client";
import { useQuery } from "@tanstack/react-query";
import { FullLoader } from "@/components/FullLoader";
import {
	IconButton,
	Menu,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { useMemo, useState } from "react";
import { MoreHoriz } from "@mui/icons-material";

export default function Users() {
	const currentUser = ParseClient.User.current();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	async function getUsers() {
		const query = new ParseClient.Query(ParseClient.User);
		query.include(["approvedBy"]);
		return query.find();
	}

	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["users"],
		queryFn: getUsers,
	});

	function approveUser(user: ParseClient.User) {
		return async () => {
			handleClose();
			user.set("approved", !user.get("approved"));
			user.set("approvedBy", ParseClient.User.current());
			await user.save();
			await refetch();
		};
	}

	const rows = useMemo(() => {
		return data?.map(
			(user) =>
				({ ...user.attributes, object: user }) as Record<string, any>,
		);
	}, [data]);

	return (
		<div className="flex flex-col items-start justify-start text-2xl text-primary-500 w-full">
			<div className="text-left font-bold">Users</div>
			<div className="flex-1 w-full">
				{isLoading && <FullLoader />}
				{data && (
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Username</TableCell>
								<TableCell>Email verified</TableCell>
								<TableCell>Approved</TableCell>
								<TableCell>Approved by</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows?.map((row) => {
								return (
									<TableRow key={`${row.object.id}`}>
										<TableCell>
											{row.fullName}{" "}
											{currentUser!.id === row.object.id
												? "(me)"
												: ""}
										</TableCell>
										<TableCell>{row.username}</TableCell>
										<TableCell>
											{row.emailVerified ? "Yes" : "No"}
										</TableCell>
										<TableCell>
											{row.approved ? "Yes" : "No"}
										</TableCell>
										<TableCell>
											{row.approvedBy?.get("fullName") ??
												row.approvedBy?.get("username")}
										</TableCell>
										<TableCell>
											<IconButton
												key={`${row.objectId}-action-button`}
												onClick={handleClick}
												aria-controls={
													open
														? "basic-menu"
														: undefined
												}
												aria-haspopup="true"
												aria-expanded={
													open ? "true" : undefined
												}
											>
												<MoreHoriz />
											</IconButton>
											<Menu
												id="basic-menu"
												anchorEl={anchorEl}
												open={open}
												onClose={handleClose}
												MenuListProps={{
													"aria-labelledby":
														"basic-button",
												}}
											>
												<MenuItem
													onClick={approveUser(
														row.object,
													)}
												>
													{row.approved
														? "Revoke approval"
														: "Approve"}
												</MenuItem>
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
