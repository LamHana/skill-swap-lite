import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { updateUser } from '@/services/user.service';

import { arrayUnion } from 'firebase/firestore';

import { useMutation } from '@tanstack/react-query';

interface CustomButtonConnectProps {
  listPendingUsers: Record<string, boolean>;
  userId: string;
  setClickUser: React.Dispatch<React.SetStateAction<string | null>>;
  setListPendingUsers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CustomButtonConnect: React.FC<CustomButtonConnectProps> = ({
  listPendingUsers,
  userId,
  className,
  setClickUser,
  setListPendingUsers,
  setIsOpenModal,
}) => {
  const { user: currentUser } = useAuth();
  if (!currentUser) return;

  const { mutate: connectMutate, status: connectStatus } = useMutation({
    mutationFn: () => {
      return Promise.all([
        updateUser(userId, { requestConnections: arrayUnion(currentUser.id) }),
        updateUser(currentUser.id, { sentConnections: arrayUnion(userId) }),
      ]);
    },
  });

  const handleConnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!listPendingUsers[userId]) {
      setListPendingUsers({ ...listPendingUsers, [userId]: true });
      connectMutate();
    } else {
      setIsOpenModal(true);
      setClickUser(userId);
    }
  };

  return (
    <Button
      className={className}
      disabled={listPendingUsers[userId] && connectStatus === 'pending'}
      onClick={handleConnect}
    >
      {listPendingUsers[userId] ? 'Pending' : 'Connect'}
    </Button>
  );
};
export default CustomButtonConnect;
