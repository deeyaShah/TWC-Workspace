import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get order ID from URL
import axios from 'axios';
import toast from 'react-hot-toast'; 
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './InvoiceForm.css';

const InvoiceForm = () => {
    const { orderId } = useParams(); // Get the orderId from URL
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`https://twc-workspace.onrender.com/api/orders/order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token if protected route
                    },
                });
                setOrderData(data);
                toast.success('Order loaded successfully ✅');
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Failed to load order ❌');
            }
        };

        fetchOrder();
    }, [orderId]);

    if (!orderData) {
        return <div>Loading Invoice...</div>;
    }

    const { _id, items, address, totalPrice, paymentMethod, createdAt, user } = orderData;

    const downloadPDF = () => {
        const input = document.getElementById('invoice');
        html2canvas(input).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = 190;
          const pageHeight = pdf.internal.pageSize.height;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
    
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
    
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
    
          pdf.save('invoice.pdf');
          toast.success('Invoice downloaded ✅'); // ✅ Toast after download
        }).catch(() => {
          toast.error('Failed to download invoice ❌'); // ✅ Toast on error
        });
      };

    const formatAddress = (addressObj) => {
        if (!addressObj) return '';
        return `${addressObj.street}, ${addressObj.city}, ${addressObj.state}, ${addressObj.zipcode}, ${addressObj.country}`;
    };

    return (
        <div className="invoice-container" id="invoice">
            <div className="invoice-header">
                <div className="company-info">
                    <img src="/images/Logo.png" alt="Company Logo" className="company-logo" />
                    <p className="company-name">The Wood Culture</p>
                    <p>106, Dream Rise Complex, 
                        Opp. Capital,
                         Science City Road, Sola, Ahmedabad-380058, Gujarat, India</p>
                </div>
                <div className="invoice-info">
                    <p className="invoice-title">Invoice</p>
                    <p>Order ID: {orderId}</p>
                </div>
            </div>

            <div className="customer-info">
                <p className="client-details-title"><strong>Client Details</strong></p>
                <p>Client Name: {user?.username}</p>
                <p>Email: {user?.email}</p>
                {/* <p>Delivery Address: {formatAddress(address)}</p> */}
                <p>
                    Delivery Address: 
                    {[address.address, address.city, address.state, address.postalCode]
                        .filter(part => part) // remove undefined/null
                        .join(', ')}
                </p>
                <p>PhoneNo:{[address.phoneNumber]}</p>
                <p>Placed Order: {new Date(createdAt).toLocaleDateString()}</p>
            </div>

            <p className="product-details-title"><strong>Product Details</strong></p>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Price (₹)</th>
                        <th>Total (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="invoice-footer">
                <div className="order-details">
                    <p className="order-details-title"><strong>Order Details</strong></p>
                    <p><strong>Order Total: ₹{totalPrice}</strong></p>
                </div>

                <p className="payment-details-title"><strong>Payment Details</strong></p>
                <p>Payment Mode: {paymentMethod}</p>

                <div className="download-invoice">
                    <button onClick={downloadPDF}>Download Invoice</button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;
