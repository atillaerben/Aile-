import {
  Award,
  CheckCircle2,
  HandHeart,
  Heart,
  Landmark,
  Leaf,
  Lock,
  ShieldOff,
  Target,
  Trophy,
} from 'lucide-react';
import {
  BADGE_DEFINITIONS,
  CATEGORY_LIST,
  CATEGORY_META,
} from '../data/activities';
import { BadgeDefinition, CompletedMemory } from '../types/aile';
import { getFamilyLevelTitle } from '../utils/storage';

interface AchievementsTabProps {
  totalPoints: number;
  weeklyGoal: number;
  memories: CompletedMemory[];
}

function BadgeIcon({ iconName }: { iconName: BadgeDefinition['iconName'] }) {
  switch (iconName) {
    case 'heart':
      return <Heart className="h-5 w-5" />;
    case 'shield-off':
      return <ShieldOff className="h-5 w-5" />;
    case 'hands':
      return <HandHeart className="h-5 w-5" />;
    case 'landmark':
      return <Landmark className="h-5 w-5" />;
    case 'leaf':
      return <Leaf className="h-5 w-5" />;
    case 'award':
      return <Award className="h-5 w-5" />;
  }
}

export function AchievementsTab({
  totalPoints,
  weeklyGoal,
  memories,
}: AchievementsTabProps) {
  const levelInfo = getFamilyLevelTitle(totalPoints);
  const completedCount = memories.length;
  const weeklyProgressPct = Math.min(100, Math.round((completedCount / weeklyGoal) * 100));

  const badgeStatuses = BADGE_DEFINITIONS.map((badge) => ({
    ...badge,
    unlocked: badge.checkUnlocked(memories, totalPoints),
  }));
  const unlockedCount = badgeStatuses.filter((b) => b.unlocked).length;

  const categoryCounts = CATEGORY_LIST.map((category) => {
    const matching = memories.filter((m) => m.category === category);
    const points = matching.reduce((sum, m) => sum + m.points, 0);
    const sharePct =
      memories.length > 0 ? Math.round((matching.length / memories.length) * 100) : 0;
    return {
      category,
      count: matching.length,
      points,
      sharePct,
      meta: CATEGORY_META[category],
    };
  });

  return (
    <div className="space-y-4">
      {/* Total Points & Level Hero Card */}
      <section className="rounded-3xl bg-gradient-to-br from-[#1E2B48] via-[#2B3F6C] to-[#E85A3F] p-5 text-white shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-[#FFD6A5]">Toplam Aile Puanı</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold tabular-nums">
                {totalPoints}
              </span>
              <span className="text-xs font-semibold text-[#FFD6A5]">Puan</span>
            </div>
            <p className="mt-1.5 text-xs text-white/90">
              Aile Seviyesi: <span className="font-semibold text-white">{levelInfo.title}</span>
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/18 backdrop-blur-xs text-[#FFD6A5]">
            <Trophy className="h-6 w-6" />
          </div>
        </div>

        {/* Weekly Goal Progress Bar */}
        <div className="mt-4 rounded-2xl bg-white/14 backdrop-blur-xs p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Target className="h-3.5 w-3.5 text-[#FFD6A5]" />
              Haftalık Hedef ({weeklyGoal} Etkinlik)
            </span>
            <span className="font-bold tabular-nums text-white">
              {completedCount} / {weeklyGoal}
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F4A261] to-[#FFD166] transition-all duration-500"
              style={{ width: `${weeklyProgressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-white/85">
            {completedCount >= weeklyGoal
              ? 'Tebrikler! Bu haftanın nitelikli aile zamanı hedefine ulaştınız.'
              : `Haftalık hedefinize ulaşmak için ${weeklyGoal - completedCount} etkinlik daha tamamlayın.`}
          </p>
        </div>
      </section>

      {/* Earned Value Badges */}
      <section className="rounded-2xl bg-[#FFFDF9] p-4 shadow-sm border border-[#EAE2D6]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E2B48]">
              Kazanılan Değer Rozetleri
            </h2>
            <p className="text-xs text-[#5E6A82]">
              Tamamlanan etkinliklerle açılan başarı unvanları
            </p>
          </div>
          <span className="text-xs font-bold text-[#E85A3F] tabular-nums">
            {unlockedCount} / {badgeStatuses.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badgeStatuses.map((badge, idx) => {
            const unlockedAccents = [
              'bg-gradient-to-br from-[#E85A3F] to-[#F49342]',
              'bg-gradient-to-br from-[#3B5998] to-[#5676BA]',
              'bg-gradient-to-br from-[#2E7D5B] to-[#43A077]',
              'bg-gradient-to-br from-[#C57B1B] to-[#E59E3A]',
              'bg-gradient-to-br from-[#3A826E] to-[#54A58E]',
              'bg-gradient-to-br from-[#D94E67] to-[#E87A54]',
            ];
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-3 transition-all ${
                  badge.unlocked
                    ? 'border-[#2E7D5B]/30 bg-gradient-to-b from-[#EDF7F2] to-[#FFFDF9] shadow-xs'
                    : 'border-[#EAE2D6] bg-[#FAF6F0]/75 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      badge.unlocked
                        ? `${unlockedAccents[idx % unlockedAccents.length]} text-white shadow-xs`
                        : 'bg-[#E6DFD3] text-[#6D778B]'
                    }`}
                  >
                    <BadgeIcon iconName={badge.iconName} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      badge.unlocked ? 'text-[#1E5A40]' : 'text-[#6D778B]'
                    }`}
                  >
                    {badge.unlocked ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Kazanıldı
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Kilitli
                      </>
                    )}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-xs font-bold text-[#1E2B48]">
                  {badge.title}
                </h3>
                <p className="mt-1 text-[11px] leading-snug text-[#5E6A82]">
                  {badge.unlocked ? badge.description : badge.conditionText}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Category Distribution Chart */}
      <section className="rounded-2xl bg-[#FFFDF9] p-4 shadow-sm border border-[#EAE2D6]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E2B48]">
              Değer Alanlarına Göre Dağılım
            </h2>
            <p className="text-xs text-[#5E6A82]">
              Tamamlanan etkinliklerin 5 değer kategorisindeki oranı
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {categoryCounts.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#1E2B48] truncate">
                  {item.category}
                </span>
                <span className="text-[#5E6A82] tabular-nums whitespace-nowrap shrink-0">
                  {item.count} etkinlik ({item.sharePct}%)
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[#F2EBE0]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.sharePct}%`,
                    backgroundColor: item.meta.accentColor,
                    minWidth: item.count > 0 ? '8%' : '0%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
