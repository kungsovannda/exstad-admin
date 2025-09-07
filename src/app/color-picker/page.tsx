"use client";
import { useState } from "react";
import ColorPicker from "react-best-gradient-color-picker";

export default function GradientColorInput() {
  const [inputValue, setInputValue] = useState("");
  const [tempColor, setTempColor] = useState(
    "linear-gradient(90deg, rgba(96,165,250,1) 0%, rgba(168,85,247,1) 100%)"
  );
  const [showPopup, setShowPopup] = useState(false);

  const handleSelectClick = () => {
    setShowPopup(true);
    if (inputValue) setTempColor(inputValue);
  };

  const handleChoose = () => {
    setInputValue(tempColor);
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Color Input</h2>

        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Color
          </label>
          <div className="flex gap-3 items-stretch">
            <div className="relative flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="No color selected..."
                rows={2}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white p-3 pr-12 text-sm font-mono text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              />
              {inputValue && (
                <div
                  className="absolute right-3 top-3 h-6 w-6 rounded-md border shadow-inner"
                  style={{ background: inputValue }}
                />
              )}
            </div>
            <button
              onClick={handleSelectClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Select
            </button>
          </div>
        </div>

        {/* Color Preview */}
        {inputValue && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div
              className="w-full h-14 rounded-xl border border-gray-200 shadow-inner"
              style={{ background: inputValue }}
            />
          </div>
        )}
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-md max-h-[90vh] overflow-auto animate-fade-in">
            {/* Popup Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Color</h3>
              <p className="text-gray-600 text-sm">Pick your desired color or gradient</p>
            </div>

            {/* Color Picker */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <ColorPicker value={tempColor} onChange={setTempColor} />
            </div>

            {/* Live Preview */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div
                className="w-full h-16 rounded-xl border border-gray-200 shadow-inner"
                style={{ background: tempColor }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleChoose}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Choose
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
