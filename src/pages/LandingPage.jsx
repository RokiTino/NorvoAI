import React, { useState, useEffect } from 'react';
import '../styles/LandingPage.css';
import '../styles/global.css';

const LandingPage = ({ onNavigate, session }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '🔄',
      title: 'Notion → Jira Sync',
      description: 'Convert meeting notes into Jira epics, stories, and subtasks with AI-generated acceptance criteria.',
      color: 'blue'
    },
    {
      icon: '📝',
      title: 'AI Documentation',
      description: 'Generate PRDs, technical specs, sprint summaries, and release notes in seconds.',
      color: 'orange'
    },
    {
      icon: '🤖',
      title: 'Team AI Agent',
      description: 'Detect overdue tasks, suggest backlog cleaning, predict delays, and send notifications.',
      color: 'purple'
    },
    {
      icon: '⚡',
      title: 'Two-Way Sync',
      description: 'Keep Notion and Jira perfectly synchronized with real-time bidirectional updates.',
      color: 'blue'
    },
    {
      icon: '📊',
      title: 'Weekly Reports',
      description: 'AI-generated progress reports delivered automatically to your team.',
      color: 'orange'
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      description: 'Slack and Teams notifications for important updates and AI insights.',
      color: 'purple'
    }
  ];

  const pricingPlans = [
    {
      name: 'Solo',
      price: '9',
      description: 'Perfect for freelancers',
      features: ['1 workspace', '5 automations', 'Basic AI features', 'Email support']
    },
    {
      name: 'Small Team',
      price: '29',
      description: 'For growing teams',
      features: ['3 workspaces', '25 automations', 'Full AI features', 'Priority support', 'Slack integration'],
      popular: true
    },
    {
      name: 'Startup',
      price: '79',
      description: 'For fast-moving startups',
      features: ['10 workspaces', 'Unlimited automations', 'Advanced AI', 'GitHub integration', 'Custom templates']
    },
    {
      name: 'Company',
      price: '149',
      description: 'For established teams',
      features: ['Unlimited workspaces', 'Everything in Startup', 'SSO', 'Dedicated support', 'API access']
    }
  ];

  const testimonials = [
    {
      quote: "Norvo.AI saved our team 15 hours per week on documentation alone.",
      author: "Sarah Chen",
      role: "Engineering Manager",
      company: "TechStart Inc"
    },
    {
      quote: "The Jira-Notion sync is magic. Finally, everything stays in sync.",
      author: "Marcus Johnson",
      role: "Product Manager",
      company: "AgileFlow"
    },
    {
      quote: "Best investment we've made for our project management workflow.",
      author: "Elena Rodriguez",
      role: "CEO",
      company: "DevStudio"
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => onNavigate('landing')}>
            <div className="logo">
              <span className="logo-icon">N</span>
              <span className="logo-text">Norvo<span className="logo-highlight">.AI</span></span>
            </div>
          </div>
          <div className="nav-links hide-mobile">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
          </div>
          <div className="nav-actions">
            {session ? (
              <button className="btn btn-primary" onClick={() => onNavigate('dashboard')}>
                Dashboard
              </button>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => onNavigate('auth')}>
                  Sign In
                </button>
                <button className="btn btn-primary" onClick={() => onNavigate('auth')}>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid"></div>
        </div>
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="hero-badge">
            <span className="badge badge-orange">🚀 Now with AI-Powered Insights</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-line">Automate Your</span>
            <span className="hero-title-line text-gradient">Jira & Notion</span>
            <span className="hero-title-line">Workflows</span>
          </h1>
          <p className="hero-description">
            The AI-powered automation platform that connects your tools. 
            Create tasks, generate documentation, sync projects, and eliminate 
            repetitive work — all automatically.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('auth')}>
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn btn-secondary btn-lg">
              Watch Demo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">10k+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">500k+</span>
              <span className="stat-label">Tasks Automated</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-value">30hrs</span>
              <span className="stat-label">Saved per Week</span>
            </div>
          </div>
        </div>
        <div className={`hero-visual ${isVisible ? 'visible' : ''}`}>
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="preview-title">Norvo.AI Dashboard</span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-menu-item active"></div>
                <div className="preview-menu-item"></div>
                <div className="preview-menu-item"></div>
                <div className="preview-menu-item"></div>
              </div>
              <div className="preview-main">
                <div className="preview-card animate-float">
                  <div className="preview-card-icon blue">📋</div>
                  <div className="preview-card-content">
                    <div className="preview-card-title"></div>
                    <div className="preview-card-text"></div>
                  </div>
                </div>
                <div className="preview-card animate-float delay-200">
                  <div className="preview-card-icon orange">🤖</div>
                  <div className="preview-card-content">
                    <div className="preview-card-title"></div>
                    <div className="preview-card-text"></div>
                  </div>
                </div>
                <div className="preview-card animate-float delay-400">
                  <div className="preview-card-icon purple">📊</div>
                  <div className="preview-card-content">
                    <div className="preview-card-title"></div>
                    <div className="preview-card-text"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Bar */}
      <section className="integrations">
        <div className="container">
          <p className="integrations-label">Integrates with your favorite tools</p>
          <div className="integrations-logos">
            <div className="integration-logo">
              <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira" />
              <span>Jira</span>
            </div>
            <div className="integration-logo">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" />
              <span>Notion</span>
            </div>
            <div className="integration-logo">
              <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" alt="Slack" />
              <span>Slack</span>
            </div>
            <div className="integration-logo">
              <img src="https://cdn.worldvectorlogo.com/logos/github-icon-1.svg" alt="GitHub" />
              <span>GitHub</span>
            </div>
            <div className="integration-logo">
              <img src="https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg" alt="Teams" />
              <span>Teams</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">Features</span>
            <h2 className="section-title">
              Everything you need to <span className="text-gradient">automate your workflow</span>
            </h2>
            <p className="section-description">
              Powerful AI-driven features that transform how your team manages projects
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card feature-card-${feature.color}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`feature-icon feature-icon-${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-purple">How It Works</span>
            <h2 className="section-title">
              Get started in <span className="text-gradient-orange">3 simple steps</span>
            </h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Connect Your Tools</h3>
                <p>Link your Jira and Notion accounts with secure OAuth integration.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Set Up Automations</h3>
                <p>Choose from templates or create custom AI-powered workflows.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Watch the Magic</h3>
                <p>Sit back as Norvo.AI handles your repetitive tasks automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-orange">Pricing</span>
            <h2 className="section-title">
              Simple, <span className="text-gradient">transparent pricing</span>
            </h2>
            <p className="section-description">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3 className="pricing-name">{plan.name}</h3>
                <p className="pricing-description">{plan.description}</p>
                <div className="pricing-price">
                  <span className="price-currency">$</span>
                  <span className="price-value">{plan.price}</span>
                  <span className="price-period">/mo</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}
                  onClick={() => onNavigate('auth')}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-purple">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="text-gradient">thousands of teams</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-quote">"{testimonial.quote}"</div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to automate your workflow?</h2>
            <p className="cta-description">
              Join 10,000+ teams already using Norvo.AI to save time and boost productivity.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-orange btn-lg" onClick={() => onNavigate('auth')}>
                Start Free Trial
              </button>
              <button className="btn btn-secondary btn-lg">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">N</span>
                <span className="logo-text">Norvo<span className="logo-highlight">.AI</span></span>
              </div>
              <p className="footer-tagline">
                AI-powered workflow automation for modern teams.
              </p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Integrations</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Blog</a>
              <a href="#">Community</a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Norvo.AI. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;