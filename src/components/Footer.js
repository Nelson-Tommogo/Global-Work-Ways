import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="stripe-footer">
      <span onClick={() => window.open('https://stripe.com', '_blank')}>
        Powered by Stripe
      </span>
    </footer>
  );
}
