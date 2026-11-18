import { useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  Clock,
  Compass,
  Dices,
  HandHeart,
  HeartHandshake,
  Leaf,
  Play,
  RefreshCw,
  Star,
} from 'lucide-react';
import {
  ACTIVITIES_POOL,
  CATEGORY_LIST,
  CATEGORY_META,
} from '../data/activities';
import { ActivityCategory, ValuesActivity } from '../types/aile';

interface ActivitiesTabProps {
  matchedSlotLabel: string | null;
  activeActivityId: string | null;
  onStartActivity: (activity: ValuesActivity) => void;
  onGoToSchedule: () => void;
}

function CategoryIcon({ category }: { category: ActivityCategory }) {
  switch (category) {
    case 'Empati ve İletişim':
      return <HeartHandshake className="h-4 w-4" />;
    case 'Sorumluluk ve Yardımlaşma':
      return <HandHeart className="h-4 w-4" />;
    case 'Kültürel ve Milli Değerler':
      return <BookOpen className="h-4 w-4" />;
    case 'Ekransız Zeka ve Kutu Oyunları':
      return <Dices className="h-4 w-4" />;
    case 'Doğa ve Çevre Bilinci':
      return <Leaf className="h-4 w-4" />;
  }
}

export function ActivitiesTab({
  matchedSlotLabel,
  activeActivityId,
  onStartActivity,
  onGoToSchedule,
}: ActivitiesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Tümü' | ActivityCategory>('Tümü');
  const [poolIndex, setPoolIndex] = useState(0);

  const filteredActivities = useMemo(() => {
    if (selectedCategory === 'Tümü') return ACTIVITIES_POOL;
    return ACTIVITIES_POOL.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const safeIndex = filteredActivities.length > 0 ? poolIndex % filteredActivities.length : 0;
  const featuredActivity = filteredActivities[safeIndex] ?? ACTIVITIES_POOL[0];
  const featuredMeta = CATEGORY_META[featuredActivity.category];

  const handleCategorySelect = (cat: 'Tümü' | ActivityCategory) => {
    setSelectedCategory(cat);
    setPoolIndex(0);
  };

  const handleNextSuggestion = () => {
    if (filteredActivities.length <= 1) return;
    setPoolIndex((prev) => (prev + 1) % filteredActivities.length);
  };

  const otherSuggestions = filteredActivities.filter((a) => a.id !== featuredActivity.id);

  return (
    <div className="space-y-4">
      {/* Matched Time Context Strip */}
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#1E2B48] px-4 py-3 text-white shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarClock className="h-4 w-4 shrink-0 text-[#F4A261]" />
          <div className="min-w-0">
            <div className="text-[11px] text-white/75">Planlanan Ortak Zaman</div>
            <div className="text-xs font-semibold truncate tabular-nums">
              {matchedSlotLabel ?? 'Henüz ortak saat seçilmedi'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onGoToSchedule}
          className="min-h-[34px] rounded-xl bg-white/12 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 whitespace-nowrap shrink-0"
        >
          {matchedSlotLabel ? 'Değiştir' : 'Saat Seç'}
        </button>
      </div>

      {/* Values Education Category Filters */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-sm font-bold text-[#1E2B48]">
            Değerler Eğitimi Kategorisi
          </h2>
          <span className="text-xs text-[#5E6A82] tabular-nums">
            {filteredActivities.length} etkinlik
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => handleCategorySelect('Tümü')}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'Tümü'
                ? 'border-[#1E2B48] bg-[#1E2B48] text-white'
                : 'border-[#E6DFD3] bg-[#FFFDF9] text-[#4B5873] hover:border-[#C9BFAF]'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Tümü</span>
          </button>

          {CATEGORY_LIST.map((cat) => {
            const isActive = selectedCategory === cat;
            const catMeta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                style={
                  isActive
                    ? { backgroundColor: catMeta.accentColor, borderColor: catMeta.accentColor }
                    : { backgroundColor: catMeta.softBg, borderColor: `${catMeta.accentColor}30`, color: catMeta.textColor }
                }
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive ? 'text-white shadow-xs' : 'hover:opacity-90'
                }`}
              >
                <CategoryIcon category={cat} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Recommended Activity Card */}
      <section className="overflow-hidden rounded-3xl bg-[#FFFDF9] shadow-md border border-[#E6DFD3]">
        <div
          className="h-2 w-full"
          style={{ backgroundColor: featuredMeta.accentColor }}
        />
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold">
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: featuredMeta.textColor }}
            >
              <CategoryIcon category={featuredActivity.category} />
              <span>{featuredActivity.category}</span>
            </span>
            <span className="text-[#5E6A82] tabular-nums">
              {safeIndex + 1} / {filteredActivities.length}
            </span>
          </div>

          <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-[#1E2B48]">
            {featuredActivity.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-[#4B5873]">
            {featuredActivity.description}
          </p>

          {/* Clean Unboxed Metadata Line */}
          <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#1E2B48] border-t border-b border-[#F0EAE0] py-2.5">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-3.5 w-3.5 text-[#5E6A82]" />
              {featuredActivity.durationMinutes} dk
            </span>
            <span aria-hidden="true" className="text-[#C7BFAE]">·</span>
            <span className="inline-flex items-center gap-1 text-[#2E7D5B]">
              <Star className="h-3.5 w-3.5" />
              {featuredActivity.valueLabel}
            </span>
            <span aria-hidden="true" className="text-[#C7BFAE]">·</span>
            <span className="font-bold text-[#E85A3F] tabular-nums">
              +{featuredActivity.points} Puan
            </span>
          </div>

          {/* Practical Guidance */}
          <div
            className="mt-3 rounded-xl p-3 text-xs text-[#34415C] leading-relaxed"
            style={{ backgroundColor: featuredMeta.softBg }}
          >
            <span className="font-bold" style={{ color: featuredMeta.textColor }}>
              Uygulama İpucu:{' '}
            </span>
            {featuredActivity.guideStep}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => onStartActivity(featuredActivity)}
              className="flex-1 flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E85A3F] to-[#F48442] px-4 py-3 font-display text-sm font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>
                {activeActivityId === featuredActivity.id
                  ? 'Etkinliğe Devam Et'
                  : 'Bu Etkinliği Seç / Başlat'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNextSuggestion}
              className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-[#DED5C8] bg-white px-4 py-3 text-xs font-semibold text-[#1E2B48] transition-colors hover:bg-[#FAF6F0] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Başka Öner</span>
            </button>
          </div>
        </div>
      </section>

      {/* Other Activities in Pool */}
      {otherSuggestions.length > 0 && (
        <section className="space-y-2.5">
          <h3 className="font-display text-sm font-bold text-[#1E2B48]">
            Kategorideki Diğer Öneriler
          </h3>
          <div className="space-y-2">
            {otherSuggestions.slice(0, 4).map((activity) => {
              const meta = CATEGORY_META[activity.category];
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[#FFFDF9] p-3.5 border border-[#EAE2D6] shadow-xs"
                >
                  <div className="min-w-0">
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: meta.textColor }}
                    >
                      {activity.category} · <span className="tabular-nums">{activity.durationMinutes} dk</span> ·{' '}
                      <span className="tabular-nums">+{activity.points} Puan</span>
                    </div>
                    <h4 className="mt-0.5 text-sm font-semibold text-[#1E2B48] truncate">
                      {activity.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-[#5E6A82] truncate">
                      Kazanım: {activity.valueLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartActivity(activity)}
                    className="min-h-[40px] rounded-xl bg-[#FAF6F0] border border-[#DED5C8] px-3 py-2 text-xs font-semibold text-[#1E2B48] transition-colors hover:bg-[#1E2B48] hover:text-white hover:border-[#1E2B48] whitespace-nowrap shrink-0"
                  >
                    Seç
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
