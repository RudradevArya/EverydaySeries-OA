
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LaunchList() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/');
        setLaunches(res.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching launches:', error);
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          setRetryAfter(retryAfter);
          setError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
        } else {
          setError('Failed to fetch launches. Please try again later.');
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