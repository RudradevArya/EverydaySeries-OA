import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LaunchList() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/');
        setLaunches(res.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching launches:', error);
        setError('Failed to fetch launches. Please try again later.');
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
      <ul>
        {launches.map(launch => (
          <li key={launch.id}>
            <Link to={`/launch/${launch.id}`}>
              {launch.name} - {new Date(launch.net).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LaunchList;