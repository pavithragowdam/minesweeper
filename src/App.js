import React from 'react';
import './App.scss';
// eslint-disable-next-line
import {
  Route, BrowserRouter as Router, HashRouter,
  Switch,
} from 'react-router-dom'
import navbar from './components/Navbar/navbar'
import layout from './components/Layout/layout'
import cell from './components/Cell/cell'

function App() {
  return (
    <div>
      <Router>
        <HashRouter>
          <Switch>
          <Route path="/"  component={navbar} />
          <Route path="/layout" exact component={layout} />
          <Route path="/cell" component={cell} />
          </Switch>
        </HashRouter>
      </Router>
    </div>
  );
}

export default App;
