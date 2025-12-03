import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import SearchFilter from '../components/SearchFilter';
import ResultTable from '../components/ResultTable';
import { fetchResults } from '../api/api';

const Container = styled.main`
  max-width: 960px;
  margin: 2rem auto 3rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #003366;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  font-size: 1.1rem;
  color: #555;
  margin: 2rem 0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #cc0000;
  font-weight: 600;
  margin: 2rem 0;
  text-align: center;
`;

function Dashboard() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ subject: '', dateFrom: '', dateTo: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (filters.subject) {
        params.subject = filters.subject;
      }
      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
      }
      if (filters.dateTo) {
        params.dateTo = filters.dateTo;
      }

      const data = await fetchResults(params);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to load results.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSearchChange(term) {
    setSearchTerm(term);
  }

  function handleFilterChange(filterObj) {
    setFilters(filterObj);
  }

  function handleRowClick(id) {
    navigate(`/result/${id}`);
  }

  return (
    <>
      <Header />
      <Container aria-label="Dashboard">
        <Title>Results Dashboard</Title>
        <SearchFilter onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
        {loading && <LoadingMessage>Loading results...</LoadingMessage>}
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        {!loading && !error && (
          <ResultTable results={results} onRowClick={handleRowClick} />
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Dashboard;
