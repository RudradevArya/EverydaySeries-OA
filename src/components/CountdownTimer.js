import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';

const TimerWrapper = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: ${props => props.isPast ? '#d32f2f' : '#1976d2'};
`;

const CountdownTimer = ({ launchDate }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const launch = new Date(launchDate);
      if (launch > now) {
        setTimeLeft(`T- ${formatDistanceToNow(launch, { addSuffix: false })}`);
        setIsPast(false);
      } else {
        setTimeLeft(`T+ ${formatDistanceToNow(launch, { addSuffix: false })}`);
        setIsPast(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  return <TimerWrapper isPast={isPast}>{timeLeft}</TimerWrapper>;
};

export default CountdownTimer;