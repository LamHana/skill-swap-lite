import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface AlertDialogProps {
  open: boolean;
  onCancle: () => void;
  onConfirm: () => void;
  confirmStatus: string;
}

const WithdrawAlertDialog: React.FC<AlertDialogProps> = ({ open, onCancle, onConfirm, confirmStatus }) => {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onConfirm();
  };

  const handleCancle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onCancle();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw invitation</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to withdraw the invitation?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancle}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={confirmStatus === 'pending'}>
            Withdraw
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default WithdrawAlertDialog;
