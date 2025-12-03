import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FilterContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 180px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 160px;
  font-size: 1rem;
`;

function SearchFilter({ onSearchChange, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Notify parent of changes
  useEffect(() => {
    onSearchChange(searchTerm);
  }, [searchTerm, onSearchChange]);

  useEffect(() => {
    onFilterChange({ subject, dateFrom, dateTo });
  }, [subject, dateFrom, dateTo, onFilterChange]);

  return (
    <FilterContainer aria-label="Search and Filter Controls">
      <Input
        type="search"
        placeholder="Search by student name"
        aria-label="Search by student name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select
        aria-label="Filter by subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="">All Subjects</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Biology">Biology</option>
        <option value="English">English</option>
        <option value="History">History</option>
        <option value="Geography">Geography</option>
        <option value="Computer Science">Computer Science</option>
      </Select>
      <label htmlFor="dateFrom" style={{ fontSize: '0.9rem' }}>
        From:
      </label>
      <Input
        type="date"
        id="dateFrom"
        aria-label="Filter from date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        max={dateTo || undefined}
      />
      <label htmlFor="dateTo" style={{ fontSize: '0.9rem' }}>
        To:
      </label>
      <Input
        type="date"
        id="dateTo"
        aria-label="Filter to date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        min={dateFrom || undefined}
      />
    </FilterContainer>
  );
}

SearchFilter.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default SearchFilter;
