import axios from 'axios';
import { fetchResults, fetchResultById, uploadResultsCSV } from '../api/api';

jest.mock('axios');

describe('API functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchResults calls correct endpoint with parameters', async () => {
    const mockData = { results: [{ id: 1 }] };
    axios.get.mockResolvedValue({ data: mockData });

    const params = { search: 'test', subject: 'Math' };
    const data = await fetchResults(params);

    expect(axios.get).toHaveBeenCalledWith('/results', { params });
    expect(data).toEqual(mockData);
  });

  test('fetchResults throws error on bad response', async () => {
    axios.get.mockResolvedValue({ data: {} }); // missing results array
    await expect(fetchResults()).rejects.toThrow('Invalid data format from server');
  });

  test('fetchResultById calls correct endpoint', async () => {
    const id = '123';
    const mockResult = { id, studentName: 'John' };
    axios.get.mockResolvedValue({ data: { result: mockResult } });

    const data = await fetchResultById(id);

    expect(axios.get).toHaveBeenCalledWith(`/results/${id}`);
    expect(data).toEqual(mockResult);
  });

  test('fetchResultById throws error if no id', async () => {
    await expect(fetchResultById(null)).rejects.toThrow('Result ID is required');
  });

  test('fetchResultById throws error on missing result', async () => {
    axios.get.mockResolvedValue({ data: {} });
    await expect(fetchResultById('123')).rejects.toThrow('Result not found');
  });

  test('uploadResultsCSV calls POST with FormData and progress', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const formData = new FormData();
    const onUploadProgress = jest.fn();

    const data = await uploadResultsCSV(formData, onUploadProgress);

    expect(axios.post).toHaveBeenCalledWith('/results/upload', formData, expect.objectContaining({
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    }));
    expect(data).toEqual({ success: true });
  });

  test('uploadResultsCSV throws error if no FormData', async () => {
    await expect(uploadResultsCSV({}, () => {})).rejects.toThrow('FormData instance is required');
  });

  test('uploadResultsCSV throws error on failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Upload failed' } } });
    const formData = new FormData();
    await expect(uploadResultsCSV(formData, () => {})).rejects.toThrow('Upload failed');
  });
});
