'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const status = searchParams.get('payment');
  const transactionId = searchParams.get('oid');
  const amount = searchParams.get('amt');

  useEffect(() => {
    // You can add analytics or notification logic here
    if (status === 'success') {
      console.log('Payment successful:', { transactionId, amount });
      // Clear cart or redirect logic can be added here
    } else if (status === 'failed') {
      console.log('Payment failed:', { transactionId, amount });
    }
  }, [status, transactionId, amount]);

  if (status === 'success') {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully and payment has been received.
              </p>
              {transactionId && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <strong>Transaction ID:</strong> {transactionId}
                  </p>
                  {amount && (
                    <p className="text-sm text-green-800">
                      <strong>Amount Paid:</strong> NPR {amount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="space-x-4">
              <Link
                href="/menu"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
              >
                Order Again
              </Link>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-block"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
              <p className="text-gray-600 mb-6">
                Unfortunately, your payment could not be processed. Please try again.
              </p>
              {transactionId && (
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    <strong>Transaction ID:</strong> {transactionId}
                  </p>
                </div>
              )}
            </div>
            <div className="space-x-4">
              <Link
                href="/cart"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
              >
                Try Again
              </Link>
              <Link
                href="/menu"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-block"
              >
                Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default loading state
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="mb-6">
            <Clock className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Payment...</h1>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
