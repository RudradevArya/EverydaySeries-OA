
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LaunchList() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);
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
    const fetchLaunches = async () => {
      try {
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/');
        setLaunches(res.data.results);
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

    fetchLaunches();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Upcoming Launches</h2>
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
      <ul>
        {launches.map(launch => (
          <li key={launch.id}>
            <Link to={`/launch/${launch.id}`}>
              {launch.name} - {new Date(launch.net).toLocaleDateString()}
            </Link>
            {launch.image && (
              <img src={launch.image} alt={launch.name} style={{width: '100px', height: 'auto', marginLeft: '10px'}} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LaunchList;