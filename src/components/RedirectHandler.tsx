import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RedirectHandler is a global observer that ensures authenticated users
 * with missing profiles are always redirected to the profile creation page.
 */
const RedirectHandler: React.FC = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only redirect if loading is finished
        if (loading) return;

        // If the user is logged in but has no profile data
        if (user && !profile) {
            // Avoid infinite loops by checking the current path
            if (location.pathname !== '/profile-creation' && location.pathname !== '/login') {
                console.log('User authenticated but no profile found. Redirecting to profile creation...');
                navigate('/profile-creation', { replace: true });
            }
        }
    }, [user, profile, loading, navigate, location.pathname]);

    return null; // This component doesn't render anything
};

export default RedirectHandler;
