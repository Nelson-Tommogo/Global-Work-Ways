import React, { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Modal content
  const modalContents = {
    terms: {
      title: "Terms of Service",
      content: (
        <div>
          <h3>Global Work Ways Service Fee Terms of Service</h3>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p>Welcome to Global Work Ways Service Fee! These Terms of Service govern your use of our platform.</p>
          <h4>1. Payment Processing</h4>
          <p>We provide secure payment processing services with industry-standard encryption.</p>
          <h4>3. Prohibited Activities</h4>
          <p>You may not use our services for illegal activities or violate any laws.</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div>
          <h3>Global Work Ways Service Fee Privacy Policy</h3>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p>We are committed to protecting your personal information.</p>
          <h4>1. Information We Collect</h4>
          <p>We collect information you provide during registration and transaction processing.</p>
          <h4>2. How We Use Information</h4>
          <p>Your information is used to provide services, prevent fraud, and improve our platform.</p>
          <h4>3. Data Security</h4>
          <p>We implement security measures to protect your data from unauthorized access.</p>
        </div>
      )
    },
    cookies: {
      title: "Cookie Policy",
      content: (
        <div>
          <h3>Global Work Ways Service Fee Cookie Policy</h3>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p>We use cookies to enhance your experience on our platform.</p>
          <h4>1. What Are Cookies</h4>
          <p>Cookies are small text files stored on your device when you visit websites.</p>
          <h4>2. How We Use Cookies</h4> 
          <p>We use cookies for authentication, preferences, analytics, and security purposes.</p>
          <h4>3. Managing Cookies</h4>
          <p>You can control cookies through your browser settings.</p>
        </div>
      )
    },
    help: {
      title: "Help Center",
      content: (
        <div>
          <h3>Global Work Ways Service Fee Help Center</h3>
          <p>Find answers to common questions and issues.</p>
          <h4>Getting Started</h4>
          <p>Learn how to create an account and set up payment processing.</p>
          <h4>Account Management</h4>
          <p>How to update your profile, change password, and manage security settings.</p>
          <h4>Payment Issues</h4>
          <p>Troubleshooting failed transactions and payment processing delays.</p>
        </div>
      )
    },
    contact: {
      title: "Contact Us",
      content: (
        <div>
          <h3>Contact Global Work Ways Service Fee Support</h3>
          <p>We're here to help with any questions or issues.</p>
          <h4>Email Support</h4>
          <p>support@globalworkways.com (Response within 24 hours)</p>
          <h4>Phone Support</h4>
          <p>1-800-PAY-HUB (Available 9AM-5PM EST, Monday-Friday)</p>
          <h4>Live Chat</h4>
          <p>Available through your dashboard when logged in.</p>
        </div>
      )
    },
    faq: {
      title: "Frequently Asked Questions",
      content: (
        <div>
          <h3>Global Work Ways Service Fee FAQ</h3>
          <h4>How do I create an account?</h4>
          <p>Click the "Sign Up" button and follow the registration process.</p>
          <h4>What payment methods do you support?</h4>
          <p>We support all major credit cards, bank transfers, and digital wallets.</p>
          <h4>How long do withdrawals take?</h4>
          <p>Standard withdrawals take 2-3 business days to reach your bank account.</p>
          <h4>Is there a transaction fee?</h4>
          <p>We charge a small processing fee of 2.9% + $0.30 per transaction.</p>
        </div>
      )
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Checkout</h3>
              <p>Secure, simple payment processing for your business.</p>
            </div>
            
            <div className="footer-section">
              <h3>Legal</h3>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={() => openModal('terms')}>Terms of Service</button></li>
                <li><button className="footer-link-btn" onClick={() => openModal('privacy')}>Privacy Policy</button></li>
                <li><button className="footer-link-btn" onClick={() => openModal('cookies')}>Cookie Policy</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Support</h3>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={() => openModal('help')}>Help Center</button></li>
                <li><button className="footer-link-btn" onClick={() => openModal('contact')}>Contact Us</button></li>
                <li><button className="footer-link-btn" onClick={() => openModal('faq')}>FAQ</button></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Global Work Ways Service Fee. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalContents[activeModal].title}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              {modalContents[activeModal].content}
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}