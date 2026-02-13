import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WellnessScan from './pages/WellnessScan';
import WellnessInsights from './pages/WellnessInsights';
import HealthStats from './pages/HealthStats';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scan" element={<WellnessScan />} />
                <Route path="/insights" element={<WellnessInsights />} />
                <Route path="/stats" element={<HealthStats />} />
            </Routes>
        </Router>
    );
}

export default App;
