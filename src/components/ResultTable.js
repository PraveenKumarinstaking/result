import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;

  th,
  td {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    cursor: pointer;
    user-select: none;
  }

  tr:hover {
    background-color: #eef6fa;
  }
`;

const PaginationControls = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  background-color: #003366;
  border: none;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const SortIndicator = styled.span`
  margin-left: 0.3rem;
  font-size: 0.8rem;
`;

function ResultTable({ results, onRowClick }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const sortedResults = useMemo(() => {
    if (!results) return [];
    const sortableResults = [...results];
    if (sortConfig.key) {
      sortableResults.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        // Normalize for string comparison
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableResults;
  }, [results, sortConfig]);

  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return sortedResults.slice(startIndex, startIndex + resultsPerPage);
  }, [sortedResults, currentPage]);

  function requestSort(key) {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  function getSortIndicator(key) {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '';
  }

  function handleRowClick(id) {
    if (typeof onRowClick === 'function') {
      onRowClick(id);
    }
  }

  return (
    <>
      <TableContainer role="region" aria-label="Results Table">
        <StyledTable>
          <thead>
            <tr>
              <th onClick={() => requestSort('studentName')} tabIndex={0} role="button" aria-sort={sortConfig.key === 'studentName' ? sortConfig.direction : 'none'}>
                Student Name
                <SortIndicator>{getSortIndicator('studentName')}</SortIndicator>
              </th>
              <th onClick={() => requestSort('subject')} tabIndex={0} role="button" aria-sort={sortConfig.key === 'subject' ? sortConfig.direction : 'none'}>
                Subject
                <SortIndicator>{getSortIndicator('subject')}</SortIndicator>
              </th>
              <th onClick={() => requestSort('score')} tabIndex={0} role="button" aria-sort={sortConfig.key === 'score' ? sortConfig.direction : 'none'}>
                Score
                <SortIndicator>{getSortIndicator('score')}</SortIndicator>
              </th>
              <th onClick={() => requestSort('date')} tabIndex={0} role="button" aria-sort={sortConfig.key === 'date' ? sortConfig.direction : 'none'}>
                Date
                <SortIndicator>{getSortIndicator('date')}</SortIndicator>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedResults.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                  No results found.
                </td>
              </tr>
            ) : (
              paginatedResults.map(({ id, studentName, subject, score, date }) => (
                <tr key={id} onClick={() => handleRowClick(id)} tabIndex={0} role="button" aria-label={`View details for ${studentName} - ${subject}`}>
                  <td>{studentName}</td>
                  <td>{subject}</td>
                  <td>{score}</td>
                  <td>{new Date(date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableContainer>
      {totalPages > 1 && (
        <PaginationControls aria-label="Pagination Controls">
          <PageButton onClick={() => setCurrentPage(1)} disabled={currentPage === 1} aria-label="Go to first page">
            &laquo;
          </PageButton>
          <PageButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Go to previous page">
            &lsaquo;
          </PageButton>
          <span aria-live="polite" aria-atomic="true" style={{ padding: '0.4rem 0.8rem', userSelect: 'none' }}>
            Page {currentPage} of {totalPages}
          </span>
          <PageButton onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Go to next page">
            &rsaquo;
          </PageButton>
          <PageButton onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} aria-label="Go to last page">
            &raquo;
          </PageButton>
        </PaginationControls>
      )}
    </>
  );
}

ResultTable.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      studentName: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired
};

export default ResultTable;
