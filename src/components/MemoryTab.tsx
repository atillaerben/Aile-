import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Clock,
  Heart,
  ImagePlus,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { CATEGORY_META } from '../data/activities';
import { ActiveSession, CompletedMemory } from '../types/aile';
import { compressImageToDataUrl, formatTurkishDate } from '../utils/storage';

interface MemoryTabProps {
  activeSession: ActiveSession | null;
  memories: CompletedMemory[];
  onCancelSession: () => void;
  onCompleteActivity: (payload: {
    reflectionNote: string;
    photoDataUrl?: string;
  }) => void;
  onGoToActivities: () => void;
}

const REFLECTION_PROMPTS = [
  'Telefonları bırakınca birbirimizi daha iyi dinledik.',
  'Çok güldük ve çocukluk anılarını öğrenmek harikaydı.',
  'Görev paylaşımı yapınca işimiz hem çabuk hem keyifli bitti.',
];

export function MemoryTab({
  activeSession,
  memories,
  onCancelSession,
  onCompleteActivity,
  onGoToActivities,
}: MemoryTabProps) {
  const [reflectionNote, setReflectionNote] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [noteError, setNoteError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Optional screen-free session timer (seconds remaining)
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    (activeSession?.activity.durationMinutes ?? 30) * 60
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTimerRunning(false);
    setSecondsLeft((activeSession?.activity.durationMinutes ?? 30) * 60);
    setNoteError('');
  }, [activeSession?.activity.id, activeSession?.activity.durationMinutes]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    setIsCompressing(true);
    try {
      const compressed = await compressImageToDataUrl(file);
      setPhotoDataUrl(compressed);
    } catch {
      setPhotoError('Fotoğraf işlenemedi, lütfen başka bir görsel seçin.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reflectionNote.trim();
    if (trimmed.length < 5) {
      setNoteError(
        'Lütfen "Bu etkinlikte ne hissettik / ne öğrendik?" sorusuna en az birkaç kelimelik bir aile notu yazın.'
      );
      return;
    }

    onCompleteActivity({
      reflectionNote: trimmed,
      photoDataUrl,
    });

    setReflectionNote('');
    setPhotoDataUrl(undefined);
    setNoteError('');
    setTimerRunning(false);
  };

  return (
    <div className="space-y-5">
      {/* Active Activity Completion Form */}
      {activeSession ? (
        <section className="rounded-3xl bg-[#FFFDF9] p-4 sm:p-5 shadow-md border border-[#E6DFD3]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-[#E85A3F]">
                Aktif Aile Etkinliği · +{activeSession.activity.points} Puan
              </p>
              <h2 className="mt-0.5 font-display text-lg font-bold text-[#1E2B48] leading-snug">
                {activeSession.activity.title}
              </h2>
              <p className="mt-0.5 text-xs text-[#5E6A82]">
                {activeSession.activity.category} · {activeSession.activity.valueLabel}
                {activeSession.matchedSlotLabel ? ` · ${activeSession.matchedSlotLabel}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelSession}
              aria-label="Etkinliği iptal et"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#5E6A82] hover:bg-[#F2EBE0]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Optional Screen-Free Timer */}
          <div className="mt-3.5 flex items-center justify-between gap-2 rounded-2xl bg-[#1E2B48] px-3.5 py-2.5 text-white">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#F4A261]" />
              <div>
                <div className="text-[11px] text-white/75">Ekransız Süre Sayacı</div>
                <div className="font-display text-base font-bold tabular-nums">
                  {formatTimer(secondsLeft)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-[#E85A3F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#D4492E]"
              >
                {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{timerRunning ? 'Duraklat' : 'Başlat'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(activeSession.activity.durationMinutes * 60);
                }}
                aria-label="Sayacı sıfırla"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/12 text-white hover:bg-white/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* KVKK & Privacy Notice */}
          <div className="mt-3.5 flex items-start gap-2.5 rounded-2xl border border-[#2E7D5B]/25 bg-[#EDF7F2] p-3 text-xs text-[#1E5A40]">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[#2E7D5B]" />
            <p className="leading-relaxed">
              <span className="font-semibold">KVKK ve Mahremiyet Güvencesi: </span>
              Fotoğrafınız yalnızca cihazınızda saklanır, dış sunucuya yüklenmez.
            </p>
          </div>

          <form onSubmit={handleSubmitCompletion} className="mt-4 space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#1E2B48] mb-1.5">
                Etkinlik Fotoğrafı (İsteğe Bağlı)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {photoDataUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-[#E6DFD3] bg-[#FAF6F0]">
                  <img
                    src={photoDataUrl}
                    alt="Yüklenen aile etkinliği önizlemesi"
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 bg-white/95 px-3 py-2 border-t border-[#EAE2D6]">
                    <span className="text-xs font-medium text-[#2E7D5B] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Fotoğraf hazır (yalnızca bu cihazda)
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1E2B48] hover:bg-[#F2EBE0]"
                      >
                        Değiştir
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoDataUrl(undefined)}
                        aria-label="Fotoğrafı kaldır"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#B93825] hover:bg-[#FDF2F0]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="flex w-full min-h-[96px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#C7BFAE] bg-[#FAF6F0] px-4 py-4 text-center transition-colors hover:border-[#E85A3F] hover:bg-[#FDF0EC]/40"
                >
                  <ImagePlus className="h-6 w-6 text-[#E85A3F]" />
                  <span className="text-xs font-semibold text-[#1E2B48]">
                    {isCompressing ? 'Fotoğraf hazırlanıyor...' : 'Cihazınızdan Anı Fotoğrafı Seçin'}
                  </span>
                  <span className="text-[11px] text-[#5E6A82]">
                    Kameradan veya galeriden güvenle ekleyebilirsiniz
                  </span>
                </button>
              )}
              {photoError && <p className="mt-1 text-xs text-[#C83E2B]">{photoError}</p>}
            </div>

            {/* Mandatory Reflective Note */}
            <div>
              <label
                htmlFor="reflection-note"
                className="block text-xs font-semibold text-[#1E2B48] mb-1.5"
              >
                Bu etkinlikte ne hissettik / ne öğrendik? <span className="text-[#E85A3F]">*</span>
              </label>
              <textarea
                id="reflection-note"
                rows={3}
                value={reflectionNote}
                onChange={(e) => {
                  setReflectionNote(e.target.value);
                  if (noteError) setNoteError('');
                }}
                placeholder="Örn: Telefonları bir kenara koyunca birbirimizi daha çok dinlediğimizi fark ettik..."
                className="w-full rounded-2xl border border-[#D8CFC2] bg-white px-3.5 py-2.5 text-sm text-[#1E2B48] placeholder:text-[#8A94A6] focus:border-[#E85A3F] focus:outline-none"
              />
              {noteError && <p className="mt-1 text-xs font-medium text-[#C83E2B]">{noteError}</p>}

              {/* Quick Reflection Starter Chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {REFLECTION_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setReflectionNote(prompt);
                      setNoteError('');
                    }}
                    className="rounded-lg border border-[#E6DFD3] bg-[#FAF6F0] px-2.5 py-1 text-[11px] text-[#4B5873] hover:border-[#C9BFAF] hover:text-[#1E2B48] text-left"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#2E7D5B] px-5 py-3.5 font-display text-sm font-bold text-white shadow-md shadow-[#2E7D5B]/20 transition-all hover:bg-[#246649] active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Etkinliği Tamamla ve Puan Kazan</span>
            </button>
          </form>
        </section>
      ) : (
        <section className="rounded-2xl bg-[#FFFDF9] p-4 border border-[#EAE2D6] shadow-xs flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-sm font-bold text-[#1E2B48]">
              Yeni Bir Etkinlik Başlatmaya Hazır mısınız?
            </h2>
            <p className="mt-0.5 text-xs text-[#5E6A82]">
              Değerler eğitimi havuzundan bir etkinlik seçip puan kazanın.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToActivities}
            className="min-h-[40px] rounded-xl bg-[#E85A3F] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#D4492E] whitespace-nowrap shrink-0"
          >
            Etkinlik Seç
          </button>
        </section>
      )}

      {/* Aile Anı Albümü */}
      <section className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-[#EAE0D0] bg-gradient-to-r from-[#2E7D5B] to-[#3A826E] shadow-xs">
          <img
            src="/src/assets/images/modern_family_outdoor_walk_1794950453155.jpg"
            alt="Modern şehir parkında yürüyüş yapan mutlu aile"
            referrerPolicy="no-referrer"
            className="h-28 w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E2B48]/85 via-[#1E2B48]/50 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
            <div>
              <h2 className="font-display text-base font-bold text-white">
                Aile Anı Albümü
              </h2>
              <p className="text-xs text-white/85">
                Nitelikli zaman kayıtları ve duygu notları
              </p>
            </div>
            <span className="rounded-xl bg-white/20 backdrop-blur-xs px-3 py-1.5 font-display text-xs font-bold text-white tabular-nums shrink-0">
              {memories.length} Anı
            </span>
          </div>
        </div>

        {memories.length === 0 ? (
          <div className="rounded-2xl bg-[#FFFDF9] p-6 text-center border border-[#EAE2D6]">
            <Camera className="mx-auto h-8 w-8 text-[#B5ACA0]" />
            <p className="mt-2 text-sm font-semibold text-[#1E2B48]">
              Henüz kayıtlı bir aile anısı yok
            </p>
            <p className="mt-1 text-xs text-[#5E6A82]">
              İlk etkinliğinizi seçip tamamladığınızda fotoğraf ve notlarınız burada birikecek.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {memories.map((memory) => {
              const meta = CATEGORY_META[memory.category];
              return (
                <article
                  key={memory.id}
                  className="overflow-hidden rounded-2xl bg-[#FFFDF9] border border-[#EAE2D6] shadow-sm"
                >
                  {memory.photoDataUrl ? (
                    <img
                      src={memory.photoDataUrl}
                      alt={`${memory.activityTitle} aile anısı`}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-24 items-center justify-between px-4"
                      style={{ backgroundColor: meta.softBg }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: meta.accentColor }}
                        >
                          <Heart className="h-5 w-5" />
                        </div>
                        <div>
                          <div
                            className="text-xs font-bold"
                            style={{ color: meta.textColor }}
                          >
                            {memory.category}
                          </div>
                          <div className="text-[11px] text-[#5E6A82]">
                            Ekransız Aile Anısı
                          </div>
                        </div>
                      </div>
                      <span
                        className="font-display text-sm font-bold tabular-nums"
                        style={{ color: meta.textColor }}
                      >
                        +{memory.points} Puan
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5E6A82]">
                      <span className="tabular-nums">{formatTurkishDate(memory.completedAt)}</span>
                      <span className="font-semibold text-[#E85A3F] tabular-nums">
                        +{memory.points} Puan
                      </span>
                    </div>

                    <h3 className="mt-1 font-display text-sm font-bold text-[#1E2B48]">
                      {memory.activityTitle}
                    </h3>

                    <p className="mt-2 rounded-xl bg-[#FAF6F0] px-3 py-2.5 text-xs leading-relaxed text-[#34415C] italic">
                      “{memory.reflectionNote}”
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-[#2E7D5B]">
                        Kazanılan Değer: {memory.valueLabel}
                      </span>
                      {memory.matchedSlotLabel && (
                        <>
                          <span aria-hidden="true" className="text-[#C7BFAE]">·</span>
                          <span className="text-[#5E6A82] tabular-nums">
                            {memory.matchedSlotLabel}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
