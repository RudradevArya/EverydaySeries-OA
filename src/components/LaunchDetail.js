import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CountdownTimer from './CountdownTimer';

const DetailWrapper = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 20px;
`;

const LaunchImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #7f8c8d;
  display: inline-block;
  width: 120px;
  
`;

const InfoText = styled.p`
  color: #34495e;
  margin: 10px 0;
`;

const ListTitle = styled.h3`
  color: #2c3e50;
  margin-top: 30px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
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
            setError('Rate limit exceeded. Please try again later. as the rate limit for "https://ll.thespacedevs.com/2.2.0/launch/" is 15req/hour');
          }
        } else {
          setError('Failed to fetch data. Please try again later.as the rate limit for "https://ll.thespacedevs.com/2.2.0/launch/" is 15req/hour');
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
      <InfoSection>
        <InfoText><InfoLabel>Date:</InfoLabel> {new Date(launch.net).toLocaleString()}</InfoText>
        <InfoText><InfoLabel>Status:</InfoLabel> {launch.status.name}</InfoText>
        <InfoText><InfoLabel>Rocket:</InfoLabel> {launch.rocket.configuration.name}</InfoText>
        <InfoText><InfoLabel>Launch Site:</InfoLabel> {launch.pad.name}</InfoText>
      </InfoSection>
      <InfoSection>
        <InfoLabel>Mission:</InfoLabel>
        <InfoText>{launch.mission?.description || 'No mission description available.'}</InfoText>
      </InfoSection>
      {launch.vidURLs && launch.vidURLs.length > 0 && (
        <InfoSection>
          <ListTitle>Video Links:</ListTitle>
          <List>
            {launch.vidURLs.map((url, index) => (
              <ListItem key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">Video {index + 1}</a>
              </ListItem>
            ))}
          </List>
        </InfoSection>
      )}
      {launch.program && launch.program.length > 0 && (
        <InfoSection>
          <ListTitle>Program:</ListTitle>
          <List>
            {launch.program.map((prog, index) => (
              <ListItem key={index}>{prog.name}</ListItem>
            ))}
          </List>
        </InfoSection>
      )}
      <Button onClick={() => navigate('/')}>Back to Launch List</Button>
    </DetailWrapper>
  );
}

export default LaunchDetail;