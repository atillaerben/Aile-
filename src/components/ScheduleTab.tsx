import { useState } from 'react';
import {
  CalendarCheck2,
  Check,
  Clock,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  DAYS_OF_WEEK,
  MEMBER_COLORS,
  ROLE_PRESETS,
  TIME_SLOTS,
} from '../data/activities';
import { DayKey, FamilyMember, MatchedSlot, SlotId } from '../types/aile';
import { findCommonTimeSlots } from '../utils/storage';

interface ScheduleTabProps {
  members: FamilyMember[];
  activeMemberId: string;
  matchedSlotLabel: string | null;
  onSelectActiveMember: (id: string) => void;
  onToggleSlot: (memberId: string, slotId: SlotId) => void;
  onToggleMemberInMatch: (memberId: string) => void;
  onAddMember: (name: string, role: string) => void;
  onUpdateMember: (id: string, name: string, role: string) => void;
  onDeleteMember: (id: string) => void;
  onSelectMatchedSlotForActivity: (slotLabel: string) => void;
}

export function ScheduleTab({
  members,
  activeMemberId,
  matchedSlotLabel,
  onSelectActiveMember,
  onToggleSlot,
  onToggleMemberInMatch,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onSelectMatchedSlotForActivity,
}: ScheduleTabProps) {
  const [dayGroupFilter, setDayGroupFilter] = useState<'tumu' | 'hafta_ici' | 'hafta_sonu'>('tumu');
  const [selectedDay, setSelectedDay] = useState<DayKey>('Çarşamba');
  const [matchResults, setMatchResults] = useState<MatchedSlot[] | null>(null);
  const [hasSearchedMatch, setHasSearchedMatch] = useState(false);

  // Add / Edit member modal state
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Öğrenci');
  const [formError, setFormError] = useState('');

  const activeMember = members.find((m) => m.id === activeMemberId) ?? members[0];
  const participatingMembers = members.filter((m) => m.selectedForMatch);

  const visibleDays = DAYS_OF_WEEK.filter((d) => {
    if (dayGroupFilter === 'tumu') return true;
    return d.group === dayGroupFilter;
  });

  const handleDayGroupChange = (group: 'tumu' | 'hafta_ici' | 'hafta_sonu') => {
    setDayGroupFilter(group);
    const filtered = DAYS_OF_WEEK.filter((d) => (group === 'tumu' ? true : d.group === group));
    if (!filtered.some((d) => d.key === selectedDay) && filtered.length > 0) {
      setSelectedDay(filtered[0].key);
    }
  };

  const handleRunMatch = () => {
    const found = findCommonTimeSlots(members);
    setMatchResults(found);
    setHasSearchedMatch(true);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('Kardeş');
    setFormError('');
    setMemberModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormError('');
    setMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) {
      setFormError('Lütfen aile üyesinin adını girin.');
      return;
    }
    if (editingMember) {
      onUpdateMember(editingMember.id, trimmed, formRole);
    } else {
      onAddMember(trimmed, formRole);
    }
    setMemberModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Colorful Modern Family Hero Card */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EAE0D0] bg-gradient-to-br from-[#E85A3F] to-[#F49342] shadow-md">
        <img
          src="/src/assets/images/modern_family_living_hero_1794950453264.jpg"
          alt="Modern oturma odasında birlikte masa oyunu oynayan aile"
          referrerPolicy="no-referrer"
          className="h-38 w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2B48]/90 via-[#1E2B48]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
          <p className="text-[11px] font-semibold text-[#FFD6A5]">
            Aİ-LEM · Ortak Zaman, Güçlü İletişim
          </p>
          <h2 className="font-display text-base font-bold leading-snug text-white">
            Birlikte Geçen Her An Değerli
          </h2>
        </div>
      </section>

      {/* Section 1: Family Profiles */}
      <section className="rounded-2xl bg-[#FFFDF9] p-4 shadow-sm border border-[#EAE2D6]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E2B48]">
              Aile Üyeleri
            </h2>
            <p className="text-xs text-[#5E6A82] mt-0.5">
              Programını düzenlemek için bir üyeye dokunun
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E85A3F] to-[#F48442] px-3 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:opacity-95 active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Üye Ekle</span>
          </button>
        </div>

        {/* Member Selector List */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {members.map((member) => {
            const isActive = member.id === activeMember?.id;
            return (
              <div
                key={member.id}
                style={
                  isActive
                    ? { backgroundColor: member.color, borderColor: member.color }
                    : undefined
                }
                className={`group relative flex shrink-0 items-center gap-2 rounded-2xl border p-2 transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'border-[#E6DFD3] bg-[#FAF6F0] text-[#1E2B48] hover:border-[#C9BFAF]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectActiveMember(member.id)}
                  className="flex min-h-[36px] items-center gap-2 text-left pr-1"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-xs"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : member.color,
                      color: '#FFFFFF',
                    }}
                  >
                    {member.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="leading-tight">
                    <div className="text-xs font-semibold whitespace-nowrap">
                      {member.name}
                    </div>
                    <div
                      className={`text-[11px] whitespace-nowrap ${
                        isActive ? 'text-white/85' : 'text-[#5E6A82]'
                      }`}
                    >
                      {member.role} · <span className="tabular-nums">{member.availableSlots.length}</span> saat
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  aria-label={`${member.name} üyesini düzenle`}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'text-white/85 hover:bg-white/20 hover:text-white'
                      : 'text-[#5E6A82] hover:bg-[#EAE2D6] hover:text-[#1E2B48]'
                  }`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Participating Toggle Strip */}
        <div className="mt-3 pt-3 border-t border-[#F0EAE0]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-[#5E6A82] flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#1E2B48]" />
              Eşleşmeye Dahil Üyeler ({participatingMembers.length}/{members.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onToggleMemberInMatch(m.id)}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  m.selectedForMatch
                    ? 'border-[#2E7D5B]/35 bg-[#EDF7F2] text-[#1E5A40]'
                    : 'border-[#E6DFD3] bg-white text-[#6D778B]'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                    m.selectedForMatch
                      ? 'border-[#2E7D5B] bg-[#2E7D5B] text-white'
                      : 'border-[#C7BFAE] bg-white'
                  }`}
                >
                  {m.selectedForMatch && <Check className="h-3 w-3" />}
                </span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Day & Time Slot Picker */}
      <section className="rounded-2xl bg-[#FFFDF9] p-4 shadow-sm border border-[#EAE2D6]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E2B48]">
              {activeMember?.name} ({activeMember?.role}) Boş Zamanları
            </h2>
            <p className="text-xs text-[#5E6A82] mt-0.5">
              Müsait olunan gün ve saat aralıklarını işaretleyin
            </p>
          </div>
        </div>

        {/* Hafta İçi / Hafta Sonu Segmented Filter */}
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-[#F2EBE0] p-1">
          {[
            { id: 'tumu' as const, label: 'Tüm Hafta' },
            { id: 'hafta_ici' as const, label: 'Hafta İçi' },
            { id: 'hafta_sonu' as const, label: 'Hafta Sonu' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDayGroupChange(item.id)}
              className={`min-h-[36px] rounded-lg px-2 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                dayGroupFilter === item.id
                  ? 'bg-[#FFFDF9] text-[#1E2B48] shadow-xs'
                  : 'text-[#5E6A82] hover:text-[#1E2B48]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Horizontal Day Selector */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {visibleDays.map((day) => {
            const isSelected = selectedDay === day.key;
            const memberCountForDay = activeMember
              ? activeMember.availableSlots.filter((s) => s.startsWith(`${day.key}|`)).length
              : 0;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDay(day.key)}
                className={`flex min-h-[54px] min-w-[54px] flex-1 flex-col items-center justify-center rounded-xl border px-2 py-1.5 transition-all shrink-0 ${
                  isSelected
                    ? 'border-[#E85A3F] bg-[#E85A3F] text-white shadow-xs'
                    : 'border-[#E6DFD3] bg-[#FAF6F0] text-[#1E2B48] hover:border-[#C9BFAF]'
                }`}
              >
                <span className="text-xs font-bold">{day.short}</span>
                <span
                  className={`mt-0.5 text-[10px] tabular-nums ${
                    isSelected ? 'text-white/90' : 'text-[#5E6A82]'
                  }`}
                >
                  {memberCountForDay} saat
                </span>
              </button>
            );
          })}
        </div>

        {/* Clickable Time Slots for Selected Day */}
        <div className="mt-3 space-y-2">
          {TIME_SLOTS.map((slot) => {
            const slotId: SlotId = `${selectedDay}|${slot.key}`;
            const isChecked = activeMember?.availableSlots.includes(slotId) ?? false;
            const otherAvailable = members.filter(
              (m) => m.id !== activeMember?.id && m.availableSlots.includes(slotId)
            );
            const allSelectedFree =
              participatingMembers.length > 0 &&
              participatingMembers.every((m) => m.availableSlots.includes(slotId));

            return (
              <button
                key={slot.key}
                type="button"
                onClick={() => activeMember && onToggleSlot(activeMember.id, slotId)}
                className={`flex w-full min-h-[52px] items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all active:scale-[0.99] ${
                  isChecked
                    ? 'border-[#E85A3F] bg-[#FDF0EC]'
                    : 'border-[#EAE2D6] bg-white hover:border-[#D4CBBF]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isChecked
                        ? 'border-[#E85A3F] bg-[#E85A3F] text-white'
                        : 'border-[#C9BFAF] bg-[#FAF6F0] text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1E2B48] tabular-nums">
                      <Clock className="h-3.5 w-3.5 text-[#5E6A82] shrink-0" />
                      <span>{slot.label}</span>
                      <span className="text-xs font-normal text-[#6D778B]">· {slot.period}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#5E6A82] truncate">
                      {allSelectedFree
                        ? 'Tüm seçili aile üyeleri müsait'
                        : otherAvailable.length > 0
                        ? `Diğer müsait: ${otherAvailable.map((o) => o.name).join(', ')}`
                        : 'Henüz başka üye işaretlenmedi'}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold whitespace-nowrap shrink-0 ${
                    isChecked ? 'text-[#E85A3F]' : 'text-[#6D778B]'
                  }`}
                >
                  {isChecked ? 'Müsait' : 'Seç'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Match Action & Result Card */}
      <section className="space-y-3">
        <button
          type="button"
          onClick={handleRunMatch}
          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#E85A3F] px-5 py-3.5 font-display text-sm font-bold text-white shadow-md shadow-[#E85A3F]/20 transition-all hover:bg-[#D4492E] active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Ortak Zamanları Eşleştir</span>
        </button>

        {hasSearchedMatch && matchResults !== null && (
          <div className="rounded-2xl border border-[#1E2B48]/15 bg-[#1E2B48] p-4 text-white shadow-md">
            {matchResults.length > 0 ? (
              <div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E85A3F] text-white">
                    <CalendarCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/75">
                      {participatingMembers.length} aile üyesi için ortak zaman bulundu
                    </p>
                    <h3 className="mt-0.5 font-display text-base font-bold leading-snug text-white">
                      Harika! {matchResults[0].day} {matchResults[0].timeSlot} arası tüm aile müsait!
                    </h3>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {matchResults.map((match) => {
                    const label = `${match.day} ${match.timeSlot}`;
                    const isCurrent = matchedSlotLabel === label;
                    return (
                      <div
                        key={match.slotId}
                        className="flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white tabular-nums">
                            {match.day} · {match.timeSlot}
                          </div>
                          <div className="text-[11px] text-white/75 truncate">
                            {match.participantNames.join(', ')}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectMatchedSlotForActivity(label)}
                          className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            isCurrent
                              ? 'bg-[#2E7D5B] text-white'
                              : 'bg-[#E85A3F] text-white hover:bg-[#D4492E]'
                          }`}
                        >
                          Etkinlik Öner
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <UserCheck className="mx-auto h-7 w-7 text-[#F4A261]" />
                <h3 className="mt-2 font-display text-sm font-bold text-white">
                  Şu an tüm üyelerin kesiştiği boş saat yok
                </h3>
                <p className="mt-1 text-xs text-white/80 leading-relaxed">
                  Yukarıdaki takvimden üyeler için ortak bir akşam saati (örneğin Çarşamba 20:00 - 21:00) işaretleyip tekrar deneyin.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Member Add/Edit Modal */}
      {memberModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1E2B48]/50 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editingMember ? 'Aile Üyesini Düzenle' : 'Yeni Aile Üyesi Ekle'}
        >
          <div className="w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl bg-[#FFFDF9] p-5 shadow-xl border border-[#EAE2D6]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
              <h3 className="font-display text-base font-bold text-[#1E2B48]">
                {editingMember ? 'Aile Üyesini Düzenle' : 'Yeni Aile Üyesi Ekle'}
              </h3>
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                aria-label="Kapat"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#5E6A82] hover:bg-[#F2EBE0]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="member-name"
                  className="block text-xs font-semibold text-[#1E2B48] mb-1.5"
                >
                  Adı / Hitap
                </label>
                <input
                  id="member-name"
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    setFormError('');
                  }}
                  placeholder="Örn: Ahmet veya Dede"
                  className="w-full min-h-[44px] rounded-xl border border-[#D8CFC2] bg-white px-3.5 py-2 text-sm text-[#1E2B48] focus:border-[#E85A3F] focus:outline-none"
                />
                {formError && <p className="mt-1 text-xs text-[#C83E2B]">{formError}</p>}
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#1E2B48] mb-1.5">
                  Ailedeki Rolü
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_PRESETS.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormRole(role)}
                      className={`min-h-[36px] rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        formRole === role
                          ? 'border-[#1E2B48] bg-[#1E2B48] text-white'
                          : 'border-[#E6DFD3] bg-[#FAF6F0] text-[#1E2B48] hover:border-[#C9BFAF]'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {editingMember && members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteMember(editingMember.id);
                      setMemberModalOpen(false);
                    }}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#E5B8B0] bg-[#FDF2F0] px-3.5 py-2 text-xs font-semibold text-[#B93825] hover:bg-[#FADFD9]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Sil</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#DED5C8] bg-white px-4 py-2 text-xs font-semibold text-[#4B5873] hover:bg-[#FAF6F0]"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] rounded-xl bg-[#E85A3F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#D4492E]"
                >
                  {editingMember ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { MEMBER_COLORS };
