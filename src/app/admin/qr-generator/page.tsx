'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Download, QrCode } from 'lucide-react';

export default function QRGenerator() {
  const [tableNumbers, setTableNumbers] = useState<string>('1-10');
  const [qrCodes, setQrCodes] = useState<{ tableNumber: string; qrDataUrl: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCodes = async () => {
    setIsGenerating(true);
    const codes: { tableNumber: string; qrDataUrl: string }[] = [];

    try {
      // Parse table numbers (support ranges like "1-10" or individual numbers like "1,2,3")
      let tables: number[] = [];
      
      if (tableNumbers.includes('-')) {
        const [start, end] = tableNumbers.split('-').map(n => parseInt(n.trim()));
        for (let i = start; i <= end; i++) {
          tables.push(i);
        }
      } else {
        tables = tableNumbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      }

      for (const tableNumber of tables) {
        const url = `${window.location.origin}/?table=${tableNumber}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        codes.push({
          tableNumber: tableNumber.toString(),
          qrDataUrl
        });
      }

      setQrCodes(codes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      alert('Error generating QR codes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = (qrDataUrl: string, tableNumber: string) => {
    const link = document.createElement('a');
    link.download = `table-${tableNumber}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const downloadAllQRs = () => {
    qrCodes.forEach(({ qrDataUrl, tableNumber }) => {
      setTimeout(() => downloadQR(qrDataUrl, tableNumber), 100 * parseInt(tableNumber));
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Code Generator</h1>
          <p className="text-xl text-gray-600">
            Generate QR codes for your restaurant tables
          </p>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="tableNumbers" className="block text-sm font-medium text-gray-700 mb-2">
              Table Numbers
            </label>
            <input
              type="text"
              id="tableNumbers"
              value={tableNumbers}
              onChange={(e) => setTableNumbers(e.target.value)}
              placeholder="e.g., 1-10 or 1,2,3,4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use ranges (1-10) or comma-separated numbers (1,2,3)
            </p>
          </div>
          <button
            onClick={generateQRCodes}
            disabled={isGenerating}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <QrCode size={16} />
            <span>{isGenerating ? 'Generating...' : 'Generate QR Codes'}</span>
          </button>
        </div>

        {/* Generated QR Codes */}
        {qrCodes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generated QR Codes</h2>
              <button
                onClick={downloadAllQRs}
                className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Download All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {qrCodes.map(({ tableNumber, qrDataUrl }) => (
                <div key={tableNumber} className="bg-white rounded-lg shadow-sm p-4 text-center">
                  <h3 className="text-lg font-semibold mb-4">Table {tableNumber}</h3>
                  <div className="mb-4">
                    <Image
                      src={qrDataUrl}
                      alt={`QR Code for Table ${tableNumber}`}
                      width={192}
                      height={192}
                      className="mx-auto"
                    />
                  </div>
                  <button
                    onClick={() => downloadQR(qrDataUrl, tableNumber)}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">How to Use QR Codes</h3>
          <div className="space-y-2 text-gray-600">
            <p>1. Generate QR codes for your restaurant tables using the form above</p>
            <p>2. Download and print the QR codes</p>
            <p>3. Place each QR code on its corresponding table</p>
            <p>4. When customers scan the QR code, they&apos;ll be taken to the homepage with their table number automatically detected</p>
            <p>5. Customers can then browse the menu and place orders directly from their table</p>
          </div>
        </div>
      </div>
    </div>
  );
}
