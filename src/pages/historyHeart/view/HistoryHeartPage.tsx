import { useState } from 'react';
import { Container } from '../../../shared/ui/container/view/Container';
import { HistoryList } from '../../../features/survey/view/historyList/HistoryList';
import { HistoryResult } from '../../../features/survey/view/historyResult/HistoryResult';

export const HistoryHeartPage = () => {
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null,
  );

  const handleHistoryItemClick = (id: number) => {
    setSelectedHistoryId(id);
  };

  const handleBackToList = () => {
    setSelectedHistoryId(null);
  };

  return (
    <Container>
      {selectedHistoryId ? (
        <HistoryResult
          historyId={selectedHistoryId}
          onBack={handleBackToList}
        />
      ) : (
        <HistoryList onItemClick={handleHistoryItemClick} />
      )}
    </Container>
  );
};
