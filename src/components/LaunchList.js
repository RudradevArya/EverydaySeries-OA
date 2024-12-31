
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import LaunchCard from './LaunchCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffcdd2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

function LaunchList() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryAfter, setRetryAfter] = useState(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await axios.get('https://lldev.thespacedevs.com/2.2.0/launch/');
        // const res = await axios.get('https://ll.thespacedevs.com/2.2.0/launch/');
        // production API with 15req/hour rate limit
        setLaunches(res.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching launches:', error);
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter) {
            setRetryAfter(parseInt(retryAfter, 10));
            setError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
          } else {
            setError('Rate limit exceeded. Please try again later.');
          }
        } else {
          setError('Failed to fetch launches. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div>
      <h2>Upcoming Launches</h2>
      {retryAfter && (
        <p>You can try again in {retryAfter} seconds.</p>
      )}
      <Grid>
        {launches.map(launch => (
          <LaunchCard key={launch.id} launch={launch} />
        ))}
      </Grid>
    </div>
  );
}

export default LaunchList;