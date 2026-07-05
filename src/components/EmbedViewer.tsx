import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../types';
import DynamicIcon from './DynamicIcon';
import { motion } from 'motion/react';

interface EmbedViewerProps {
  item: MenuItem | null;
  onOpenInNewTab: (url: string) => void;
  cardOpacity: number;
  onGoBack?: () => void;
}

export default function EmbedViewer({ item, onOpenInNewTab, cardOpacity, onGoBack }: EmbedViewerProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Rotating border colors list
  const borderColors = [
    '#3b82f6', // Xanh dương
    '#ec4899', // Hồng neon
    '#10b981', // Xanh lá
    '#f59e0b', // Vàng cam
    '#8b5cf6', // Tím
    '#00f5ff'  // Xanh ngọc sáng
  ];
  const [colorIndex, setColorIndex] = useState(0);

  // Rotate border color every 1 minute (60,000 milliseconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % borderColors.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // When active item changes, trigger a load state
  useEffect(() => {
    if (item) {
      setIsIframeLoading(true);
      setIframeKey((prev) => prev + 1);
    }
  }, [item]);

  if (!item) {
    return (
      <div 
        className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200/80 transition-all duration-300"
        style={{
          borderRadius: '10px',
          padding: '15px',
          backgroundColor: `rgba(255, 255, 255, ${cardOpacity / 100})`
        }}
      >
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <DynamicIcon name="Laptop" size={32} />
        </div>
        <h4 className="text-lg font-semibold text-slate-800">Chưa chọn trang web hiển thị</h4>
        <p className="text-slate-500 text-sm max-w-md mt-1">
          Hãy chọn một trang web từ danh sách menu bên trái để bắt đầu xem, hoặc bấm vào nút "Thêm vào Menu" để thêm liên kết mới.
        </p>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeBorderColor = borderColors[colorIndex];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative bg-white">
      {/* Sleek Floating Control Overlay */}
      {onGoBack && (
        <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleRefresh}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Tải lại trang"
          >
            <DynamicIcon name="RotateCw" size={12} className={isIframeLoading ? "animate-spin text-blue-500" : ""} />
          </button>
          <button
            onClick={() => onOpenInNewTab(item.url)}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-105 active:scale-95 transition cursor-pointer"
            title="Mở trong tab mới"
          >
            <DynamicIcon name="ExternalLink" size={12} />
          </button>
          <button
            onClick={onGoBack}
            className="h-8 pl-2.5 pr-3.5 rounded-full bg-slate-900/90 backdrop-blur-md hover:bg-slate-900 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition cursor-pointer text-[10px] font-bold"
            title="Quay lại Trang Chủ"
          >
            <DynamicIcon name="ArrowLeft" size={12} />
            <span>Trang Chủ</span>
          </button>
        </div>
      )}

      {/* Embedded Iframe Stage */}
      <div className="flex-1 relative bg-slate-50">
          {item.embeddable !== false ? (
            <>
              {isIframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs z-10 transition-opacity">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <div className="absolute">
                      <DynamicIcon name={item.icon} className="text-blue-600 animate-pulse" size={16} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-500 animate-pulse">
                    Đang tải trang web nhúng...
                  </p>
                </div>
              )}
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={item.url}
                className="w-full h-full border-none bg-white"
                onLoad={() => setIsIframeLoading(false)}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                referrerPolicy="no-referrer"
                title={item.name}
              />
            </>
          ) : (
            /* Custom Fallback Screen for non-embeddable websites */
            <div className="absolute inset-0 flex items-center justify-center p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-white border border-slate-100 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-5 border border-amber-100">
                  <DynamicIcon name="AlertTriangle" size={28} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-800">
                  Trang web này từ chối liên kết nhúng trực tiếp
                </h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md">
                  Chính sách bảo mật <code className="px-1.5 py-0.5 bg-slate-100 text-red-600 rounded font-mono text-xs">X-Frame-Options: SAMEORIGIN</code> của <strong>{item.name}</strong> không cho phép nhúng trang web này vào iframe của bên thứ ba.
                </p>

                {/* Website Preview Card */}
                <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-5 my-6 text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <DynamicIcon name={item.icon} size={15} />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-800">{item.name}</h5>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">{item.url}</p>
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-600 border-t border-slate-200/60 pt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    onClick={() => onOpenInNewTab(item.url)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-100 hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <DynamicIcon name="ExternalLink" size={15} />
                    Mở trang web trong tab mới
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <DynamicIcon name="RotateCw" size={14} />
                    Thử tải lại
                  </button>
                </div>

                <div className="mt-6 text-[11px] text-slate-400 flex items-center gap-1">
                  <DynamicIcon name="Info" size={12} />
                  <span>Bạn vẫn có thể lưu trang này vào menu để mở nhanh bất cứ lúc nào!</span>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
  );
}

