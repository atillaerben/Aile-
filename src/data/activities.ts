import {
  ActivityCategory,
  AppState,
  BadgeDefinition,
  DayKey,
  FamilyMember,
  TimeSlotKey,
  ValuesActivity,
} from '../types/aile';

export const DAYS_OF_WEEK: { key: DayKey; short: string; group: 'hafta_ici' | 'hafta_sonu' }[] = [
  { key: 'Pazartesi', short: 'Pzt', group: 'hafta_ici' },
  { key: 'Salı', short: 'Sal', group: 'hafta_ici' },
  { key: 'Çarşamba', short: 'Çar', group: 'hafta_ici' },
  { key: 'Perşembe', short: 'Per', group: 'hafta_ici' },
  { key: 'Cuma', short: 'Cum', group: 'hafta_ici' },
  { key: 'Cumartesi', short: 'Cmt', group: 'hafta_sonu' },
  { key: 'Pazar', short: 'Paz', group: 'hafta_sonu' },
];

export const TIME_SLOTS: { key: TimeSlotKey; label: string; period: string }[] = [
  { key: '16:00-17:00', label: '16:00 - 17:00', period: 'İkindi' },
  { key: '18:00-19:00', label: '18:00 - 19:00', period: 'Akşamüstü' },
  { key: '19:00-20:00', label: '19:00 - 20:00', period: 'Akşam' },
  { key: '20:00-21:00', label: '20:00 - 21:00', period: 'Akşam' },
  { key: '21:00-22:00', label: '21:00 - 22:00', period: 'Gece' },
];

export const CATEGORY_LIST: ActivityCategory[] = [
  'Empati ve İletişim',
  'Sorumluluk ve Yardımlaşma',
  'Kültürel ve Milli Değerler',
  'Ekransız Zeka ve Kutu Oyunları',
  'Doğa ve Çevre Bilinci',
];

export const CATEGORY_META: Record<
  ActivityCategory,
  { shortLabel: string; accentColor: string; softBg: string; textColor: string }
> = {
  'Empati ve İletişim': {
    shortLabel: 'Empati',
    accentColor: '#E85A3F',
    softBg: '#FDF0EC',
    textColor: '#B53B24',
  },
  'Sorumluluk ve Yardımlaşma': {
    shortLabel: 'Yardımlaşma',
    accentColor: '#2E7D5B',
    softBg: '#EDF7F2',
    textColor: '#1E5A40',
  },
  'Kültürel ve Milli Değerler': {
    shortLabel: 'Kültürel',
    accentColor: '#C57B1B',
    softBg: '#FBF5EA',
    textColor: '#8F560D',
  },
  'Ekransız Zeka ve Kutu Oyunları': {
    shortLabel: 'Zeka Oyunları',
    accentColor: '#3B5998',
    softBg: '#EEF2FA',
    textColor: '#253D6E',
  },
  'Doğa ve Çevre Bilinci': {
    shortLabel: 'Doğa & Çevre',
    accentColor: '#3A826E',
    softBg: '#ECF6F3',
    textColor: '#245B4C',
  },
};

export const ROLE_PRESETS = ['Anne', 'Baba', 'Öğrenci', 'Kardeş', 'Büyükanne / Dede'];

export const MEMBER_COLORS = ['#E85A3F', '#1E2B48', '#2E7D5B', '#C57B1B', '#6B4E71'];

export const ACTIVITIES_POOL: ValuesActivity[] = [
  // 1. Empati ve İletişim
  {
    id: 'emp-1',
    title: 'Ebeveyninin Çocukluk Oyunu & Anı Sohbeti',
    description:
      'Ebeveyninin çocukluğunda en sevdiği oyunu birlikte oynayın ve o dönemin okul, arkadaşlık anılarını konuşun.',
    category: 'Empati ve İletişim',
    durationMinutes: 35,
    valueLabel: 'Empati & Kuşaklar Arası Bağ',
    points: 50,
    guideStep: 'Kural: Oyun bitiminde her aile üyesi çocukluğuna dair en komik bir anısını paylaşsın.',
  },
  {
    id: 'emp-2',
    title: 'Minnettarlık Çemberi',
    description:
      'Çay eşliğinde herkes bugün minnettar olduğu 2 şeyi ve ailesinden bir kişiye teşekkür etmek istediği bir davranışı anlatsın.',
    category: 'Empati ve İletişim',
    durationMinutes: 25,
    valueLabel: 'Şükran & Takdir',
    points: 45,
    guideStep: 'Söz kesmeden dinleme kuralı uygulayın; her konuşmacıya 2 dakika verin.',
  },
  {
    id: 'emp-3',
    title: 'Bir Günlüğüne Rol Değişimi Sohbeti',
    description:
      '"Bugün evde senin yerinde olsaydım en çok neyi değiştirmek isterdim?" sorusu etrafında birbirinizin gözünden günü değerlendirin.',
    category: 'Empati ve İletişim',
    durationMinutes: 30,
    valueLabel: 'Empati & Saygı',
    points: 50,
    guideStep: 'Yargılamadan sadece duygu ve ihtiyaçları anlamaya odaklanın.',
  },
  {
    id: 'emp-4',
    title: 'Duygu Kartları ile Günün Özeti',
    description:
      'Kağıtlara "Mutlu", "Şaşkın", "Yorgun", "Gururlu" yazın. Sırayla bir kart çekip hafta içinde bu duyguyu yaşadığınız anı anlatın.',
    category: 'Empati ve İletişim',
    durationMinutes: 30,
    valueLabel: 'Duygu Okuryazarlığı',
    points: 45,
    guideStep: 'Özellikle ortaokul çağındaki öğrencinin okul deneyimlerini merakla dinleyin.',
  },

  // 2. Sorumluluk ve Yardımlaşma
  {
    id: 'sor-1',
    title: 'Sokak Hayvanları İçin Geri Dönüşüm Mama Kabı',
    description:
      'Evdeki temiz pet şişe veya karton kutuları kullanarak sokak hayvanları için birlikte dayanıklı mama ve su kabı hazırlayın.',
    category: 'Sorumluluk ve Yardımlaşma',
    durationMinutes: 40,
    valueLabel: 'Merhamet & Sorumluluk',
    points: 60,
    guideStep: 'Hazırladığınız kapları akşam yürüyüşünde apartman/mahalle köşesine birlikte yerleştirin.',
  },
  {
    id: 'sor-2',
    title: '30 Dakikada Ortak Ev Sorumluluğu',
    description:
      'Evdeki bir işi (kitaplık düzenleme, balkon toplama veya akşam sofrası hazırlığı) iş bölümü yaparak 30 dakikada birlikte tamamlayın.',
    category: 'Sorumluluk ve Yardımlaşma',
    durationMinutes: 30,
    valueLabel: 'İş Birliği & Sorumluluk',
    points: 50,
    guideStep: 'Herkes bir görev seçsin, süre dolunca birbirinizin emeğini alkışlayın.',
  },
  {
    id: 'sor-3',
    title: 'Paylaşım Kutusu Hazırlama',
    description:
      'Artık kullanılmayan ama temiz durumdaki kitap, kırtasiye veya kıyafetleri ihtiyaç sahiplerine ulaştırmak üzere birlikte tasnif edin.',
    category: 'Sorumluluk ve Yardımlaşma',
    durationMinutes: 45,
    valueLabel: 'Cömertlik & Dayanışma',
    points: 60,
    guideStep: 'Her eşya için "Bu eşya bir başka çocuğa nasıl fayda sağlar?" diye konuşun.',
  },
  {
    id: 'sor-4',
    title: 'Haftalık Aile Görev Çizelgesi Tasarımı',
    description:
      'Renkli kağıtlarla haftanın adil görev dağılımını birlikte planlayın; herkes kendi güçlü yönüne göre bir sorumluluk üstlensin.',
    category: 'Sorumluluk ve Yardımlaşma',
    durationMinutes: 30,
    valueLabel: 'Adalet & Öz Denetim',
    points: 50,
    guideStep: 'Çizelgeyi buzdolabı üzerine asarak hafta boyunca takip edin.',
  },

  // 3. Kültürel ve Milli Değerler
  {
    id: 'kul-1',
    title: 'Aile Büyüklerinden Bayram & Gençlik Anısı',
    description:
      'Büyükanne, dede veya uzak bir aile büyüğünü arayıp eski bir bayram anısını veya mahalle kültürünü dinleyip not alın.',
    category: 'Kültürel ve Milli Değerler',
    durationMinutes: 30,
    valueLabel: 'Vefa & Aile Bağları',
    points: 55,
    guideStep: 'Öğrenci, büyüğüne önceden 3 merak sorusu hazırlayıp röportaj gibi sorsun.',
  },
  {
    id: 'kul-2',
    title: 'Mutfakta Yöresel Aile Tarifi',
    description:
      'Ailenizin memleketine özgü geleneksel bir tarifi (kısır, börek, sütlaç vb.) mutfakta görev paylaşımıyla birlikte hazırlayın.',
    category: 'Kültürel ve Milli Değerler',
    durationMinutes: 50,
    valueLabel: 'Kültürel Miras & Birliktelik',
    points: 65,
    guideStep: 'Hazırlarken bu yemeğin aile sofralarınızdaki yerini konuşun.',
  },
  {
    id: 'kul-3',
    title: 'Atasözü ve Deyim Hikayeciliği',
    description:
      'Seçtiğiniz 3 Türk atasözünün anlamını tartışıp her birini günlük hayattan kısa birer aile hikayesiyle canlandırın.',
    category: 'Kültürel ve Milli Değerler',
    durationMinutes: 30,
    valueLabel: 'Dil Bilinci & Bilgelik',
    points: 50,
    guideStep: 'Örnek: "Bir elin nesi var, iki elin sesi var" atasözünü günlük bir olayla ilişkilendirin.',
  },
  {
    id: 'kul-4',
    title: 'Aile Soy Ağacı & Fotoğraf Albümü Yolculuğu',
    description:
      'Eski basılı fotoğraf albümlerini çıkarın, aile büyüklerinin hikayelerini anlatarak basit bir aile soy ağacı çizin.',
    category: 'Kültürel ve Milli Değerler',
    durationMinutes: 45,
    valueLabel: 'Köklere Saygı & Aidiyet',
    points: 55,
    guideStep: 'Ailenizde nesilden nesile aktarılan en güzel değeri ağacın köküne yazın.',
  },

  // 4. Ekransız Zeka ve Kutu Oyunları
  {
    id: 'oyn-1',
    title: 'Ekransız 45 Dakika Kelime & Masa Oyunu',
    description:
      'Telefonları başka bir odaya bırakıp 45 dakika boyunca kelime türetme, Scrabble, Mangala veya satranç oynayın.',
    category: 'Ekransız Zeka ve Kutu Oyunları',
    durationMinutes: 45,
    valueLabel: 'Sabır & Adil Rekabet',
    points: 60,
    guideStep: 'Kazanana değil, en centilmen ve destekleyici oyuncuya da küçük bir alkış verin.',
  },
  {
    id: 'oyn-2',
    title: 'Sessiz Sinema: Değerler ve Meslekler',
    description:
      'Takımlara ayrılıp yardımseverlik, dürüstlük, hoşgörü gibi kavramları veya meslekleri konuşmadan sadece mimiklerle anlatın.',
    category: 'Ekransız Zeka ve Kutu Oyunları',
    durationMinutes: 35,
    valueLabel: 'İfade Gücü & Neşe',
    points: 50,
    guideStep: 'Ekranlar tamamen kapalı kalsın; bol kahkahalı bir 35 dakika geçirin.',
  },
  {
    id: 'oyn-3',
    title: 'Ortak Hikaye Zinciri Oyunu',
    description:
      'Bir kişi iki cümleyle bir macera başlatır, sırayla herkes hikayeyi 2 cümle ilerletir. Sonunda hikayeye bir ana fikir bulun.',
    category: 'Ekransız Zeka ve Kutu Oyunları',
    durationMinutes: 25,
    valueLabel: 'Yaratıcı Düşünme & Dinleme',
    points: 45,
    guideStep: 'Öğrencinin kurguladığı sürpriz dönüşleri diğer üyeler merakla takip etsin.',
  },
  {
    id: 'oyn-4',
    title: 'Mangala veya Tangram Turnuvası',
    description:
      'Klasik Türk zeka oyunu Mangala veya kağıttan kestiğiniz Tangram parçalarıyla aile içi mini turnuva düzenleyin.',
    category: 'Ekransız Zeka ve Kutu Oyunları',
    durationMinutes: 40,
    valueLabel: 'Strateji & Odaklanma',
    points: 55,
    guideStep: 'Oyun sonrası herkes rakibinin en beğendiği hamlesini tebrik etsin.',
  },

  // 5. Doğa ve Çevre Bilinci
  {
    id: 'dog-1',
    title: 'Ekransız Akşam Yürüyüşü & Gün Değerlendirmesi',
    description:
      'Telefonları evde bırakıp mahallede veya parkta 30 dakikalık yürüyüşe çıkın; günün en güzel anını ve doğadaki detayları paylaşın.',
    category: 'Doğa ve Çevre Bilinci',
    durationMinutes: 30,
    valueLabel: 'Farkındalık & Huzur',
    points: 50,
    guideStep: 'Gökyüzüne, ağaçlara ve mevsim değişimine dikkat ederek tempolu ama sohbetli yürüyün.',
  },
  {
    id: 'dog-2',
    title: 'Evde Enerji & Su Tasarrufu Dedektifliği',
    description:
      'Birlikte evin odalarını gezerek gereksiz yanan ışıkları, damlatan muslukları ve fişte kalan şarj aletlerini kontrol edip çözüm üretin.',
    category: 'Doğa ve Çevre Bilinci',
    durationMinutes: 25,
    valueLabel: 'Çevre Sorumluluğu & Tutumluluk',
    points: 45,
    guideStep: 'Buzdolabına "Doğayı Koru" başlıklı 3 maddelik aile tasarruf sözü asın.',
  },
  {
    id: 'dog-3',
    title: 'Balkon veya Saksıda Tohum Ekimi',
    description:
      'Birlikte bir saksıya fesleğen, maydanoz veya fasulye tohumu ekin; sulama takvimini öğrencinin sorumluluğuna verin.',
    category: 'Doğa ve Çevre Bilinci',
    durationMinutes: 35,
    valueLabel: 'Emek & Sabır',
    points: 55,
    guideStep: 'İlk filiz çıktığında aile albümü için birlikte fotoğrafını çekmeyi planlayın.',
  },
  {
    id: 'dog-4',
    title: 'Atıksız Sofra & Gıda İsrafını Önleme Atölyesi',
    description:
      'Dolaptaki artan malzemeleri değerlendirerek sıfır atıklı bir akşam atıştırmalığı hazırlayın ve israfı önlemenin önemini konuşun.',
    category: 'Doğa ve Çevre Bilinci',
    durationMinutes: 30,
    valueLabel: 'Tasarruf & Doğa Sevgisi',
    points: 50,
    guideStep: 'Haftalık alışveriş listesini israfı önleyecek şekilde birlikte gözden geçirin.',
  },
];

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'badge-empati',
    title: 'Empati Ustası',
    description: 'Birbirini dinleyen ve duygulara değer veren aile.',
    conditionText: 'Empati ve İletişim kategorisinde 1 etkinlik tamamla',
    iconName: 'heart',
    checkUnlocked: (memories) =>
      memories.some((m) => m.category === 'Empati ve İletişim'),
  },
  {
    id: 'badge-ekransiz',
    title: 'Ekransız Akşam Şampiyonu',
    description: 'Ekranları kenara bırakıp yüz yüze oyuna ve sohbete odaklandınız.',
    conditionText: 'Ekransız Zeka Oyunları tamamla veya toplam 2 etkinlik bitir',
    iconName: 'shield-off',
    checkUnlocked: (memories) =>
      memories.some((m) => m.category === 'Ekransız Zeka ve Kutu Oyunları') ||
      memories.length >= 2,
  },
  {
    id: 'badge-yardimlasma',
    title: 'Yardımlaşma Elçisi',
    description: 'Evde ve çevrede sorumluluk almaktan keyif alan takım.',
    conditionText: 'Sorumluluk ve Yardımlaşma kategorisinde 1 etkinlik tamamla',
    iconName: 'hands',
    checkUnlocked: (memories) =>
      memories.some((m) => m.category === 'Sorumluluk ve Yardımlaşma'),
  },
  {
    id: 'badge-kulturel',
    title: 'Köklerin İzinde',
    description: 'Kültürel miras ve aile büyüklerinin anılarını yaşattınız.',
    conditionText: 'Kültürel ve Milli Değerler kategorisinde 1 etkinlik tamamla',
    iconName: 'landmark',
    checkUnlocked: (memories) =>
      memories.some((m) => m.category === 'Kültürel ve Milli Değerler'),
  },
  {
    id: 'badge-doga',
    title: 'Doğa Dostu Aile',
    description: 'Çevreye duyarlı ve tasarruf bilinci yüksek adımlar attınız.',
    conditionText: 'Doğa ve Çevre Bilinci kategorisinde 1 etkinlik tamamla',
    iconName: 'leaf',
    checkUnlocked: (memories) =>
      memories.some((m) => m.category === 'Doğa ve Çevre Bilinci'),
  },
  {
    id: 'badge-haftalik',
    title: 'Haftalık Hedef Yıldızı',
    description: 'Haftalık 3 nitelikli aile etkinliği hedefini başarıyla tamamladınız.',
    conditionText: 'Toplam 3 aile etkinliği tamamla',
    iconName: 'award',
    checkUnlocked: (memories) => memories.length >= 3,
  },
];

export const DEFAULT_MEMBERS: FamilyMember[] = [
  {
    id: 'member-anne',
    name: 'Elif',
    role: 'Anne',
    color: '#E85A3F',
    selectedForMatch: true,
    availableSlots: [
      'Pazartesi|19:00-20:00',
      'Salı|20:00-21:00',
      'Çarşamba|20:00-21:00',
      'Perşembe|20:00-21:00',
      'Cuma|20:00-21:00',
      'Cumartesi|16:00-17:00',
      'Cumartesi|19:00-20:00',
      'Pazar|16:00-17:00',
    ],
  },
  {
    id: 'member-baba',
    name: 'Murat',
    role: 'Baba',
    color: '#1E2B48',
    selectedForMatch: true,
    availableSlots: [
      'Pazartesi|20:00-21:00',
      'Çarşamba|20:00-21:00',
      'Çarşamba|21:00-22:00',
      'Cuma|20:00-21:00',
      'Cumartesi|19:00-20:00',
      'Cumartesi|20:00-21:00',
      'Pazar|19:00-20:00',
    ],
  },
  {
    id: 'member-ogrenci',
    name: 'Zeynep',
    role: 'Öğrenci',
    color: '#2E7D5B',
    selectedForMatch: true,
    availableSlots: [
      'Salı|18:00-19:00',
      'Çarşamba|19:00-20:00',
      'Çarşamba|20:00-21:00',
      'Perşembe|19:00-20:00',
      'Cuma|20:00-21:00',
      'Cumartesi|16:00-17:00',
      'Cumartesi|19:00-20:00',
      'Pazar|16:00-17:00',
    ],
  },
];

export function createInitialDemoState(): AppState {
  return {
    members: DEFAULT_MEMBERS.map((m) => ({
      ...m,
      availableSlots: [...m.availableSlots],
    })),
    activeMemberId: 'member-anne',
    matchedSlotLabel: 'Çarşamba 20:00 - 21:00',
    activeSession: null,
    memories: [
      {
        id: 'demo-memory-1',
        activityId: 'emp-2',
        activityTitle: 'Minnettarlık Çemberi',
        category: 'Empati ve İletişim',
        valueLabel: 'Şükran & Takdir',
        points: 45,
        reflectionNote:
          'Telefonları kapattık ve birbirimizin okul/iş gününü gerçekten dinledik. Zeynep günün stresini paylaşınca çok rahatladı.',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        matchedSlotLabel: 'Pazar 19:00 - 20:00',
      },
    ],
    totalPoints: 45,
    weeklyGoal: 3,
  };
}
