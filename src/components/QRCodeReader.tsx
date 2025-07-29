import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, X } from 'lucide-react';

interface QRCodeReaderProps {
  onScan: (result: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeReader({ onScan, isOpen, onClose }: QRCodeReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          onClose();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      QrScanner.hasCamera().then(setHasCamera);

      qrScanner.start().catch(err => {
        console.error('Error starting QR scanner:', err);
        setHasCamera(false);
      });

      setScanner(qrScanner);

      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, [isOpen, onScan, onClose]);

  const handleClose = () => {
    if (scanner) {
      scanner.stop();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ler QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasCamera ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg bg-muted"
                playsInline
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleClose}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Câmera não disponível ou acesso negado
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}