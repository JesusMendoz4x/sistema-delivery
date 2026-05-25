import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function AdminModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-['Nunito']">
      <div 
        className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-[#141414]/95 border border-[#D4AF6A]/30 w-full max-w-lg rounded-2xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D4AF6A]/10">
          <h2 className="text-[16px] font-['Outfit'] text-[#F2EDE4] tracking-widest uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#D4AF6A]/20 flex items-center justify-center text-[#F2EDE4]/50 hover:text-[#D4AF6A] hover:bg-[#D4AF6A]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#D4AF6A transparent' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
