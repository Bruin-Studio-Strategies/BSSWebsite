import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import Landing from "./pages/Landing/Landing.jsx"


function App() {
  return (
    <Router>
      <Route path="/" Component={Landing} exact/>
    </Router>
  );
}

export default App;
