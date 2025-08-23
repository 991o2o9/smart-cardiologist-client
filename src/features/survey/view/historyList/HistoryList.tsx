import { useHistory } from '../../../../entities/survey/model/useHistory';
import { Typography } from '../../../../shared/ui/typography/view/Typography';
import { Button } from '../../../../shared/ui/button/view/Button';
import { Loading } from '../../../../shared/ui/loading/view/Loading';
import styles from './HistoryList.module.scss';
import type { FC } from 'react';

interface HistoryListProps {
  onItemClick: (id: number) => void;
}

export const HistoryList: FC<HistoryListProps> = ({ onItemClick }) => {
  const { history, loading, error, total, currentPage, limit, fetchHistory } =
    useHistory();

  const historyArray = history || [];

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRiskLevel = (risk: number) => {
    return risk === 1 ? 'High Risk' : 'Low Risk';
  };

  const getRiskColor = (risk: number) => {
    return risk === 1 ? 'error' : 'success';
  };

  const handlePageChange = (page: number) => {
    fetchHistory(page);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Typography variant="h3" color="error">
          {error}
        </Typography>
        <Button variant="primary" onClick={() => fetchHistory()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (historyArray.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.icon}>📋</div>
        <Typography variant="h3" color="dark">
          No History Yet
        </Typography>
        <Typography variant="bodyT" color="ocean-blue">
          You haven&apos;t completed a heart disease risk assessment yet. Start
          by filling out the health questionnaire.
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h2" color="dark">
          Assessment History
        </Typography>
        <Typography variant="bodyT" color="ocean-blue">
          Total assessments: {total}
        </Typography>
      </div>

      <div className={styles.historyList}>
        {historyArray.map((item) => (
          <div
            key={item.id}
            className={styles.historyItem}
            onClick={() => onItemClick(item.id)}
          >
            <div className={styles.itemHeader}>
              <Typography variant="h4" color="dark">
                Assessment #{item.id}
              </Typography>
              <Typography
                variant="bodyT"
                color={getRiskColor(item.risk_prediction)}
                className={styles.riskLevel}
                data-color={getRiskColor(item.risk_prediction)}
              >
                {getRiskLevel(item.risk_prediction)}
              </Typography>
            </div>

            <div className={styles.itemDetails}>
              <div className={styles.detail}>
                <Typography variant="smallT" color="ocean-blue">
                  Age: {item.age}
                </Typography>
                <Typography variant="smallT" color="ocean-blue">
                  Sex: {item.sex === 1 ? 'Male' : 'Female'}
                </Typography>
              </div>

              <div className={styles.detail}>
                <Typography variant="smallT" color="ocean-blue">
                  Probability: {(item.probability * 100).toFixed(1)}%
                </Typography>
                <Typography variant="smallT" color="ocean-blue">
                  Pulse: {item.pulse} bpm
                </Typography>
              </div>

              <div className={styles.detail}>
                <Typography variant="smallT" color="ocean-blue">
                  Date: {formatDate(item.created_at)}
                </Typography>
              </div>
            </div>

            <div className={styles.itemActions}>
              <Button variant="secondary" size="small">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="secondary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <div className={styles.pageInfo}>
            <Typography variant="bodyT" color="dark">
              Page {currentPage} of {totalPages}
            </Typography>
          </div>

          <Button
            variant="secondary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
