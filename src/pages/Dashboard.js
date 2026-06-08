import React, { useState, useEffect } from 'react';
import '../App.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function fetchVideoTitle(videoId) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (res.ok) return (await res.json()).title || 'Unknown Title';
  } catch (_) {}
  return 'Unknown Title';
}

/**
 * Groq API — free tier, no credit card, native CORS support.
 * Sign up: https://console.groq.com  (30 seconds, just email)
 * Models: llama-3.3-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it
 */
async function callGroq(apiKey, model, prompt) {
  const modelMap = {
    llama:   'llama-3.3-70b-versatile',
    mixtral: 'mixtral-8x7b-32768',
    gemma:   'gemma2-9b-it',
  };
  const groqModel = modelMap[model] || 'llama-3.3-70b-versatile';

  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert YouTube video summarizer. Respond with a clear, well-structured summary using ## headings and - bullet points.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let msg = `Groq API error ${res.status}`;
      try {
        const parsed = JSON.parse(body);
        msg = parsed?.error?.message || msg;
        if (res.status === 401) msg = 'Invalid API key. Please check your Groq key.';
        if (res.status === 429) msg = 'Rate limit hit. Wait a moment and try again.';
      } catch (_) {}
      throw new Error(msg);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from Groq. Please try again.');
    return text.trim();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw err;
  } finally {
    clearTimeout(tid);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const HISTORY_KEY = 'yt_summarizer_history';
const KEY_STORAGE  = 'groq_api_key';

const Dashboard = () => {
  const [youtubeURL, setYoutubeURL] = useState('');
  const [model, setModel]           = useState('llama');
  const [summary, setSummary]       = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [history, setHistory]       = useState([]);
  const [apiKey]                    = useState(() => {
    const envKey = process.env.REACT_APP_GROQ_API_KEY;
    if (envKey && envKey !== 'your_groq_api_key_here') return envKey;
    return localStorage.getItem(KEY_STORAGE) || '';
  });

  const hasKey = apiKey.trim().startsWith('gsk_') && apiKey.trim().length > 20;

  useEffect(() => {
    try {
      const s = localStorage.getItem(HISTORY_KEY);
      if (s) setHistory(JSON.parse(s));
    } catch (_) {}
  }, []);

  const saveHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch (_) {}
  };


  const handleSummarize = async () => {
    setError(''); setSummary(''); setVideoTitle('');

    if (!youtubeURL.trim()) { setError('Please enter a YouTube URL.'); return; }
    const videoId = extractVideoId(youtubeURL.trim());
    if (!videoId) { setError('Invalid YouTube URL.'); return; }
    if (!hasKey) {
      setError('API key not configured. Please set the REACT_APP_GROQ_API_KEY environment variable in Netlify.');
      return;
    }

    setLoading(true);
    try {
      const title = await fetchVideoTitle(videoId);
      setVideoTitle(title);
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      const prompt = `Summarize this YouTube video:

Title: "${title}"
URL: ${videoUrl}

Please include:
## Overview
2-3 sentence overview of what the video is about.

## Key Points
- Main topics, insights, or arguments (bullet list)

## Notable Highlights
Key moments, quotes, or takeaways.

## Conclusion
The main message or call to action.

Base your summary on the title and any knowledge you have about this video or topic.`;

      const result = await callGroq(apiKey.trim(), model, prompt);
      setSummary(result);
      saveHistory({
        id: Date.now(),
        youtube_url: videoUrl,
        title,
        summary: result,
        model,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = (text) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h3 key={i} className="summary-h3">{line.slice(3)}</h3>;
      if (line.startsWith('# '))  return <h2 key={i} className="summary-h2">{line.slice(2)}</h2>;
      if (line.startsWith('- ') || line.startsWith('• '))
        return <li key={i} className="summary-li">{line.replace(/^[-•] /, '')}</li>;
      if (line.trim() === '') return <div key={i} className="summary-spacer" />;
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
        p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p
      );
      return <p key={i} className="summary-p">{parts}</p>;
    });

  return (
    <div className="dashboard">
      <h1>YouTube Video Summarizer</h1>
      <p className="subtitle">Paste a YouTube URL and get an AI-powered summary instantly.</p>



      {/* Main Input Row */}
      <div className="input-row">
        <input
          className="dashboard-input"
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeURL}
          onChange={(e) => setYoutubeURL(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSummarize()}
          disabled={loading}
          aria-label="YouTube URL"
        />
        <select
          className="dashboard-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={loading}
        >
          <option value="llama">Llama 3.3 70B</option>
          <option value="mixtral">Mixtral 8x7B</option>
          <option value="gemma">Gemma 2 9B</option>
        </select>
        <button
          className={`dashboard-button${loading ? ' loading' : ''}`}
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading
            ? <span className="spinner-text"><span className="spinner" />Summarizing...</span>
            : 'Summarize Video'
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner" role="alert">
          <span role="img" aria-label="warning">⚠️</span> {error}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="summary">
          {videoTitle && (
            <h2 className="video-title">
              <span role="img" aria-label="video">📹</span> {videoTitle}
            </h2>
          )}
          <div className="summary-body">{renderSummary(summary)}</div>
        </div>
      )}

      {/* History */}
      <div className="history">
        <div className="history-header">
          <h2>Summary History</h2>
          {history.length > 0 && (
            <button className="clear-btn" onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }}>
              Clear
            </button>
          )}
        </div>
        {history.length === 0
          ? <p className="empty-history">No summaries yet. Try one above!</p>
          : (
            <ul>
              {history.map((item) => (
                <li key={item.id}>
                  <div className="history-item-header">
                    <a href={item.youtube_url} target="_blank" rel="noopener noreferrer">
                      {item.title || item.youtube_url}
                    </a>
                    <span className="history-date">{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <p className="history-summary">{item.summary?.slice(0, 200)}…</p>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;
