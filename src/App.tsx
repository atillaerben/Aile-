import { useEffect, useState } from 'react';
import {
  Award,
  CalendarDays,
  Camera,
  HeartHandshake,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { AchievementsTab } from './components/AchievementsTab';
import { ActivitiesTab } from './components/ActivitiesTab';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { MemoryTab } from './components/MemoryTab';
import { MEMBER_COLORS, ScheduleTab } from './components/ScheduleTab';
import {
  AppState,
  AppTab,
  CompletedMemory,
  SlotId,
  ValuesActivity,
} from './types/aile';
import { loadAppState, resetAppState, saveAppState } from './utils/storage';

const NAV_ITEMS: { id: AppTab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'takvim', label: 'Takvim', icon: CalendarDays },
  { id: 'etkinlik', label: 'Etkinlik Öner', icon: Lightbulb },
  { id: 'ani', label: 'Anı & Puan', icon: Camera },
  { id: 'basarilar', label: 'Başarılar', icon: Award },
];

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<AppTab>('takvim');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [celebration, setCelebration] = useState<{
    visible: boolean;
    points: number;
    title: string;
  }>({ visible: false, points: 0, title: '' });

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const handleToggleSlot = (memberId: string, slotId: SlotId) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((member) => {
        if (member.id !== memberId) return member;
        const exists = member.availableSlots.includes(slotId);
        return {
          ...member,
          availableSlots: exists
            ? member.availableSlots.filter((s) => s !== slotId)
            : [...member.availableSlots, slotId],
        };
      }),
    }));
  };

  const handleToggleMemberInMatch = (memberId: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((member) =>
        member.id === memberId
          ? { ...member, selectedForMatch: !member.selectedForMatch }
          : member
      ),
    }));
  };

  const handleAddMember = (name: string, role: string) => {
    const newId = `member-${Date.now()}`;
    setState((prev) => {
      const color = MEMBER_COLORS[prev.members.length % MEMBER_COLORS.length];
      return {
        ...prev,
        members: [
          ...prev.members,
          {
            id: newId,
            name,
            role,
            color,
            selectedForMatch: true,
            availableSlots: ['Çarşamba|20:00-21:00', 'Cumartesi|19:00-20:00'],
          },
        ],
        activeMemberId: newId,
      };
    });
  };

  const handleUpdateMember = (id: string, name: string, role: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, name, role } : m)),
    }));
  };

  const handleDeleteMember = (id: string) => {
    setState((prev) => {
      const remaining = prev.members.filter((m) => m.id !== id);
      if (remaining.length === 0) return prev;
      return {
        ...prev,
        members: remaining,
        activeMemberId:
          prev.activeMemberId === id ? remaining[0].id : prev.activeMemberId,
      };
    });
  };

  const handleSelectMatchedSlotForActivity = (slotLabel: string) => {
    setState((prev) => ({
      ...prev,
      matchedSlotLabel: slotLabel,
    }));
    setActiveTab('etkinlik');
  };

  const handleStartActivity = (activity: ValuesActivity) => {
    setState((prev) => ({
      ...prev,
      activeSession: {
        activity,
        matchedSlotLabel: prev.matchedSlotLabel ?? undefined,
        startedAt: new Date().toISOString(),
      },
    }));
    setActiveTab('ani');
  };

  const handleCancelSession = () => {
    setState((prev) => ({
      ...prev,
      activeSession: null,
    }));
  };

  const handleCompleteActivity = ({
    reflectionNote,
    photoDataUrl,
  }: {
    reflectionNote: string;
    photoDataUrl?: string;
  }) => {
    if (!state.activeSession) return;
    const { activity, matchedSlotLabel } = state.activeSession;

    const newMemory: CompletedMemory = {
      id: `memory-${Date.now()}`,
      activityId: activity.id,
      activityTitle: activity.title,
      category: activity.category,
      valueLabel: activity.valueLabel,
      points: activity.points,
      reflectionNote,
      photoDataUrl,
      completedAt: new Date().toISOString(),
      matchedSlotLabel,
    };

    setState((prev) => ({
      ...prev,
      activeSession: null,
      memories: [newMemory, ...prev.memories],
      totalPoints: prev.totalPoints + activity.points,
    }));

    setCelebration({
      visible: true,
      points: activity.points,
      title: activity.title,
    });
  };

  const handleConfirmReset = () => {
    const fresh = resetAppState();
    setState(fresh);
    setResetModalOpen(false);
    setActiveTab('takvim');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FBECE2] via-[#F4EFE6] to-[#E6F1EC] flex justify-center">
      {/* Centered Phone-Sized Mobile App Container */}
      <div className="relative flex min-h-screen w-full max-w-[440px] flex-col bg-[#FFFBF5] shadow-xl sm:border-x sm:border-[#E5DAC8]">
        {/* Compact Sticky Top App Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-[#EFE4D6] bg-[#FFFDF9]/95 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E85A3F] to-[#F49342] text-white shadow-sm">
              <HeartHandshake className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 leading-tight">
              <h1 className="font-display text-sm font-extrabold tracking-tight text-[#1E2B48] truncate">
                Aİ-LEM
              </h1>
              <p className="text-[11px] font-medium text-[#5E6A82] truncate">
                Boş Zaman Değerlendirme Asistanı
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="inline-flex min-h-[34px] items-center gap-1 rounded-xl border border-[#E6DFD3] bg-[#FAF6F0] px-2.5 py-1 text-[11px] font-semibold text-[#4B5873] transition-colors hover:border-[#E85A3F]/40 hover:text-[#E85A3F] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Demo Verilerini Sıfırla</span>
          </button>
        </header>

        {/* Scrollable Tab Content */}
        <main className="flex-1 px-4 pt-4 pb-24">
          {activeTab === 'takvim' && (
            <ScheduleTab
              members={state.members}
              activeMemberId={state.activeMemberId}
              matchedSlotLabel={state.matchedSlotLabel}
              onSelectActiveMember={(id) =>
                setState((prev) => ({ ...prev, activeMemberId: id }))
              }
              onToggleSlot={handleToggleSlot}
              onToggleMemberInMatch={handleToggleMemberInMatch}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              onSelectMatchedSlotForActivity={handleSelectMatchedSlotForActivity}
            />
          )}

          {activeTab === 'etkinlik' && (
            <ActivitiesTab
              matchedSlotLabel={state.matchedSlotLabel}
              activeActivityId={state.activeSession?.activity.id ?? null}
              onStartActivity={handleStartActivity}
              onGoToSchedule={() => setActiveTab('takvim')}
            />
          )}

          {activeTab === 'ani' && (
            <MemoryTab
              activeSession={state.activeSession}
              memories={state.memories}
              onCancelSession={handleCancelSession}
              onCompleteActivity={handleCompleteActivity}
              onGoToActivities={() => setActiveTab('etkinlik')}
            />
          )}

          {activeTab === 'basarilar' && (
            <AchievementsTab
              totalPoints={state.totalPoints}
              weeklyGoal={state.weeklyGoal}
              memories={state.memories}
            />
          )}
        </main>

        {/* Fixed Bottom 4-Tab Navigation Bar */}
        <nav
          aria-label="Ana uygulama sekmeleri"
          className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-[#E6DFD3] bg-[#FFFDF9]/95 backdrop-blur-md"
        >
          <div className="grid grid-cols-4 h-16 items-center px-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showActiveSessionHint =
                item.id === 'ani' && state.activeSession !== null && !isActive;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex h-full min-h-[44px] flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                    isActive
                      ? 'text-[#E85A3F]'
                      : 'text-[#5E6A82] hover:text-[#1E2B48]'
                  }`}
                >
                  <div className="relative">
                    <Icon
                      className={`h-5 w-5 transition-transform ${
                        isActive ? 'scale-105 stroke-[2.25]' : 'stroke-[1.75]'
                      }`}
                    />
                    {showActiveSessionHint && (
                      <span
                        className="absolute -right-1.5 -top-1 flex h-2.5 w-2.5 rounded-full bg-[#2E7D5B] ring-2 ring-[#FFFDF9]"
                        aria-label="Aktif etkinlik var"
                      />
                    )}
                  </div>
                  <span
                    className={`text-[11px] tracking-tight whitespace-nowrap ${
                      isActive ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Confetti Celebration Modal */}
      <ConfettiOverlay
        visible={celebration.visible}
        earnedPoints={celebration.points}
        activityTitle={celebration.title}
        onClose={() => setCelebration((prev) => ({ ...prev, visible: false }))}
      />

      {/* Demo Data Reset Confirmation Modal */}
      {resetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2B48]/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Demo verilerini sıfırlama onayı"
        >
          <div className="w-full max-w-[350px] rounded-3xl bg-[#FFFDF9] p-5 shadow-xl border border-[#EAE2D6]">
            <h2 className="font-display text-base font-bold text-[#1E2B48]">
              Demo Verileri Sıfırlansın mı?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[#5E6A82]">
              Girilen aile üyeleri, boş zaman saatleri, kazanılan puanlar ve anı albümü başlangıç
              demo durumuna döndürülecektir.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="flex-1 min-h-[42px] rounded-xl border border-[#DED5C8] bg-white px-3 py-2 text-xs font-semibold text-[#4B5873] hover:bg-[#FAF6F0]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 min-h-[42px] rounded-xl bg-[#E85A3F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#D4492E]"
              >
                Evet, Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
