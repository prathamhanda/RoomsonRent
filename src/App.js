import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateListing from './components/CreateListing.jsx';
// other imports...

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/pagelisting" component={CreateListing} />
        {/* other routes... */}
      </Switch>
    </Router>
  );
}

export default App; 