import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Sparkles, RefreshCw, Link2 } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

interface DynamicQRCodeCardProps {
  defaultUrl?: string;
  themeColor?: 'bauhaus-red' | 'bauhaus-blue' | 'bauhaus-yellow' | 'black';
}

export const DynamicQRCodeCard: React.FC<DynamicQRCodeCardProps> = ({
  defaultUrl,
  themeColor = 'bauhaus-red'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [url, setUrl] = useState<string>(defaultUrl || 'https://beacons.ai/cody.vdb');
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrTheme, setQrTheme] = useState<'red-white' | 'black-yellow' | 'blue-white' | 'black-white'>('red-white');
  const [error, setError] = useState<string | null>(null);

  // Generate QR Code on Canvas
  useEffect(() => {
    if (!canvasRef.current || !url) return;

    // Define colors according to Bauhaus guidelines
    const colors = {
      'red-white': { dark: '#FF0000', light: '#FFFFFF' },
      'black-yellow': { dark: '#000000', light: '#FFFF00' },
      'blue-white': { dark: '#0000FF', light: '#FFFFFF' },
      'black-white': { dark: '#000000', light: '#FFFFFF' }
    };

    const activeColors = colors[qrTheme] || colors['red-white'];

    QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: 180,
        margin: 2,
        color: {
          dark: activeColors.dark,
          light: activeColors.light
        },
        errorCorrectionLevel: 'H'
      },
      (err) => {
        if (err) {
          console.error(err);
          setError('Failed to render QR Code Matrix.');
        } else {
          setError(null);
        }
      }
    );
  }, [url, qrTheme]);

  // Copy target Link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy', err);
    }
  };

  // Download QR Code Canvas as PNG image
  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `cody_portfolio_qr_${qrTheme}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download QR Code error:', err);
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div id="dynamic-qr-card" className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] p-5 text-black text-left flex flex-col md:flex-row gap-6">
      
      {/* Visual QR Code Display Block (Bauhaus stylized) */}
      <div className="flex flex-col items-center justify-center border-4 border-black bg-stone-50 p-4 relative min-w-[210px] self-center">
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="w-2.5 h-2.5 bg-bauhaus-red border border-black rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-bauhaus-blue border border-black rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-bauhaus-yellow border border-black rounded-full"></span>
        </div>
        <span className="text-[8px] font-mono font-black text-stone-500 uppercase tracking-widest mb-3 self-end">
          CORE_MATRIX_OUT
        </span>

        {/* The generated QR Canvas */}
        <div className="border-3 border-black p-1 bg-white">
          <canvas ref={canvasRef} className="max-w-[180px] h-[180px]" />
        </div>
        
        {error && <p className="text-[10px] text-bauhaus-red font-black uppercase mt-1">{error}</p>}
        
        <span className="text-[9px] font-mono bg-black text-white px-2 py-0.5 mt-3 font-black tracking-widest text-center uppercase block w-full">
          SCAN PORTFOLIO PIPELINE
        </span>
      </div>

      {/* Control Panel Block */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-3">
            <QrCode size={18} className="text-bauhaus-red" />
            <h4 className="font-black text-sm uppercase tracking-tight text-black">
              MẠNG LƯỚI KẾT NỐI QR ĐỘNG (NETWORKING GATEWAY)
            </h4>
          </div>
          
          <p className="text-xs text-stone-700 font-bold uppercase leading-relaxed mb-4">
            QUÉT ĐỂ KẾT NỐI HOẶC TẢI XUỐNG THÔNG TIN SƠ YẾU LÝ LỊCH CỦA VÕ DUY BÌNH TRỰC TIẾP TRÊN THIẾT BỊ DI ĐỘNG.
          </p>

          {/* Quick Pre-set Targets */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block mb-1">
                🔗 ĐỊNH HƯỚNG LIÊN KẾT (TARGET URL PORTALS)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setUrl('https://beacons.ai/cody.vdb');
                    setShowCustom(false);
                  }}
                  className={`p-2.5 border-2 border-black text-[10px] font-black text-left uppercase tracking-tighter flex items-center justify-between transition-all ${
                    url === 'https://beacons.ai/cody.vdb' && !showCustom
                      ? 'bg-bauhaus-yellow text-black'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span>1. CODY PORTFOLIO HUB</span>
                  <Sparkles size={11} className="text-bauhaus-red shrink-0" />
                </button>
                <button
                  onClick={() => {
                    setUrl(`${currentOrigin}/About`);
                    setShowCustom(false);
                  }}
                  className={`p-2.5 border-2 border-black text-[10px] font-black text-left uppercase tracking-tighter flex items-center justify-between transition-all ${
                    url === `${currentOrigin}/About` && !showCustom
                      ? 'bg-bauhaus-yellow text-black'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span>2. DIGITAL ONLINE CV APP</span>
                  <Link2 size={11} className="text-bauhaus-blue shrink-0" />
                </button>
              </div>
            </div>

            {/* Custom URL Option Entry */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                  ✏️ TỰ ĐỊNH CẤU HÌNH LIÊN KẾT KHÁC (CUSTOM TARGET URL)
                </span>
                <button
                  onClick={() => {
                    setShowCustom(!showCustom);
                    if (!showCustom) setCustomInput(url);
                  }}
                  className="text-[9px] font-black underline uppercase text-bauhaus-blue"
                >
                  {showCustom ? '[QUAY LẠI]' : '[NHẬP LINK RIÊNG]'}
                </button>
              </div>

              {showCustom && (
                <div className="flex gap-2 border-2 border-black p-1 bg-white">
                  <input
                    type="url"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      if (e.target.value.trim()) setUrl(e.target.value.trim());
                    }}
                    placeholder="https://yourcustom-pdf-resume.com"
                    className="flex-1 text-xs font-bold p-1 px-2 outline-none font-mono"
                  />
                  <span className="bg-black text-white font-mono text-[9px] font-black p-1 uppercase select-none">
                    ACTIVE
                  </span>
                </div>
              )}
            </div>

            {/* Bauhaus Matrix Palette options */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block mb-1">
                🎨 CHỌN SẮC THÁI MATRIX (BAUHAUS QR COLORWAYS)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'red-white', label: 'BAU-RED', colorBg: 'bg-bauhaus-red' },
                  { id: 'black-yellow', label: 'BAU-YEL', colorBg: 'bg-bauhaus-yellow' },
                  { id: 'blue-white', label: 'BAU-BLU', colorBg: 'bg-bauhaus-blue' },
                  { id: 'black-white', label: 'BAU-STD', colorBg: 'bg-black' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQrTheme(item.id as any)}
                    className={`p-1.5 border-2 border-black text-[9px] font-black uppercase flex items-center gap-1.5 transition-all ${
                      qrTheme === item.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-stone-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 ${item.colorBg} border border-black rounded-full shrink-0`}></span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between flex-wrap gap-2">
          {/* Active Target URL indicator text */}
          <div className="overflow-hidden max-w-[280px]">
            <span className="text-[8px] font-mono text-stone-500 uppercase block">ACTIVE_GATEWAY_TARGET:</span>
            <span className="text-[11px] font-mono text-black font-black truncate block" title={url}>
              {url}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="border-2 border-black bg-stone-50 hover:bg-stone-100 text-black p-2 text-[10px] font-black uppercase flex items-center gap-1 transition-all"
              title="Copy link to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-600" /> [COPIED]
                </>
              ) : (
                <>
                  <Copy size={12} /> COPY LINK
                </>
              )}
            </button>
            <button
              onClick={handleDownloadPNG}
              className="border-2 border-black bg-black hover:bg-stone-900 text-white p-2 text-[10px] font-black uppercase flex items-center gap-1 transition-all"
              title="Download QR code as PNG image"
            >
              <Download size={12} className="text-bauhaus-yellow" /> TẢI PNG
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
