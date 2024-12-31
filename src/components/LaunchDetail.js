import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function LaunchDetail() {
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLaunchDetail = async () => {
      try {
        const res = await axios.get(`https://lldev.thespacedevs.com/2.2.0/launch/${id}/`);
        setLaunch(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching launch details:', error);
        setError('Failed to fetch launch details. Please try again later.');
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
      <p>Date: {new Date(launch.net).toLocaleString()}</p>
      <p>Status: {launch.status.name}</p>
      <p>Mission: {launch.mission?.description || 'No mission description available.'}</p>
      <p>Rocket: {launch.rocket.configuration.name}</p>
      <p>Launch Site: {launch.pad.name}</p>
      <button onClick={() => navigate('/')}>Back to Launch List</button>
    </div>
  );
}

export default LaunchDetail;