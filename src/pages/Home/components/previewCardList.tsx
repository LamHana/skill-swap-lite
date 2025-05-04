import WithdrawAlertDialog from '@/components/common/alert-dialog';
import PreviewCard from '@/components/common/preview-card';
import { useAuth } from '@/hooks';
import { getUserByUID, updateUser } from '@/services/user.service';
import { User, UserWithPercent } from '@/types/user.type';

import { arrayRemove } from 'firebase/firestore';
import { useState } from 'react';

import CustomButtonConnect from './custom-button-connect';

import { useMutation, useQuery } from '@tanstack/react-query';

interface PreviewCardListProps {
  results: UserWithPercent[];
}

const PreviewCardList = ({ results }: PreviewCardListProps) => {
  const { user: authUser } = useAuth();

  const { data: currentUser, refetch: refetchCurrentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getUserByUID(authUser?.id ?? ''),
    enabled: !!authUser,
  });

  const [clickUser, setClickUser] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { mutate: withdrawMutate, status: withdrawStatus } = useMutation({
    mutationFn: async ({ receiverUid }: { receiverUid: string }) => {
      if (!currentUser) {
        return Promise.reject(new Error('Current user is not defined'));
      }
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
        onSuccess: async () => {
          setIsOpenModal(false);
          setClickUser(null);
          await refetchCurrentUser();
        },
      },
    );
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {results.map((result) => (
          <PreviewCard
            key={result.id}
            id={result.id}
            name={result.fullName.toString()}
            percent={result.percent}
            teach={Array.isArray(result.teach) ? result.teach : []}
            learn={Array.isArray(result.learn) ? result.learn : []}
            photoUrl={result.photoURL.toString()}
            matchedLearn={result.matchedLearn}
            matchedTeach={result.matchedTeach}
            currentUser={currentUser ?? ({} as User)}
            refetchCurrentUser={refetchCurrentUser}
            button={
              <CustomButtonConnect
                className='w-[100%]'
                currentUser={currentUser ?? ({} as User)}
                refetchCurrentUser={refetchCurrentUser}
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
