import React, { useState, useEffect } from 'react';
import '../App.css';

const Dashboard = () => {
  const [youtubeURL, setYoutubeURL] = useState('');
  const [model, setModel] = useState('gemini');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch the API Key from .env
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    // Fetch the user's summary history from the database
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/fetch-history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleSummarize = async () => {
    setLoading(true); // Show loading spinner
    try {
      // Make POST request to start the summarization
      const response = await fetch('https://n8n-dev.subspace.money/webhook/e2b29413-b4dc-4356-8eb0-3769a28be9cc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeURL, apiKey, model }),
      });
      
  
      // Debug: Log the response
      console.log('Start Summarize Response:', response);
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      // Listen for Webhook responses
      const eventSource = new EventSource('https://n8n-dev.subspace.money/webhook/e2b29413-b4dc-4356-8eb0-3769a28be9cc');
      eventSource.onmessage = (event) => {
        const summaryData = JSON.parse(event.data).summary;
        setSummary(summaryData); // Update the summary state
        storeSummary(summaryData); // Save the summary to history
        eventSource.close(); // Close the connection
      };
    } catch (error) {
      console.error('Error during summarization:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };
  
  
  

  const storeSummary = async (summary) => {
    try {
      const response = await fetch('/api/store-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeURL, summary }),
      });
      const data = await response.json();
      console.log('Summary stored:', data);
      setHistory([...history, data]); // Update the history state
    } catch (error) {
      console.error('Error storing summary:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>YouTube Video Summarizer</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={youtubeURL}
        onChange={(e) => setYoutubeURL(e.target.value)}
      />
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="gemini">Gemini</option>
        <option value="other-model">Other Model</option>
      </select>
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? 'Loading...' : 'Summarize Video'}
      </button>
      {summary && (
        <div className="summary">
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
      <div className="history">
        <h2>Summary History:</h2>
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <a href={item.youtube_url} target="_blank" rel="noopener noreferrer">
                {item.youtube_url}
              </a>
              <p>{item.summary}</p>
              <p>{new Date(item.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;


