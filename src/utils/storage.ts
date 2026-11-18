import { createInitialDemoState, DAYS_OF_WEEK, TIME_SLOTS } from '../data/activities';
import { AppState, FamilyMember, MatchedSlot, SlotId } from '../types/aile';

const STORAGE_KEY = 'ailevakti_state_v1';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialDemoState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || !Array.isArray(parsed.members) || parsed.members.length === 0) {
      return createInitialDemoState();
    }
    return parsed;
  } catch {
    return createInitialDemoState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('localStorage kaydı sırasında bellek sınırı uyarısı:', err);
  }
}

export function resetAppState(): AppState {
  const fresh = createInitialDemoState();
  saveAppState(fresh);
  return fresh;
}

export function findCommonTimeSlots(members: FamilyMember[]): MatchedSlot[] {
  const participating = members.filter((m) => m.selectedForMatch);
  if (participating.length === 0) return [];

  const matches: MatchedSlot[] = [];

  for (const day of DAYS_OF_WEEK) {
    for (const slot of TIME_SLOTS) {
      const slotId: SlotId = `${day.key}|${slot.key}`;
      const everyoneFree = participating.every((member) =>
        member.availableSlots.includes(slotId)
      );
      if (everyoneFree) {
        matches.push({
          day: day.key,
          timeSlot: slot.key,
          slotId,
          participantNames: participating.map((p) => `${p.name} (${p.role})`),
        });
      }
    }
  }

  return matches;
}

export function formatTurkishDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Bugün';
  }
}

export function getFamilyLevelTitle(points: number): {
  title: string;
  nextPoints: number;
} {
  if (points < 100) {
    return { title: 'İletişim Filizi', nextPoints: 100 };
  }
  if (points < 220) {
    return { title: 'Paylaşım Köprüsü', nextPoints: 220 };
  }
  if (points < 350) {
    return { title: 'Ortak Zaman Ustası', nextPoints: 350 };
  }
  return { title: 'Değerler Çınarı', nextPoints: 500 };
}

/**
 * Compresses an uploaded image via HTML5 Canvas so it fits safely inside localStorage.
 */
export function compressImageToDataUrl(file: File, maxDimension = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Görsel yüklenemedi.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
