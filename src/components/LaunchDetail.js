import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CountdownTimer from './CountdownTimer';

const DetailWrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const LaunchImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }
`;
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
        // const res = await axios.get(`https://ll.thespacedevs.com/2.2.0/launch/${id}/`); 
        // production API with 15req/hour rate limit
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
    <DetailWrapper>
      <h2>{launch.name}</h2>
      {launch.image && (
        <LaunchImage src={launch.image} alt={launch.name} />
      )}
      <CountdownTimer launchDate={launch.net} />
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
      <Button onClick={() => navigate('/')}>Back to Launch List</Button>
    </DetailWrapper>
  );
}

export default LaunchDetail;