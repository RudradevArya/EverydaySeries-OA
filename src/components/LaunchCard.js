import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.4em;
`;

const CardText = styled.p`
  color: #34495e;
  margin: 0 0 10px 0;
  font-size: 1em;
`;

const CardLabel = styled.span`
  font-weight: bold;
  color: #7f8c8d;
`;

const LaunchCard = ({ launch }) => {
  return (
    <Card>
      <Link to={`/launch/${launch.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {launch.image && <CardImage src={launch.image} alt={launch.name} />}
        <CardContent>
          <CardTitle>{launch.name}</CardTitle>
          <CardText>
            <CardLabel>Date:</CardLabel> {new Date(launch.net).toLocaleString()}
          </CardText>
          <CountdownTimer launchDate={launch.net} />
          <CardText>
            <CardLabel>Status:</CardLabel> {launch.status.name}
          </CardText>
        </CardContent>
      </Link>
    </Card>
  );
};

export default LaunchCard;