import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: '#4BB543',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 6,
        zIndex: 1000,
        fontSize: 16,
    }}>
        {message}
    </div>
);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Payment: React.FC = () => {
    const query = useQuery();
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const userId = query.get('userId');
    const stationId = query.get('stationId');
    const date = query.get('date');
    const time = query.get('time');
    const durationStr = query.get('duration');

    const parseDuration = (str: string | null): number => {
        if (!str) return 0;
        if (str.includes('hour')) {
            const match = str.match(/([\d.]+)/);
            return match ? Math.round(parseFloat(match[1]) * 60) : 0;
        }
        if (str.includes('min')) {
            const match = str.match(/(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
        }
        return 0;
    };

    const duration = parseDuration(durationStr);
    const amount = Math.ceil(duration / 30) * 150;

    const validateCardDetails = () => {
        const newErrors: { [key: string]: string } = {};

        if (!/^\d{16}$/.test(cardNumber)) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }

        if (!/^[a-zA-Z\s]+$/.test(nameOnCard)) {
            newErrors.nameOnCard = 'Invalid name on card';
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            newErrors.expiry = 'Expiry must be in MM/YY format';
        }

        if (!/^\d{3}$/.test(cvv)) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateCardDetails()) return;

        try {
            await axios.post('http://localhost:5000/api/payment', {
                userId,
                duration,
                stationId,
                amount,
                date,
                time,
            });
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate('/');
            }, 2000);
        } catch {
            alert('Payment failed. Please try again.');
        }
    };

    if (!userId || !duration || !stationId || !date || !time) {
        return <div>Invalid payment information.</div>;
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: `url('src/assets/payment.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
        >
            <div style={{
                width: '100%',
                maxWidth: 520,
                padding: '40px',
                borderRadius: '20px',
                background: 'rgba(30, 22, 22, 0.5)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '17px',
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 24 }}>Payment Summary</h2>

                <div style={{ marginBottom: 20, lineHeight: 1.8 }}>
                    {/* <p><strong>User ID:</strong> {userId}</p> */}
                    <p><strong>Station ID:</strong> {stationId}</p>
                    <p><strong>Duration:</strong> {duration} minutes</p>
                    <p><strong>Date & Time:</strong> {date} at {time}</p>
                    <p><strong>Amount:</strong> ₹{amount}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label>Card Number:</label><br />
                        <input
                            type="text"
                            maxLength={16}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            style={inputStyle}
                        />
                        {errors.cardNumber && <small style={errorText}>{errors.cardNumber}</small>}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label>Name on Card:</label><br />
                        <input
                            type="text"
                            value={nameOnCard}
                            onChange={(e) => setNameOnCard(e.target.value)}
                            style={inputStyle}
                        />
                        {errors.nameOnCard && <small style={errorText}>{errors.nameOnCard}</small>}
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label>Expiry (MM/YY):</label><br />
                            <input
                                type="text"
                                maxLength={5}
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                style={inputStyle}
                            />
                            {errors.expiry && <small style={errorText}>{errors.expiry}</small>}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>CVV:</label><br />
                            <input
                                type="password"
                                maxLength={3}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                style={inputStyle}
                            />
                            {errors.cvv && <small style={errorText}>{errors.cvv}</small>}
                        </div>
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        padding: '14px',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 18,
                        cursor: 'pointer'
                    }}>
                        Pay ₹{amount}
                    </button>
                </form>

                {showToast && <Toast message="Payment successful!" />}
            </div>
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    marginTop: '6px',
    color: '#000',
};

const errorText: React.CSSProperties = {
    color: '#ff8080',
    fontSize: '14px',
};

export default Payment;
