import { CheckCircle, XCircle } from "lucide-react";

export function PaymentStatusBanner({ paymentStatus, onClose }) {
  if (!paymentStatus) return null;

  if (paymentStatus === "success") {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <CheckCircle
              size={24}
              className="text-green-600 dark:text-green-400 mr-3"
            />
            <div className="flex-1">
              <p className="font-semibold text-green-800 dark:text-green-200">
                Payment Successful!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your payment is being processed and funds are held in escrow.
                The freelancer will be notified.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "cancelled") {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <XCircle
              size={24}
              className="text-yellow-600 dark:text-yellow-400 mr-3"
            />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                Payment Cancelled
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Your payment was cancelled. No charges were made.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
