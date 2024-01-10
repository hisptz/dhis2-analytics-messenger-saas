import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
interface LogoutModalProps {
	open: boolean;
	loading: boolean;
	onClose: () => void;
	onLogOut: () => void;
}
export function LogoutModal({
	open,
	onClose,
	onLogOut,
	loading,
}: LogoutModalProps) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle sx={{ padding: 6, paddingX: 12 }}>
				Are you sure you want to logout?
			</DialogTitle>
			<DialogActions sx={{ paddingX: 3, paddingBottom: 3 }}>
				<Button
					className=" text-black"
					onClick={onClose}
					variant="outlined"
					sx={{ borderRadius: "50px", textTransform: "none" }}
				>
					Cancel
				</Button>
				<LoadingButton
					className="bg-red-600"
					loadingIndicator="Logout..."
					loading={loading}
					onClick={onLogOut}
					variant="contained"
					color="error"
					sx={{ borderRadius: "50px", textTransform: "none" }}
				>
					Logout
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
