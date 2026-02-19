import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WellnessScan from './pages/WellnessScan';
import WellnessInsights from './pages/WellnessInsights';
import WellnessHistory from './pages/WellnessHistory';
import MorningRoutine from './pages/MorningRoutine';
import RoutineTransition from './pages/RoutineTransition';
import Community from './pages/Community';

import { AudioProvider } from './context/AudioContext';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ProfileCreation from './pages/ProfileCreation';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import RedirectHandler from './components/RedirectHandler';

function App() {
    return (
        <AuthProvider>
            <AudioProvider>
                <Router>
                    <RedirectHandler />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile-creation" element={
                            <ProtectedRoute requireProfile={false}>
                                <ProfileCreation />
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={<Home />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/morning-routine" element={<MorningRoutine />} />
                        <Route path="/transition" element={<RoutineTransition />} />
                        <Route path="/scan" element={<WellnessScan />} />
                        <Route path="/insights" element={<WellnessInsights />} />
                        <Route path="/history" element={<WellnessHistory />} />
                        <Route path="/stats" element={<WellnessHistory />} /> {/* Fallback/Legacy */}
                    </Routes>
                </Router>
            </AudioProvider>
        </AuthProvider>
    );
}


export default App;
