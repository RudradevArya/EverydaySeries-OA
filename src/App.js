import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LaunchList from './components/LaunchList';
import LaunchDetail from './components/LaunchDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Space Launch Calendar</h1>
        <Switch>
          <Route exact path="/" component={LaunchList} />
          <Route path="/launch/:id" component={LaunchDetail} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;