'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Send,
  MessageSquare,
  CheckCircle2,
  Lock,
  Phone,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Item } from '@/types';
import { submitClaim, getCurrentUser } from '@/lib/store';
import { formatWhatsAppUrl } from '@/lib/utils';

interface ClaimModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const currentUser = getCurrentUser();
  const [claimantName, setClaimantName] = useState(currentUser?.full_name || '');
  const [claimantContact, setClaimantContact] = useState(currentUser?.phone_number || '');
  const [claimantAnswer, setClaimantAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !claimantContact.trim() || !claimantAnswer.trim()) {
      alert('Silakan lengkapi semua kolom jawaban verifikasi.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitClaim({
        item_id: item.id,
        claimant_name: claimantName,
        claimant_contact: claimantContact,
        claimant_answer: claimantAnswer,
        claimant_user_id: currentUser?.id,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    }, 400);
  };

  const whatsappMessage = `Halo Bapak/Ibu ${item.reporter_name}, saya ${claimantName} menghubungi melalui platform Titik Temu terkait: "${item.title}".\n\nJawaban verifikasi bukti kepemilikan saya:\n"${claimantAnswer}"\n\nMohon konfirmasi dan koordinasi tempat serah terima aman di Banjarmasin/Banjarbaru. Terima kasih banyak.`;
  const waUrl = formatWhatsAppUrl(item.reporter_contact, whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1B4A6B] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/10 text-[#29A9A3]">
              <ShieldAlert className="w-5 h-5 text-white" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#29A9A3]">
              Verifikasi Keamanan Bukti Kepemilikan
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold leading-snug">
            {item.type === 'hilang'
              ? 'Saya Menemukan Barang Ini'
              : 'Klaim Barang Ini Milik Saya'}
          </h3>
          <p className="text-xs text-slate-200 mt-1 line-clamp-1">
            Barang: <span className="font-semibold text-white">{item.title}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Security Question Box (Crucial Step) */}
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-[#F2823A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      Pertanyaan Verifikasi Pelapor
                    </h4>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      "{item.security_question}"
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Demi keamanan komunitas, Anda wajib menjawab pertanyaan spesifik ini untuk
                      memastikan Anda adalah pemilik/penemu sah sebelum kontak langsung dibuka.
                    </p>
                  </div>
                </div>
              </div>

              {/* Claimant Answer */}
              <div>
                <label className="block text-xs font-bold text-[#1B4A6B] uppercase tracking-wider mb-1.5">
                  Jawaban Detail Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={claimantAnswer}
                  onChange={(e) => setClaimantAnswer(e.target.value)}
                  placeholder="Contoh: Casing HP warna biru navy ada gantungan kunci bebek, isi dompet ada kartu member gramedia atas nama..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29A9A3] focus:border-transparent"
                />
              </div>

              {/* Name & WhatsApp Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WhatsApp / HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={claimantContact}
                    onChange={(e) => setClaimantContact(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29A9A3]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#29A9A3] hover:bg-[#23928d] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengirim Verifikasi...' : 'Kirim Jawaban & Buka Kontak'}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  🔒 Data Anda terlindungi dan hanya dibagikan kepada pelapor untuk serah terima.
                </p>
              </div>
            </form>
          ) : (
            /* Success State - Unlocked Contact & WhatsApp */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#1B4A6B]">Verifikasi Terkirim!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  Jawaban Anda telah tersimpan. Silakan lanjutkan koordinasi serah terima barang
                  langsung dengan pelapor di bawah ini:
                </p>
              </div>

              {/* Unlocked Contact Box */}
              <div className="bg-[#F4F7F9] rounded-2xl p-4 border border-[#E2E8F0] text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Nama Pelapor:</span>
                  <span className="text-xs font-bold text-[#1B4A6B]">{item.reporter_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Nomor WhatsApp:</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{item.reporter_contact}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Lokasi Temu yang Disarankan:</span>
                  <span className="text-xs font-semibold text-slate-700">{item.location_name}</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="space-y-2 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat WhatsApp Pelapor Sekarang</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ClaimModal;
