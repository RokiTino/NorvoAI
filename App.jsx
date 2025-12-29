import React, { useState, useEffect } from "react";
import { supabase } from "./src/services/supabase";
import LandingPage from "./src/pages/LandingPage";
import AuthPage from "./src/pages/AuthPage";
import Dashboard from "./src/pages/Dashboard";
import Automations from "./src/pages/Automations";
import Documentation from "./src/pages/Documentation";
import Settings from "./src/pages/Settings";
import Tasks from "./src/pages/Tasks";

const App = () => {
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState("landing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setCurrentPage("dashboard");
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentPage("landing");
  };

  const navigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Norvo.AI...</p>
      </div>
    );
  }

  // Render based on current page
  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={navigate} session={session} />;
      case "auth":
        return <AuthPage onNavigate={navigate} />;
      case "dashboard":
        return session ? (
          <Dashboard
            session={session}
            onNavigate={navigate}
            onSignOut={handleSignOut}
          />
        ) : (
          <AuthPage onNavigate={navigate} />
        );
      case "automations":
        return session ? (
          <Automations
            session={session}
            onNavigate={navigate}
            onSignOut={handleSignOut}
          />
        ) : (
          <AuthPage onNavigate={navigate} />
        );
      case "documentation":
        return session ? (
          <Documentation
            session={session}
            onNavigate={navigate}
            onSignOut={handleSignOut}
          />
        ) : (
          <AuthPage onNavigate={navigate} />
        );
      case "tasks":
        return session ? (
          <Tasks
            session={session}
            onNavigate={navigate}
            onSignOut={handleSignOut}
          />
        ) : (
          <AuthPage onNavigate={navigate} />
        );
      case "settings":
        return session ? (
          <Settings
            session={session}
            onNavigate={navigate}
            onSignOut={handleSignOut}
          />
        ) : (
          <AuthPage onNavigate={navigate} />
        );
      default:
        return <LandingPage onNavigate={navigate} session={session} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
};

export default App;
