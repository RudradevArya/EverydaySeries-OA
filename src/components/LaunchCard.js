import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
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
  margin: 0 0 10px 0;
  color: #333;
`;

const CardText = styled.p`
  color: #666;
  margin: 0 0 10px 0;
`;

const LaunchCard = ({ launch }) => {
  return (
    <Card>
      <Link to={`/launch/${launch.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {launch.image && <CardImage src={launch.image} alt={launch.name} />}
        <CardContent>
          <CardTitle>{launch.name}</CardTitle>
          <CardText>{new Date(launch.net).toLocaleString()}</CardText>
          <CountdownTimer launchDate={launch.net} />
          <CardText>Status: {launch.status.name}</CardText>
        </CardContent>
      </Link>
    </Card>
  );
};

export default LaunchCard;