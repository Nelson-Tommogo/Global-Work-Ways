import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="stripe-footer">
      <div className="footer-content">
        <span onClick={() => window.open('https://stripe.com', '_blank')}>
          Powered by <strong>stripe</strong>
        </span>
        <span className="footer-text"> | Terms Privacy</span>
      </div>
    </footer>
  );
}
