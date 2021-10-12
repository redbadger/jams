import OverviewJamCard from '@/components/OverviewJamCard';
import { GridItem } from '@chakra-ui/react';
import { convertDate, timeSince } from '../utils/date';

function ResultsCard({ jam, key }) {
  console.log('inside ResultCard');
  const i = key;
  return (
    <GridItem
      key={i}
      colSpan={{ sm: 1, md: 2 }}
      colStart={{ sm: 1, md: 3 }}
    >
      <OverviewJamCard
        jamUrl={jam.urlPath}
        isOpen={jam.isOpen}
        jamName={jam.name}
        openFor={timeSince(jam.createdAt._seconds)}
        createdAt={convertDate(jam.createdAt._seconds)}
      />
    </GridItem>
  );
}

export default ResultsCard;
