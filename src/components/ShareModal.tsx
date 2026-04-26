"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentIcon, CheckIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { TwitterLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  equation: { id: string; name: string; description: string; category: string };
}

export default function ShareModal({ isOpen, onClose, equation }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/equation/${equation.id}`;
  const shareText = `Check out this ${equation.category} equation: ${equation.name} — ${equation.description}`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const open = (url: string) => window.open(url, '_blank', 'width=600,height=400');

  const socialButtons = [
    {
      label: 'Twitter',
      icon: <TwitterLogoIcon className="w-4 h-4" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`),
    },
    {
      label: 'LinkedIn',
      icon: <LinkedInLogoIcon className="w-4 h-4" />,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
    {
      label: 'Facebook',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
    },
    {
      label: 'Email',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => { window.location.href = `mailto:?subject=${encodeURIComponent(`EquaLab: ${equation.name}`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`; },
    },
  ];

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Equation</DialogTitle>
        </DialogHeader>

        {/* Equation info */}
        <div className="bg-muted rounded-lg p-4">
          <p className="font-semibold text-foreground">{equation.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{equation.description}</p>
          <Badge variant="secondary" className="mt-2 bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
            {equation.category}
          </Badge>
        </div>

        {/* Copy link */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Link</p>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="text-xs" />
            <Button
              size="icon"
              onClick={copy}
              className={copied ? 'bg-green-600 hover:bg-green-600' : 'bg-cyan-600 hover:bg-cyan-700'}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
            </Button>
          </div>
          {copied && <p className="text-xs text-green-600 dark:text-green-400">Copied!</p>}
        </div>

        <Separator />

        {/* Social */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Share on</p>
          <div className="grid grid-cols-2 gap-2">
            {socialButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`flex items-center justify-center gap-2 px-3 py-2 ${btn.color} text-white text-sm font-medium rounded-lg transition-colors`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {hasNativeShare && (
          <Button
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
            onClick={() => navigator.share({ title: `EquaLab: ${equation.name}`, text: shareText, url: shareUrl }).catch(() => {})}
          >
            Share via Device
          </Button>
        )}

        {/* QR */}
        <Button variant="outline" className="w-full gap-2" onClick={() => setShowQR(!showQR)}>
          <QrCodeIcon className="h-4 w-4" />
          {showQR ? 'Hide' : 'Show'} QR Code
        </Button>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex justify-center"
          >
            <div className="bg-white p-4 rounded-lg border">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                alt="QR Code"
                className="w-40 h-40"
              />
              <p className="text-center text-xs text-gray-500 mt-2">Scan to open on mobile</p>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
