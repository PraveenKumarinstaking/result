import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { uploadResultsCSV } from '../api/api';

const Container = styled.main`
  max-width: 480px;
  margin: 3rem auto 3rem;
  padding: 2rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fafafa;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: #003366;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #999;
  &:focus {
    border-color: #003366;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.6rem;
  background-color: #003366;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 1rem;
  font-weight: 600;
  text-align: center;
  color: ${(props) => (props.error ? '#cc0000' : '#006600')};
`;

const ProgressBar = styled.progress`
  margin-top: 1rem;
  width: 100%;
  height: 1.2rem;
`;

function UploadResults() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  function handleFileChange(e) {
    setError('');
    setStatusMessage('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatusMessage('');
    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await uploadResultsCSV(formData, (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress(percentCompleted);
        }
      });

      setStatusMessage('File uploaded successfully.');
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <>
      <Header />
      <Container aria-label="Upload CSV Results">
        <Title>Upload Results CSV</Title>
        <Form onSubmit={handleSubmit} noValidate>
          <Label htmlFor="csvFile">Select CSV file:</Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            aria-required="true"
            aria-describedby="fileHelp"
            disabled={uploading}
          />
          <small id="fileHelp" style={{ color: '#555' }}>
            CSV format: studentName,subject,score,date,remarks (remarks optional)
          </small>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          {uploading && <ProgressBar value={progress} max="100" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress} />}
          {statusMessage && <StatusMessage role="status">{statusMessage}</StatusMessage>}
          {error && <StatusMessage role="alert" error>{error}</StatusMessage>}
        </Form>
      </Container>
      <Footer />
    </>
  );
}

export default UploadResults;
