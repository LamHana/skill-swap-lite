import PreviewCard, { PreviewCardProps } from './preview-card';

interface PreviewCardListProps {
  results: PreviewCardProps[];
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
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewCardList;
