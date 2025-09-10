'use client';

import { useState } from "react";
import { MapPin, Check, X } from 'lucide-react';

// DELIVERY ADDRESS COMPONENT - Collects and validates delivery address
interface DeliveryAddressProps {
  onConfirm: (address: string) => void;
  onCancel?: () => void;
  currentAddress?: string;
  isOpen: boolean;
}

const DeliveryAddress = ({ onConfirm, onCancel, currentAddress = "", isOpen }: DeliveryAddressProps) => {
  const [address, setAddress] = useState(currentAddress);
  const [isValid, setIsValid] = useState(false);

  // VALIDATION LOGIC - Modify these rules to change address validation
  const validateAddress = (addr: string) => {
    const trimmedAddr = addr.trim();
    // Basic validation: address should be at least 10 characters and contain numbers
    const hasMinLength = trimmedAddr.length >= 10;
    const hasNumbers = /\d/.test(trimmedAddr);
    const hasLetters = /[a-zA-Z]/.test(trimmedAddr);
    
    return hasMinLength && hasNumbers && hasLetters;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsValid(validateAddress(newAddress));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      alert("Please enter your delivery address");
      return;
    }
    
    if (!validateAddress(trimmedAddress)) {
      alert("Please enter a complete address with street number, street name, and city");
      return;
    }
    
    onConfirm(trimmedAddress);
  };

  if (!isOpen) return null;

  return (
    // MODAL OVERLAY - Styled modal for address collection
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
              <p className="text-sm text-gray-600">Where should we deliver your order?</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address *
              </label>
              <textarea
                value={address}
                onChange={handleAddressChange}
                placeholder="e.g., 123 Main Street, Apartment 4B&#10;City, State, ZIP Code&#10;&#10;Please include:&#10;• Street number and name&#10;• Apartment/unit if applicable&#10;• City and ZIP code"
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-200 ${
                  address.length > 0
                    ? isValid
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                required
              />
              
              {/* Validation indicators */}
              {address.length > 0 && (
                <div className="mt-2 flex items-center text-sm">
                  {isValid ? (
                    <div className="flex items-center text-green-600">
                      <Check size={16} className="mr-1" />
                      <span>Address looks good!</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <X size={16} className="mr-1" />
                      <span>Please enter a complete address</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DELIVERY INFO - You can modify this text */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">📍 Delivery Information:</p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• Delivery typically takes 30-45 minutes</li>
                  <li>• We deliver within a 5-mile radius</li>
                  <li>• Please ensure someone is available to receive the order</li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={!isValid}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Confirm Address
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
