import React, { useState } from 'react';
import './StripeLikePage.css';
import visaImage from './assets/amazon.png';
import mastercardImage from './assets/mastercard.png';
import card from './assets/eway.png';
import paycard from './assets/ebay.png';
import applePayImage from './assets/applepay.png';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
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

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentStatus('processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isSuccess = Math.random() > 0.3;
      setPaymentStatus(isSuccess ? 'success' : 'error');
    } catch (err) {
      setPaymentStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const resetForm = () => {
    setPaymentStatus(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      cardNumber: '•••• •••• •••• 4242',
      expiry: '••/••',
      cvc: '•••'
    });
  };

  return (
    <div className="stripe-container">
      <div className="stripe-header">
        <h1>Complete your purchase</h1>
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
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+1 (555) 123-4567" 
                  required 
                />
              </div>
              
              <div className="payment-methods">
                <h3>Payment Method</h3>
                
                <div className="apple-pay-container">
                  <img 
                    src={applePayImage} 
                    alt="Apple Pay" 
                    className="apple-pay-button"
                    style={{ cursor: 'not-allowed' }}
                  />
                  <div className="payment-method-divider">
                    <span>or pay with card</span>
                  </div>
                </div>
                
                <div className="payment-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Information</label>
                    <div className="card-input-wrapper">
                      <input 
                        type="text" 
                        id="cardNumber" 
                        name="cardNumber" 
                        value={formData.cardNumber} 
                        readOnly
                        className="card-input read-only-input"
                      />
                      <div className="card-brand-icons">
                        <img src={visaImage} alt="Visa" className="card-brand-icon" />
                        <img src={mastercardImage} alt="Mastercard" className="card-brand-icon" />
                        <img src={card} alt="Mastercard" className="card-brand-icon" />
                        <img src={paycard} alt="Mastercard" className="card-brand-icon" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="expiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="expiry" 
                        name="expiry" 
                        value={formData.expiry} 
                        readOnly
                        className="read-only-input"
                      />
                    </div>
                    
                    <div className="form-group half">
                      <label htmlFor="cvc">CVC</label>
                      <input 
                        type="text" 
                        id="cvc" 
                        name="cvc" 
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
                {isSubmitting ? 'Processing...' : `Pay $300.00 USD`}
              </button>
            </form>
          ) : (
            <div className={`payment-result ${paymentStatus}`}>
              {paymentStatus === 'success' ? (
                <>
                  <FaCheckCircle className="result-icon success" />
                  <h3>Payment Successful!</h3>
                  <p>Thank you for your payment of $300.00 USD</p>
                  <p>A receipt has been sent to {formData.email}</p>
                  <button 
                    onClick={resetForm}
                    className="submit-button"
                  >
                    Make Another Payment
                  </button>
                </>
              ) : (
                <>
                  <FaTimesCircle className="result-icon error" />
                  <h3>Payment Failed</h3>
                  <p>We couldn't process your payment of $300.00 USD</p>
                  <p>Please try again or use a different payment method</p>
                  <button 
                    onClick={resetForm}
                    className="submit-button"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}