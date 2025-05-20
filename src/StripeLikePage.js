import React, { useState, useEffect } from 'react';
import './StripeLikePage.css';
import visaImage from './assets/visa.png';
import mastercardImage from './assets/mastercard.png';
import amexImage from './assets/amex.png';
import amazonImage from './assets/amazon.png';
import discoverImage from './assets/discover.png';
import ebayImage from './assets/ebay.png';
import applePayImage from './assets/applepay.png';
import { FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa';

const SuccessDialog = ({ onClose, countdown, amountUSD, email }) => (
  <div className="dialog-overlay">
    <div className="dialog-box success-dialog">
      <div className="dialog-icon">
        <FaCheckCircle className="success-icon" />
      </div>
      <h3>Payment Request Successful sent!</h3>
      <p>Check your phone to complete the payment</p>
      <p>We will keep a receipt of your payment</p>
      <p>Check your phone for M-Pesa confirmation message after completing transaction</p>
      <div className="dialog-countdown">
        Closing in {countdown} seconds...
      </div>
      <button 
        onClick={onClose}
        className="dialog-button success-button"
      >
        OK
      </button>
    </div>
  </div>
);

const ErrorDialog = ({ onRetry, errorMessage, countdown }) => (
  <div className="dialog-overlay">
    <div className="dialog-box error-dialog">
      <div className="dialog-icon">
        <FaTimesCircle className="error-icon" />
      </div>
      <h3>Payment Failed</h3>
      <p className="error-message">{errorMessage}</p>
      <div className="dialog-countdown">
        Closing in {countdown} seconds...
      </div>
      <button 
        onClick={onRetry}
        className="dialog-button error-button"
      >
        <FaRedo className="retry-icon" /> Try Again
      </button>
    </div>
  </div>
);

function Card({ children }) {
  return <div className="card">{children}</div>;
}

export default function StripeLikePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [activePaymentMethod, setActivePaymentMethod] = useState('mpesa');
  const [currentRotatingIcon, setCurrentRotatingIcon] = useState(0);
  
  const fixedAmountUSD = 300;
  const fixedAmountKES = 42777;
  const rotatingIcons = [amazonImage, discoverImage, ebayImage];

  // Auto-rotate card brands
  useEffect(() => {
    if (activePaymentMethod === 'card') {
      const interval = setInterval(() => {
        setCurrentRotatingIcon((prev) => (prev + 1) % rotatingIcons.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activePaymentMethod]);

  // Auto-redirect after 10 seconds
  useEffect(() => {
    let timer;
    if (paymentStatus === 'success' || paymentStatus === 'error') {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            resetForm();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStatus]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activePaymentMethod === 'stripe') {
      window.open('https://stripe.com', '_blank');
      return;
    }
    
    setIsSubmitting(true);
    setPaymentStatus('processing');
    setErrorMessage('');
    setCountdown(10);

    try {
      let phone = formData.phone.replace(/\D/g, '');
      
      if (!phone.startsWith('254') && !phone.startsWith('+254')) {
        throw new Error('Please enter phone number in 254XXXXXXXXX or +254XXXXXXXXX format');
      }
      
      if (phone.startsWith('+')) {
        phone = phone.substring(1);
      }

      if (phone.length !== 12) {
        throw new Error('Phone number must be 12 digits (254XXXXXXXXX)');
      }

      const payload = {
        phoneNumber: phone,
        amount: fixedAmountKES
      };

      const response = await fetch('https://till-r74x.onrender.com/api/stk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Payment request failed');
      }

      const isStkPushInitiated =
        result.message?.toLowerCase().includes('stk push request sent successfully') ||
        result.responseDescription?.toLowerCase().includes('request accepted');

      if (isStkPushInitiated) {
        setPaymentStatus('processing');
        setTimeout(() => {
          setPaymentStatus('success');
        }, 7000);
      } else {
        throw new Error(result.error || result.message || result.responseDescription || 'STK Push failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err.message);
      setPaymentStatus('error');
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPaymentStatus(null);
    setCountdown(10);
  };

  const retryPayment = () => {
    setPaymentStatus(null);
    setCountdown(10);
  };

  const handlePaymentMethodChange = (method) => {
    setActivePaymentMethod(method);
  };

  return (
    <div className="stripe-container">
      <div className="stripe-header">
        <h1>Global Work Ways</h1>
      </div>
      
      <div className="stripe-content">
        <Card>
          {paymentStatus === null ? (
            <form onSubmit={handleSubmit}>
              {/* Apple Pay Button */}
              <div 
                className={`payment-method-button apple-pay-button ${activePaymentMethod === 'applepay' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('applepay')}
              >
                <img 
                  src={applePayImage} 
                  alt="Apple Pay" 
                  className="apple-pay-logo"
                />
              </div>

              <div className="payment-method-divider">
                <span>or</span>
              </div>

              {/* M-Pesa Section */}
              <div 
                className={`payment-method-section ${activePaymentMethod === 'mpesa' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('mpesa')}
              >
                <h3 className="section-title">M-Pesa Global</h3>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">M-Pesa Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="254XXXXXXXXX" 
                    pattern="(\+254|254)\d{9}"
                    title="Enter phone number in 254XXXXXXXXX or +254XXXXXXXXX format"
                    required 
                  />
                  <small className="hint">Enter your M-Pesa registered phone number (format: 254XXXXXXXXX)</small>
                </div>
              </div>

              {/* Card Section */}
              <div 
                className={`payment-method-section ${activePaymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('card')}
              >
                <h3 className="section-title">Card Payment</h3>
                <div className="form-group">
                  <label>Card Information</label>
                  <div className="card-input-wrapper">
                    <input 
                      type="text" 
                      value="1234 1234 1234 1234" 
                      readOnly
                      className="card-input"
                      placeholder="Card number"
                    />
                    <div className="card-brand-icons">
                      <img src={visaImage} alt="Visa" className="card-brand-icon static" />
                      <img src={mastercardImage} alt="Mastercard" className="card-brand-icon static" />
                      <img src={amexImage} alt="American Express" className="card-brand-icon static" />
                      <img 
                        src={rotatingIcons[currentRotatingIcon]} 
                        alt="" 
                        className="card-brand-icon rotating"
                        key={currentRotatingIcon}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      value="MM/YY" 
                      readOnly
                      className="card-input"
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div className="form-group half">
                    <label>CVC</label>
                    <input 
                      type="text" 
                      value="CVC" 
                      readOnly
                      className="card-input"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              </div>

              {/* Stripe Global Pay Button */}
              <div 
                className={`payment-method-section stripe-global-section ${activePaymentMethod === 'stripe' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('stripe')}
              >
                <h3 className="section-title">Global Payment</h3>
                <p className="stripe-description">Pay with Stripe (credit cards, bank transfers, etc.)</p>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Pay $${fixedAmountUSD.toFixed(2)}`}
              </button>
            </form>
          ) : paymentStatus === 'processing' ? (
            <div className="payment-result processing">
              <div className="loading-spinner"></div>
              <h3>Processing Payment...</h3>
              <p>Please wait while we initiate the payment</p>
              {activePaymentMethod === 'mpesa' && (
                <p>You will receive an STK push on your phone shortly</p>
              )}
            </div>
          ) : null}
        </Card>
      </div>

      {paymentStatus === 'success' && (
        <SuccessDialog
          onClose={resetForm}
          countdown={countdown}
          amountUSD={fixedAmountUSD}
          email={formData.email}
        />
      )}

      {paymentStatus === 'error' && (
        <ErrorDialog
          onRetry={retryPayment}
          errorMessage={errorMessage}
          countdown={countdown}
        />
      )}
    </div>
  );
}