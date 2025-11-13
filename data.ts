import { Habit, User, UserProfile, ReactionType, StreakLog, Event, Conversation, Notification } from './types';

const loggedInUser: User = {
  id: 'user_1',
  name: 'Siti_H.D.',
  avatar: `https://i.pravatar.cc/150?u=user_1_siti`,
};

const adminUser: User = {
    id: 'admin_user_01',
    name: 'Admin HabitComm',
    avatar: 'https://i.pravatar.cc/150?u=admin_user_01',
    isAdmin: true,
};

const mockUsers: User[] = [
  loggedInUser,
  { id: 'user_2', name: 'Budi', avatar: `https://i.pravatar.cc/150?u=user_2` },
  { id: 'user_3', name: 'Citra', avatar: `https://i.pravatar.cc/150?u=user_3` },
  { id: 'user_4', name: 'Dewi', avatar: `https://i.pravatar.cc/150?u=user_4` },
  { id: 'user_5', name: 'Eko', avatar: `https://i.pravatar.cc/150?u=user_5` },
  adminUser,
  ...Array.from({ length: 150 }, (_, i) => ({ id: `user_${i + 6}`, name: `User ${i + 6}`, avatar: `https://i.pravatar.cc/150?u=user_${i + 6}` }))
];

const generateDynamicLogs = (days: number, salt: string = ''): StreakLog[] => {
    const today = new Date();
    const logs: StreakLog[] = [];
    for (let i = 1; i <= days; i++) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - i);
        if ((i + salt.length) % 6 !== 0) { // Simulate some missed days, varied by salt
            logs.push({ date: pastDate, note: `Automated log for day ${days - i + 1}.` });
        }
    }
    return logs;
};

const mockUserProfiles: UserProfile[] = [
  {
      ...loggedInUser,
      email: 'siti@example.com',
      motto: "Konsisten adalah kunci!",
      memberSince: new Date('2023-01-15'),
      totalDaysActive: 75,
      level: "Level Master",
      cheersGiven: 15,
      pushesGiven: 3,
      checkInPercentage: 65,
      streaks: [
          { id: 's1', habitId: 'habit_1', name: 'Lari Pagi Rutin', topic: 'Running', logs: generateDynamicLogs(35, 'siti_run') },
          { id: 's2', habitId: 'habit_2', name: 'Belajar Bahasa Korea', topic: 'Reading', logs: generateDynamicLogs(14, 'siti_read') },
      ],
      badges: [],
      notifications: [],
  },
   {
      ...adminUser,
      email: 'admin@habitcomm.app',
      motto: "Keeping the community thriving.",
      memberSince: new Date('2023-01-01'),
      totalDaysActive: 200,
      level: "Community Guardian",
      cheersGiven: 999,
      pushesGiven: 999,
      checkInPercentage: 100,
      streaks: [],
      badges: [],
      notifications: [],
  },
  {
      ...mockUsers[1], // Budi
      email: 'budi@example.com',
      motto: "Satu langkah setiap hari.",
      memberSince: new Date('2023-03-20'),
      totalDaysActive: 50,
      level: "Level Adept",
      cheersGiven: 25,
      pushesGiven: 8,
      checkInPercentage: 80,
      streaks: [
          { id: 's_budi_1', habitId: 'habit_1', name: 'Lari Pagi 5K', topic: 'Running', logs: generateDynamicLogs(28, 'budi_run') },
      ],
      badges: [],
      notifications: []
  },
  {
      ...mockUsers[2], // Citra
      email: 'citra@example.com',
      motto: "Desain adalah hidup.",
      memberSince: new Date('2023-02-10'),
      totalDaysActive: 90,
      level: "Level Pro",
      cheersGiven: 40,
      pushesGiven: 12,
      checkInPercentage: 92,
      streaks: [
          { id: 's_citra_1', habitId: 'habit_3', name: 'Tantangan UI Harian', topic: 'Design', logs: generateDynamicLogs(45, 'citra_design') },
      ],
      badges: [],
      notifications: []
  },
  ...mockUsers.slice(3).filter(u => u.id !== adminUser.id).map(u => ({
    ...u,
    email: `${u.name.toLowerCase().replace(' ', '')}@example.com`,
    motto: "Building better habits.",
    memberSince: new Date(),
    totalDaysActive: Math.floor(Math.random() * 100),
    level: "Novice",
    cheersGiven: Math.floor(Math.random() * 50),
    pushesGiven: Math.floor(Math.random() * 20),
    checkInPercentage: Math.floor(Math.random() * 100),
    streaks: [],
    badges: [],
    notifications: []
  }))
];

const initialConversations: Conversation[] = [
  {
    id: 'user_1-user_2', // Budi & Siti
    participantIds: ['user_1', 'user_2'],
    messages: [
      { id: 'msg1', senderId: 'user_2', content: 'Hai Siti, lari paginya mantap!', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { id: 'msg2', senderId: 'user_1', content: 'Makasih Budi! Kamu juga keren, konsisten terus ya!', timestamp: new Date() },
    ]
  }
];

export const getInitialData = () => {
    const habits: Habit[] = [
      {
        id: 'habit_1',
        name: 'Lari Pagi 5K',
        topic: 'Running',
        description: "Yuk, rutin lari bareng tiap pagi! Sehat & semangat!",
        creatorId: 'user_1',
        highlight: 'Tantangan Streak 30-Hari',
        highlightIcon: 'flame',
        members: [loggedInUser, mockUsers[1], mockUsers[2], mockUsers[3], ...mockUsers.slice(5, 18)],
        rules: 'Posting ringkasan larimu sebelum jam 9 pagi. Beri semangat setidaknya ke 2 anggota lain setiap hari!',
        memberLimit: 20,
        type: 'group',
        posts: [
          {
            id: 'post_1_1',
            // FIX: Added missing habitId property.
            habitId: 'habit_1',
            author: mockUsers[1],
            content: "Selesai 3.5K hari ini! Lumayan pace menurun karena tanjakan 🥵 #RoadTo5K",
            streak: 12,
            reactions: Array.from({length: 12}, (_, i) => ({ userId: `user_${i+10}`, type: ReactionType.CHEER })),
            comments: [
                { id: 'c1', author: mockUsers[2], content: 'Keren, Budi! Tanjakan memang bikin ngos-ngosan tapi jadi lebih kuat!', timestamp: new Date(new Date().setHours(8, 15)) },
                { id: 'c2', author: mockUsers[3], content: 'Mantap! Sama nih, tadi pagi juga lari di rute yang sama.', timestamp: new Date(new Date().setHours(8, 20)) }
            ],
            timestamp: new Date(new Date().setHours(8, 10)),
          },
        ],
      },
        {
        id: 'habit_2',
        name: 'Baca Buku Non-Fiksi',
        topic: 'Reading',
        description: 'Selesaikan 1 buku/bulan. Berbagi wawasan & jaga akuntabilitas!',
        creatorId: 'user_1',
        highlight: 'Voting Buku Baru',
        highlightIcon: 'vote',
        members: [loggedInUser, mockUsers[4], ...mockUsers.slice(90, 108)],
        rules: 'Baca minimal 15 halaman/hari. Posting satu fakta menarik yang kamu pelajari.',
        memberLimit: 20,
        type: 'group',
        posts: [
           {
            id: 'post_2_1',
            // FIX: Added missing habitId property.
            habitId: 'habit_2',
            author: mockUsers[4],
            content: "Tamatkan Bab 3 'Atomic Habits'! Insight ttg pilar kebiasaan meruntuhkan mental block bgt! ? 🤔",
            streak: 8,
            reactions: Array.from({length: 20}, (_, i) => ({ userId: `user_${i+30}`, type: ReactionType.CHEER })),
            comments: [],
            timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
          }
        ],
      },
      {
        id: 'habit_3',
        name: 'Tantangan UI Harian',
        topic: 'Design',
        description: 'Konsisten desain UI tiap hari, tingkatkan skill & dapatkan feedback!',
        creatorId: 'user_1',
        highlight: 'Kritik Desain',
        highlightIcon: 'design',
        members: [loggedInUser, mockUsers[2], mockUsers[3], ...mockUsers.slice(20, 35)],
        rules: 'Posting hasil desainmu setiap hari. Berikan feedback yang membangun ke teman-teman.',
        memberLimit: 20,
        type: 'group',
        posts: [
            {
                id: 'post_3_1',
                // FIX: Added missing habitId property.
                habitId: 'habit_3',
                author: mockUsers[2],
                content: 'Selesai desain Daily UI #001: Sign Up Form. Ada feedback buat improve? 🙏 #UIUXDesign',
                streak: 4,
                reactions: [],
                comments: [],
                timestamp: new Date(new Date().setHours(14, 30)),
            }
        ]
      }
    ];
    
    const events: Event[] = [
        { id: 'e1', title: 'Maraton Lari Virtual 10K', date: '2024-08-30', startTime: '06:00', type: 'online', location: 'Online / Di Mana Saja', onlineUrl: 'https://habitcomm.app/virtual-run', description: 'Bergabunglah dengan ribuan pelari dari seluruh dunia dalam maraton virtual kami! Selesaikan 10K di manapun Anda berada.', coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', isFree: true, organizer: 'Komunitas Lari Sehat' },
        { id: 'e2', title: 'Workshop Desain UI/UX', date: '2024-09-15', startTime: '09:00', type: 'offline', location: 'Gedung Desain Maju, Jakarta', description: 'Pelajari dasar-dasar desain UI/UX dari para ahli industri. Sempurna untuk pemula yang ingin memulai karir di bidang desain.', coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80', isFree: false, price: 150000, organizer: 'Desain Maju Academy', contactPerson: 'Citra (0812-3456-7890)' },
        { id: 'e3', title: 'Tantangan Membaca 30 Hari', date: '2024-10-01', startTime: 'Fleksibel', type: 'online', location: 'Online / Discord HabitComm', onlineUrl: 'https://discord.gg/habitcomm', description: 'Tantang diri Anda untuk membaca setiap hari selama 30 hari! Bagikan kemajuan Anda dan temukan buku-buku baru.', coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80', isFree: true, organizer: 'Klub Buku HabitComm' }
    ];
    
    return { habits, users: mockUserProfiles, loggedInUser, events, conversations: initialConversations };
}
