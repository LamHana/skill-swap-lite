import PreviewCard, { PreviewCardProps } from '@/components/common/preview-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { updateUser } from '@/services/user.service';
import { useMutation } from '@tanstack/react-query';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { useState } from 'react';

interface PreviewCardListProps {
  results: Omit<PreviewCardProps, 'button'>[];
}

const PreviewCardList = ({ results }: PreviewCardListProps) => {
  const { user: currentUser } = useAuth();
  if (!currentUser) return;

  const [clickUser, setClickUser] = useState<string | null>(null);
  const [listPendingUsers, setListPendingUsers] = useState<Record<string, boolean>>({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { mutate: withdrawMutate, status: withdrawStatus } = useMutation({
    mutationFn: ({ receiverUid }: { receiverUid: string }) => {
      return Promise.all([
        updateUser(receiverUid, { requestConnections: arrayRemove(currentUser.id) }),
        updateUser(currentUser.id, { sentConnections: arrayRemove(receiverUid) }),
      ]);
    },
  });

  const handleWithdraw = () => {
    if (!clickUser) return;
    withdrawMutate(
      { receiverUid: clickUser },
      {
        onSuccess: () => {
          setListPendingUsers({ ...listPendingUsers, [clickUser]: false });
          setIsOpenModal(false);
          setClickUser(null);
        },
      },
    );
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {results.map((result) => {
          const { mutate: connectMutate, status: connectStatus } = useMutation({
            mutationFn: () => {
              return Promise.all([
                updateUser(result.id, { requestConnections: arrayUnion(currentUser.id) }),
                updateUser(currentUser.id, { sentConnections: arrayUnion(result.id) }),
              ]);
            },
          });

          const handleConnect = () => {
            if (!listPendingUsers[result.id]) {
              setListPendingUsers({ ...listPendingUsers, [result.id]: true });
              connectMutate();
            } else {
              setIsOpenModal(true);
              setClickUser(result.id);
            }
          };

          return (
            <PreviewCard
              key={result.id}
              id={result.id}
              name={result.name}
              percent={result.percent}
              teach={result.teach}
              learn={result.learn}
              photoUrl={result.photoUrl}
              button={
                <Button
                  className='w-[100%]'
                  disabled={listPendingUsers[result.id] && connectStatus === 'pending'}
                  onClick={() => handleConnect()}
                >
                  {listPendingUsers[result.id] ? 'Pending' : 'Connect'}
                </Button>
              }
            />
          );
        })}
      </div>
      <AlertDialog open={isOpenModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw invitation</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to withdraw the invitation?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenModal(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWithdraw} disabled={withdrawStatus === 'pending'}>
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreviewCardList;
