import { useState, useEffect } from "react";

export function usePaymentStatus() {
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    // Check for payment status in URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      const transactionId = params.get("transaction");

      if (payment === "success" && transactionId) {
        setPaymentStatus("success");
        // Clear URL params after showing message
        window.history.replaceState({}, "", "/dashboard");
      } else if (payment === "cancelled") {
        setPaymentStatus("cancelled");
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, []);

  return { paymentStatus, setPaymentStatus };
}
