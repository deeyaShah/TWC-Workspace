import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEdit,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Checkout1 = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleRazorpay = () => {
    const options = {
      key: "rzp_test_Abc123456789",
      amount: 24900,
      currency: "INR",
      name: "My Cool Store",
      description: "AC Purchase",
      image: "/ElectroEra_logo.png",
      handler: function (response) {
        toast.success("Payment successful via Razorpay!");
        setStep(3);
      },
      prefill: {
        name: "Anjali Prajapati",
        email: "prajapatianjali@gmail.com",
        contact: "9106574106",
      },
      notes: {
        address: "30, Prajapati society, Odhav, Ahmedabad",
      },
      theme: {
        color: "#2563EB",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCOD = () => {
    toast.success("Order placed with Cash on Delivery!");
    setStep(3);
  };

  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  // const navigate = useNavigate();

  const steps = ["Checkout", "Payment", "Confirmation"];
  const StepHeader = () => (
    <div className="flex items-center justify-between w-full max-w-md mb-6">
      {steps.map((label, index) => {
        const isActive = step === index + 1;
        const isCompleted = step > index + 1;

        return (
          <div key={index} className="flex-1 flex items-center">
            {/* Circle */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full border 
              ${
                isCompleted
                  ? "bg-gray-500 text-white border-gray-500"
                  : isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-gray-500 text-gray-500"
              }`}
            >
              {index + 1}
            </div>

            {/* Label */}
            <span
              className={`ml-2 text-sm 
              ${
                isCompleted
                  ? "text-gray-500"
                  : isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {label}
            </span>

            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 
                ${step > index + 1 ? "bg-gray-500" : "bg-gray-300"}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-500 to-gray-800 flex items-center justify-center p-4 sm:p-10">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10">
        <StepHeader />

        <div className="space-y-6">
          {step === 1 && (
            <>
              {/* Product Info */}
              <div className="flex bg-gray-50 rounded-xl p-4 border shadow-sm">
                <img
                  src="AC_1.png"
                  alt="Haier AC"
                  className="w-28 h-28 object-cover rounded-lg"
                />
                <div className="ml-4 flex flex-col justify-between space-y-2 text-sm">
                  <span className="font-semibold text-base">Haier AC</span>
                  <span>
                    <b>Price:</b> ₹2499{" "}
                    <span className="line-through text-gray-500">₹2999</span>
                  </span>
                  <span className="text-green-600 font-medium">19% Off</span>
                  <p className="text-gray-600">One-year warranty included.</p>
                  <p>
                    <b>Color:</b> Black
                  </p>
                  <p>
                    <b>Qty:</b> 1
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-4 border shadow-sm">
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p className="flex items-center gap-2 text-sm">
                  Anjali Prajapati
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <FaPhone /> +919106574106
                </p>
                <p className="text-sm mt-1">
                  <FaMapMarkerAlt className="inline-block" /> 30, Prajapati
                  society, Rajendra park road, Odhav, Ahmadabad City, Gujarat,
                  382415
                </p>
                {/* <button className="mt-2 flex items-center text-blue-500 hover:underline text-sm gap-1"> */}
                {/* <FaEdit /> */}
                {/* Change */}
                {/* </button> */}
                <Link
                  to="/edit-address"
                  className="mt-2 flex items-center text-blue-500 hover:underline text-sm gap-1"
                >
                  <FaEdit />
                  Change
                </Link>
              </div>

              {/* Price and Continue */}
              <div className="bg-gray-50 rounded-xl p-4 border shadow-sm">
                <h3 className="font-semibold mb-2">Price Details</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total</span>
                  <span className="font-bold">₹2499</span>
                </div>
                <span className="text-green-600 text-sm">₹500 OFF</span>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={nextStep}
                    className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    Continue <FaArrowRight />
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="p-4">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                  Select Payment Method
                </h2>

                <div className="space-y-4">
                  {/* COD */}
                  <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-blue-600 mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay at your doorstep
                      </p>
                    </div>
                  </label>

                  {/* Razorpay */}
                  <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-blue-600 mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        Online Payment
                      </p>
                      <p className="text-sm text-gray-500">
                        UPI / Card / Netbanking
                      </p>
                    </div>
                  </label>
                </div>

                {/* Button */}
                <div className="mt-6 text-center">
                  {paymentMethod === "razorpay" ? (
                    <button
                      onClick={handleRazorpay}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      Pay with Razorpay
                    </button>
                  ) : (
                    <button
                      onClick={handleCOD}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition"
                    >
                      Place Order (COD)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center bg-gray-50 rounded-xl p-6 shadow-sm">
              <FaCheckCircle className="text-blue-600 text-4xl mx-auto" />
              <h2 className="text-xl font-bold mt-2">Order Confirmed</h2>
              <p className="text-1xl">
                Thank you for your purchase! <br />
                <spna className="text-sm">Your order has been placed.</spna>
              </p>
              <p className="text-green-600 font-medium mt-2">
                Estimated Delivery: <b>16 April</b>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Order ID: <b>#ORD12345678</b>
              </p>

              <div className="text-left mt-4 text-sm bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <p>
                  <b>Product:</b> Haier AC
                </p>
                <p>
                  <b>Qty:</b> 1
                </p>
                <p>
                  <b>Total Paid:</b> ₹2499
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {/* onClick={() => navigate("/")} */}
                <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-800 transition">
                  Continue Shopping
                </button>
                {/* <button className="block mx-auto text-blue-600 hover:underline text-sm"> */}
                {/* Continue Shopping */}
                {/* </button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout1;