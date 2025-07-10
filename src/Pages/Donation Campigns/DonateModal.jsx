import React, { useState } from "react";
import Modal from "react-modal";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const DonateModal = ({ isOpen, onClose, campaignId }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create payment intent
      const { data: clientSecret } = await axios.post("http://localhost:3000/create-payment-intent", {
        amount,
      });

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        // 3. Update campaign with donation
        await axios.post("http://localhost:3000/donations", {
          campaignId,
          amount,
          donorName: "Anonymous", // or get from auth/user context
        });
        alert("Donation successful!");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-semibold mb-4">Donate to this campaign</h2>
      <form onSubmit={handleDonate} className="space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
          className="w-full border p-2 rounded"
          placeholder="Enter amount"
        />
        <div className="border p-2 rounded">
          <CardElement />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >
          {loading ? "Processing..." : "Donate"}
        </button>
      </form>
    </Modal>
  );
};

export default DonateModal;
