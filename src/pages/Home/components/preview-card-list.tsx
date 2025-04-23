import PreviewCard, { PreviewCardProps } from '@/components/common/preview-card';
import { Button } from '@/components/ui/button';

interface PreviewCardListProps {
  results: Omit<PreviewCardProps, 'button'>[];
}

const PreviewCardList = ({ results }: PreviewCardListProps) => {
  return (
    <div className='container mx-auto py-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {results.map((result) => (
          <PreviewCard
            key={result.id}
            id={result.id}
            name={result.name}
            percent={result.percent}
            teach={result.teach}
            learn={result.learn}
            photoUrl={result.photoUrl}
            button={
              <Button className='w-[100%]' onClick={() => alert(`Connecting with ${result.name}`)}>
                Connect
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewCardList;
