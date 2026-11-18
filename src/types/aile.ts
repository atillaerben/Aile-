export type DayKey =
  | 'Pazartesi'
  | 'Salı'
  | 'Çarşamba'
  | 'Perşembe'
  | 'Cuma'
  | 'Cumartesi'
  | 'Pazar';

export type TimeSlotKey =
  | '16:00-17:00'
  | '18:00-19:00'
  | '19:00-20:00'
  | '20:00-21:00'
  | '21:00-22:00';

export type SlotId = `${DayKey}|${TimeSlotKey}`;

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  color: string;
  selectedForMatch: boolean;
  availableSlots: SlotId[];
}

export type ActivityCategory =
  | 'Empati ve İletişim'
  | 'Sorumluluk ve Yardımlaşma'
  | 'Kültürel ve Milli Değerler'
  | 'Ekransız Zeka ve Kutu Oyunları'
  | 'Doğa ve Çevre Bilinci';

export interface ValuesActivity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  durationMinutes: number;
  valueLabel: string;
  points: number;
  guideStep: string;
}

export interface MatchedSlot {
  day: DayKey;
  timeSlot: TimeSlotKey;
  slotId: SlotId;
  participantNames: string[];
}

export interface CompletedMemory {
  id: string;
  activityId: string;
  activityTitle: string;
  category: ActivityCategory;
  valueLabel: string;
  points: number;
  reflectionNote: string;
  photoDataUrl?: string;
  completedAt: string; // ISO string
  matchedSlotLabel?: string;
}

export interface ActiveSession {
  activity: ValuesActivity;
  matchedSlotLabel?: string;
  startedAt: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  conditionText: string;
  iconName: 'heart' | 'shield-off' | 'hands' | 'landmark' | 'leaf' | 'award';
  checkUnlocked: (memories: CompletedMemory[], totalPoints: number) => boolean;
}

export type AppTab = 'takvim' | 'etkinlik' | 'ani' | 'basarilar';

export interface AppState {
  members: FamilyMember[];
  activeMemberId: string;
  matchedSlotLabel: string | null;
  activeSession: ActiveSession | null;
  memories: CompletedMemory[];
  totalPoints: number;
  weeklyGoal: number;
}
