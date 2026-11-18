import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2 } from 'lucide-react';

interface ConfettiOverlayProps {
  visible: boolean;
  earnedPoints: number;
  activityTitle: string;
  onClose: () => void;
}

const COLORS = ['#E85A3F', '#1E2B48', '#2E7D5B', '#F4A261', '#E9C46A', '#3B5998'];

export function ConfettiOverlay({
  visible,
  earnedPoints,
  activityTitle,
  onClose,
}: ConfettiOverlayProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 3.3) % 88)}%`,
        delay: (i % 7) * 0.05,
        duration: 1.5 + (i % 4) * 0.25,
        rotate: (i % 2 === 0 ? 1 : -1) * (120 + (i % 5) * 45),
        color: COLORS[i % COLORS.length],
        size: 7 + (i % 3) * 3,
      })),
    []
  );

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3600);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2B48]/55 backdrop-blur-xs p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Etkinlik tamamlandı kutlaması"
        >
          {/* Confetti Particles */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ y: -30, opacity: 1, rotate: 0, scale: 0.8 }}
                animate={{ y: '105vh', opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.65,
                  backgroundColor: p.color,
                }}
                className="absolute top-0 rounded-xs"
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] rounded-3xl bg-[#FFFDF9] p-6 text-center shadow-2xl border border-[#E6DFD3]"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF7F2] text-[#2E7D5B]">
              <Award className="h-7 w-7" />
            </div>
            <p className="text-xs font-semibold tracking-wide text-[#2E7D5B]">
              Aile Anısı Kaydedildi
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-[#1E2B48]">
              Harika Bir Ortak Zaman!
            </h3>
            <p className="mt-2 text-sm text-[#4B5873] leading-relaxed">
              <span className="font-semibold text-[#1E2B48]">{activityTitle}</span> etkinliği
              başarıyla tamamlandı ve anı albümünüze eklendi.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FDF0EC] px-4 py-2 text-[#E85A3F]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-display text-base font-bold tabular-nums">
                +{earnedPoints} Aile Puanı Kazanıldı
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#1E2B48] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2C3E66] active:scale-[0.98]"
            >
              Albümü İncele
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
