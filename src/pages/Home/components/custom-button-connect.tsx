import { LoadingButton } from '@/components/common/loading-button';
import { updateUser } from '@/services/user.service';
import { User } from '@/types/user.type';

import { arrayUnion } from 'firebase/firestore';

import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';

interface CustomButtonConnectProps {
  currentUser: User;
  refetchCurrentUser: (options?: RefetchOptions) => Promise<QueryObserverResult<User | null, Error>>;
  userId: string;
  setClickUser: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CustomButtonConnect: React.FC<CustomButtonConnectProps> = ({
  currentUser,
  refetchCurrentUser,
  userId,
  className,
  setClickUser,
  setIsOpenModal,
}) => {
  const { mutateAsync: connectMutate, status: connectStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(userId, { requestConnections: arrayUnion(currentUser.id) }),
        updateUser(currentUser.id, { sentConnections: arrayUnion(userId) }),
      ]);
    },
    onSuccess: async () => {
      await refetchCurrentUser();
    },
  });

  const handleConnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await connectMutate();
    setClickUser(userId);
  };

  const handlePending = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpenModal(true);
    setClickUser(userId);
  };

  const isSentConnectionUser =
    Array.isArray(currentUser.sentConnections) && currentUser.sentConnections?.includes(userId);

  return isSentConnectionUser || connectStatus === 'pending' ? (
    <LoadingButton className={className} loading={connectStatus === 'pending'} onClick={handlePending}>
      Pending
    </LoadingButton>
  ) : (
    <LoadingButton className={className} onClick={handleConnect}>
      Connect
    </LoadingButton>
  );
};
export default CustomButtonConnect;
