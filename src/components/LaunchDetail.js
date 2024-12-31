
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function LaunchDetail() {
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(null);

useEffect(() => {
  let timer;
  if (retryAfter) {
    setCountdown(retryAfter);
    timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  }
  return () => {
    if (timer) clearInterval(timer);
  };
}, [retryAfter]);

  useEffect(() => {
    const fetchLaunchDetail = async () => {
      try {
        const res = await axios.get(`https://lldev.thespacedevs.com/2.2.0/launch/${id}/`);
        setLaunch(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter) {
            setRetryAfter(parseInt(retryAfter, 10));
            setError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
          } else {
            setError('Rate limit exceeded. Please try again later.');
          }
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchLaunchDetail();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!launch) return <div>No launch data available.</div>;

  return (
    <div>
      <h2>{launch.name}</h2>
      {retryAfter && (
        <p>Rate limit exceeded. You can try again in {retryAfter} seconds.</p>
      )}
        {error && <div className="error-message">{error}</div>}
        {retryAfter && (
        <p>You can try again in {retryAfter} seconds.</p>
        )}

    {error && <div className="error-message">{error}</div>}
    {countdown > 0 && (
    <p>You can try again in {countdown} seconds.</p>
    )}
      {launch.image && (
        <img src={launch.image} alt={launch.name} style={{width: '300px', height: 'auto', marginBottom: '20px'}} />
      )}
      <p>Date: {new Date(launch.net).toLocaleString()}</p>
      <p>Status: {launch.status.name}</p>
      <p>Mission: {launch.mission?.description || 'No mission description available.'}</p>
      <p>Rocket: {launch.rocket.configuration.name}</p>
      <p>Launch Site: {launch.pad.name}</p>
      {launch.vidURLs && launch.vidURLs.length > 0 && (
        <div>
          <h3>Video Links:</h3>
          <ul>
            {launch.vidURLs.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">Video {index + 1}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {launch.program && launch.program.length > 0 && (
        <div>
          <h3>Program:</h3>
          <ul>
            {launch.program.map((prog, index) => (
              <li key={index}>{prog.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate('/')}>Back to Launch List</button>
    </div>
  );
}

export default LaunchDetail;