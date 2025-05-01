import DetailCardList from './components/detail-card-list';
import Invitations from './components/invitations';

const MyNetwork = () => {
  return (
    <div className='flex flex-col items-start gap-4 mb-8 p-8 w-full'>
      <Invitations />
      <DetailCardList />
    </div>
  );
};

export default MyNetwork;
