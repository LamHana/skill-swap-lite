import WithdrawAlertDialog from '@/components/common/alert-dialog';
import PreviewCard from '@/components/common/preview-card';
import { useAuth } from '@/hooks';
import { updateUser } from '@/services/user.service';
import { UserWithPercent } from '@/types/user.type';

import { arrayRemove } from 'firebase/firestore';
import { useState } from 'react';

import CustomButtonConnect from './custom-button-connect';

import { useMutation } from '@tanstack/react-query';

interface PreviewCardListProps {
  results: UserWithPercent[];
}

const PreviewCardList = ({ results }: PreviewCardListProps) => {
  const { user: currentUser } = useAuth();
  if (!currentUser) return;

  const [clickUser, setClickUser] = useState<string | null>(null);
  const [listPendingUsers, setListPendingUsers] = useState<Record<string, boolean>>(
    Array.isArray(currentUser.sentConnections)
      ? currentUser.sentConnections.reduce(
          (acc, id) => {
            acc[id] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        )
      : {},
  );
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
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
        {results.map((result) => (
          <PreviewCard
            key={result.id}
            id={result.id}
            name={result.fullName.toString()}
            percent={result.percent}
            teach={Array.isArray(result.teach) ? result.teach : []}
            learn={Array.isArray(result.learn) ? result.learn : []}
            photoUrl={result.photoURL.toString()}
            setListPendingUsers={setListPendingUsers}
            listPendingUsers={listPendingUsers}
            button={
              <CustomButtonConnect
                className='w-[100%]'
                listPendingUsers={listPendingUsers}
                setListPendingUsers={setListPendingUsers}
                setIsOpenModal={setIsOpenModal}
                setClickUser={setClickUser}
                userId={result.id}
              />
            }
            className='mx-0'
          />
        ))}
      </div>
      <WithdrawAlertDialog
        open={isOpenModal}
        onCancle={() => setIsOpenModal(false)}
        onConfirm={handleWithdraw}
        confirmStatus={withdrawStatus}
      />
    </div>
  );
};

export default PreviewCardList;
