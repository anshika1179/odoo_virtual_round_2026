import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="footer-wrapper mt-auto">
      <footer>
        {/* Top gradient divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-900/15 to-transparent absolute top-0 left-0"></div>
        
        <div className="container footer-content">
          {/* Brand */}
          <Link to="/" className="flex flex-col items-center gap-3 group footer-logo">
            <img src="/images/logo.png" alt="Traveloop" className="w-12 h-12 rounded-2xl shadow-md group-hover:shadow-lg transition-shadow" />
            <span className="brand-font text-amber-950" style={{ fontSize: '36px', fontWeight: 700 }}>Traveloop.</span>
          </Link>
          
          {/* Hackathon Credits */}
          <div className="footer-hackathon">
            <h3 className="footer-title">
              Made for Odoo × Parul University Virtual Round
            </h3>

            <p className="footer-team-label">
              Team Members:
            </p>

            <p className="footer-team">
              ANSHIKA • KHUSHI PATEL • ATUL UPADHYAY • SATYAM KUMAR SINGH
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
