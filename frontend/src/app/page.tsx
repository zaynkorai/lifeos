import Link from 'next/link';
import { Nav } from './components/Nav';

// Monochrome SVG Icons
const Icons = {
    target: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    ),
    chart: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3v18h18" />
            <path d="M7 16l4-4 4 4 5-6" />
        </svg>
    ),
    brain: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 0 4.92 2.5 2.5 0 0 0 1.98 3A2.5 2.5 0 0 0 12 19.5" />
            <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1 0 4.92 2.5 2.5 0 0 1-1.98 3A2.5 2.5 0 0 1 12 19.5" />
            <path d="M12 4.5v15" />
        </svg>
    ),
    bolt: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    ),
    trending: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 7l-8.5 8.5-5-5L2 17" />
            <path d="M16 7h6v6" />
        </svg>
    ),
    sparkles: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            <circle cx="12" cy="12" r="4" />
        </svg>
    ),
    document: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
        </svg>
    ),
    grid: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    cube: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M3.27 6.96L12 12.01l8.73-5.05" />
            <path d="M12 22.08V12" />
        </svg>
    ),
    cpu: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
    ),
};

export default function HomePage() {
    return (
        <>
            {/* Top Banner - Scale Style */}
            <div className="top-banner">
                <span>Introducing LifeOS 2.2: Advanced Logic for Personal Goal Architectures.</span>
                <Link href="#">View Release →</Link>
            </div>

            {/* Navigation - Scale Style */}
            <Nav />

            <main className="main">
                {/* Hero Section - Scale Style */}
                <section className="hero">
                    <h1 className="hero-title">
                        Life Excellence Engineered.
                    </h1>
                    <p className="hero-subtitle">
                        LifeOS delivers proven systems, data, and outcomes to founders,
                        executives, and high-performance individuals.
                    </p>
                    <div className="hero-cta">
                        <button className="btn btn-primary">Get Started →</button>
                        <Link href="#" className="btn btn-link">Learn More →</Link>
                    </div>
                </section>

                {/* Logos Section - Scale Style */}
                <section className="logos-section">
                    <div className="container">
                        <p className="logos-label">
                            Trusted by high performers at leading companies worldwide
                        </p>
                        <div className="logos-grid">
                            <span className="logo-item">Google</span>
                            <span className="logo-item">OpenAI</span>
                            <span className="logo-item">Stripe</span>
                            <span className="logo-item">Notion</span>
                            <span className="logo-item">Linear</span>
                            <span className="logo-item">Vercel</span>
                        </div>
                    </div>
                </section>

                {/* Full-Stack Solutions - Scale Style Split Layout */}
                <section className="split-section" id="features">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">Deployment</span>
                            <h2 className="section-title">
                                Personal Systems, Scaled for Outcomes.
                            </h2>
                            <p className="section-subtitle">
                                From architecture to execution, LifeOS provides the infrastructure
                                required for sustainable high performance.
                            </p>
                        </div>

                        <div className="split-content">
                            <div className="split-list">
                                <div className="split-item active">
                                    <h3 className="split-item-title">Goal Architecture</h3>
                                    <p className="split-item-desc">
                                        Design and track ambitious goals with our proven OKR framework.
                                        Break down dreams into actionable milestones.
                                    </p>
                                </div>
                                <div className="split-item">
                                    <h3 className="split-item-title">AI Life Coach</h3>
                                    <p className="split-item-desc">
                                        Get personalized recommendations and guidance from our
                                        intelligent coaching system, available 24/7.
                                    </p>
                                </div>
                                <div className="split-item">
                                    <h3 className="split-item-title">Life Analytics</h3>
                                    <p className="split-item-desc">
                                        Gain deep insights into your patterns, progress, and potential
                                        with data-driven personal analytics.
                                    </p>
                                </div>
                                <div className="split-item">
                                    <h3 className="split-item-title">Smart Automation</h3>
                                    <p className="split-item-desc">
                                        Automate repetitive tasks and routines. Focus your energy
                                        on what truly matters.
                                    </p>
                                </div>
                            </div>
                            <div className="split-visual">
                                {Icons.cube}
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '48px' }}>
                            <button className="btn btn-primary">Get Started →</button>
                        </div>
                    </div>
                </section>

                {/* Bento Cards - Scale Agentic Solutions Style */}
                <section className="bento-section" id="solutions">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">Integrated Verticals</span>
                            <h2 className="section-title">
                                Precision Systems for Human Progress
                            </h2>
                            <p className="section-subtitle">
                                Transform raw ambition into measurable outcomes across career,
                                health, wealth, and cognitive domains.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Research / Frameworks Section - Scale Style Horizontal Scroll */}
                <section className="research-section" id="research">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">R&D and Frameworks</span>
                            <h2 className="section-title">
                                Frontier Research in Personal Engineering
                            </h2>
                            <p className="section-subtitle">
                                Our methodologies are built upon rigorous validation in behavioral
                                science, cognitive load management, and kinetic performance.
                            </p>
                        </div>

                        <div className="research-scroll">
                            <Link href="#" className="research-card">
                                <div className="research-icon">{Icons.chart}</div>
                                <span className="research-label">Framework</span>
                                <h3 className="research-title">OKR Life System</h3>
                                <span className="research-arrow">→</span>
                            </Link>

                            <Link href="#" className="research-card">
                                <div className="research-icon">{Icons.brain}</div>
                                <span className="research-label">Research</span>
                                <h3 className="research-title">Habit Formation Science</h3>
                                <span className="research-arrow">→</span>
                            </Link>

                            <Link href="#" className="research-card">
                                <div className="research-icon">{Icons.bolt}</div>
                                <span className="research-label">Framework</span>
                                <h3 className="research-title">Energy Management</h3>
                                <span className="research-arrow">→</span>
                            </Link>

                            <Link href="#" className="research-card">
                                <div className="research-icon">{Icons.target}</div>
                                <span className="research-label">Research</span>
                                <h3 className="research-title">Goal Achievement Patterns</h3>
                                <span className="research-arrow">→</span>
                            </Link>

                            <Link href="#" className="research-card">
                                <div className="research-icon">{Icons.trending}</div>
                                <span className="research-label">Framework</span>
                                <h3 className="research-title">Progress Tracking</h3>
                                <span className="research-arrow">→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Showcase Section - Scale Generative AI Style */}
                <section className="showcase-section">
                    <div className="container">
                        <div className="showcase-grid">
                            <div className="showcase-visual">
                                {Icons.cpu}
                            </div>
                            <div className="showcase-text">
                                <h3>Agentic Intelligence</h3>
                                <h2>Automated Personal Strategy and Guidance</h2>
                                <p>
                                    The LifeOS Logic Engine parses your behavioral data to deliver
                                    high-fidelity strategic guidance. Deploy agentic workflows that
                                    optimize your schedule, manage cognitive load, and ensure goal alignment.
                                </p>
                                <div className="hero-cta">
                                    <button className="btn btn-primary">Deploy Platform →</button>
                                    <Link href="#" className="btn btn-link">Read Documentation →</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonial Section - Scale Large Quote Style */}
                <section className="testimonial-section">
                    <div className="container">
                        <div className="testimonial-large">
                            <p className="testimonial-quote-large">
                                "LifeOS completely changed how I approach my goals. The AI coaching
                                feels like having a personal advisor available 24/7. I've achieved
                                more in 6 months than I did in the past 3 years."
                            </p>
                            <div className="testimonial-author-large">
                                <div className="testimonial-avatar-large">S</div>
                                <span className="testimonial-name">Sarah Chen</span>
                                <span className="testimonial-role">Founder & CEO, TechStart</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources Section - Scale Case Studies Style */}
                <section className="resources-section" id="resources">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">Field Reports</span>
                            <h2 className="section-title">Validation and Outcomes</h2>
                            <p className="section-subtitle">
                                Leading practitioners use LifeOS to manage complexity and drive personal ROI.
                            </p>
                        </div>

                        <div className="resources-grid">
                            <Link href="#" className="resource-card">
                                <div className="resource-image">{Icons.trending}</div>
                                <div className="resource-content">
                                    <span className="resource-tag">Case Study</span>
                                    <h3 className="resource-title">How a Startup CEO 10x'd Productivity</h3>
                                    <span className="resource-link">Read Case Study →</span>
                                </div>
                            </Link>

                            <Link href="#" className="resource-card">
                                <div className="resource-image">{Icons.target}</div>
                                <div className="resource-content">
                                    <span className="resource-tag">Guide</span>
                                    <h3 className="resource-title">The Complete OKR Framework for Life</h3>
                                    <span className="resource-link">Read Guide →</span>
                                </div>
                            </Link>

                            <Link href="#" className="resource-card">
                                <div className="resource-image">{Icons.brain}</div>
                                <div className="resource-content">
                                    <span className="resource-tag">Research</span>
                                    <h3 className="resource-title">The Science of Habit Formation</h3>
                                    <span className="resource-link">Read Research →</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Final CTA - Scale Style */}
                <section className="cta-section">
                    <div className="container">
                        <h2 className="cta-title">
                            The future of human agency starts with LifeOS.
                        </h2>
                        <button className="btn btn-primary">Architect Your Future →</button>
                    </div>
                </section>

                {/* Footer - Scale Style */}
                <footer className="footer">
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-brand">
                                <div className="footer-logo">LifeOS</div>
                                <p className="footer-tagline">
                                    The app system for ambitious individuals. Organize, optimize,
                                    and elevate every aspect of your life.
                                </p>
                            </div>

                            <div className="footer-column">
                                <h4>Product</h4>
                                <ul className="footer-links">
                                    <li><Link href="#">Features</Link></li>
                                    <li><Link href="#">Pricing</Link></li>
                                    <li><Link href="#">Integrations</Link></li>
                                    <li><Link href="#">Changelog</Link></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4>Resources</h4>
                                <ul className="footer-links">
                                    <li><Link href="#">Documentation</Link></li>
                                    <li><Link href="#">Guides</Link></li>
                                    <li><Link href="#">Blog</Link></li>
                                    <li><Link href="#">Community</Link></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4>Company</h4>
                                <ul className="footer-links">
                                    <li><Link href="#">About</Link></li>
                                    <li><Link href="#">Careers</Link></li>
                                    <li><Link href="#">Press</Link></li>
                                    <li><Link href="#">Contact</Link></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4>Legal</h4>
                                <ul className="footer-links">
                                    <li><Link href="#">Privacy</Link></li>
                                    <li><Link href="#">Terms</Link></li>
                                    <li><Link href="#">Security</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <p>© 2026 LifeOS. All rights reserved.</p>
                            <div className="footer-social">
                                <Link href="#">LinkedIn</Link>
                                <Link href="#">Twitter</Link>
                                <Link href="#">GitHub</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}
