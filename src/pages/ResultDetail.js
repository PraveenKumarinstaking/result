import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { fetchResultById } from '../api/api';

const Container = styled.main`
  max-width: 600px;
  margin: 2rem auto 3rem;
  padding: 1rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fafafa;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: #003366;
  margin-bottom: 1rem;
  text-align: center;
`;

const DetailList = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.75rem 1.5rem;
  margin: 1rem 0;
  font-size: 1rem;
`;

const Term = styled.dt`
  font-weight: 700;
  color: #333;
`;

const Description = styled.dd`
  margin: 0;
  color: #555;
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

const BackButton = styled.button`
  margin-top: 1.5rem;
  background-color: #003366;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: #0055aa;
  }
`;

function ResultDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid result ID.');
      return;
    }
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchResultById(id)
      .then((data) => {
        if (isMounted) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load result detail.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleBack() {
    navigate(-1);
  }

  return (
    <>
      <Header />
      <Container aria-label="Result Detail">
        <Title>Result Detail</Title>
        {loading && <LoadingMessage>Loading result details...</LoadingMessage>}
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        {!loading && !error && result && (
          <DetailList>
            <Term>Student Name:</Term>
            <Description>{result.studentName}</Description>
            <Term>Subject:</Term>
            <Description>{result.subject}</Description>
            <Term>Score:</Term>
            <Description>{result.score}</Description>
            <Term>Exam Date:</Term>
            <Description>{new Date(result.date).toLocaleDateString()}</Description>
            <Term>Remarks:</Term>
            <Description>{result.remarks || '-'}</Description>
          </DetailList>
        )}
        <BackButton onClick={handleBack} aria-label="Go back to previous page">
          Back
        </BackButton>
      </Container>
      <Footer />
    </>
  );
}

export default ResultDetail;
