

export interface User {
  id: string;
  name: string;
  avatar: string;
  isAdmin?: boolean;
}

export enum ReactionType {
  CHEER = 'CHEER',
  PUSH = 'PUSH',
}

export interface Reaction {
  userId: string;
  type: ReactionType;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string; // Optional image for progress posts
  streak: number;
  reactions: Reaction[];
  comments: Comment[];
  timestamp: Date;
  habitId: string;
}

export interface Habit {
  id:string;
  name: string;
  topic: string;
  description: string;
  creatorId: string; // ID of the user who created the habit
  members: User[];
  posts: Post[];
  rules: string;
  highlight?: string;
  highlightIcon?: string;
  memberLimit: number;
  coverImage?: string; 
  type: 'private' | 'group';
}

export interface StreakLog {
    date: Date;
    note: string;
}

export interface HabitStreak {
    id: string;
    habitId: string; 
    name: string;
    topic: string;
    logs: StreakLog[];
}

export interface Badge {
    id: string;
    name: string;
    icon: string; 
    unlocked: boolean;
    description: string;
}

export enum NotificationType {
    NEW_MESSAGE = 'NEW_MESSAGE',
    NEW_REACTION = 'NEW_REACTION',
    NEW_POST = 'NEW_POST',
    NEW_MEMBER = 'NEW_MEMBER',
}

export interface Notification {
    id: string;
    type: NotificationType;
    sender: User;
    habit?: { id: string, name: string };
    postContent?: string;
    reactionType?: ReactionType;
    isRead: boolean;
    timestamp: Date;
}


export interface UserProfile extends User {
    email?: string;
    motto: string;
    memberSince: Date;
    totalDaysActive: number;
    level: string;
    cheersGiven: number;
    pushesGiven: number;
    checkInPercentage: number;
    streaks: HabitStreak[];
    badges: Badge[];
    notifications: Notification[];
}

export type Language = 'id' | 'en';

export interface PrivateMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string; // Composite key of two sorted user IDs
  participantIds: string[];
  messages: PrivateMessage[];
}

export interface BoostRequest {
    id: string;
    habitId: string;
    userId: string;
    proofImage: string; // base64
    status: 'pending' | 'approved' | 'rejected';
    timestamp: Date;
}


export type AppState = {
    habits: Habit[];
    currentUser: UserProfile | null;
    loggedInUserProfile: UserProfile | null;
    users: UserProfile[]; // All user profiles
    conversations: Conversation[];
    selectedHabitId: string | null;
    currentView: 'habit' | 'profile' | 'explore' | 'createHabit' | 'events' | 'messagingList' | 'admin' | 'comingSoon' | 'groupHabits' | 'privateHabits';
    viewingProfileId: string | null; // ID of the profile being viewed
    viewingHabitDetail: Habit | null;
    isAddingHabit: boolean;
    streakDayModal: {
        isOpen: boolean;
        streakId: string | null;
        date: Date | null;
        log: StreakLog | null;
    };
    isSettingsOpen: boolean;
    language: Language;
    isEditingProfile: boolean;
    events: Event[];
    isCreatingEvent: boolean;
    viewingEventDetail: Event | null;
    boostedHabitId: string | null;
    isBoostingHabit: {
        isOpen: boolean;
        habitId: string | null;
    };
    theme: 'light' | 'dark';
    isPrivacyPolicyOpen: boolean;
    isTermsConditionsOpen: boolean;
    isAboutModalOpen: boolean;
    isMessaging: {
      isOpen: boolean;
      recipient: User | null;
    };
    isAuthModalOpen: boolean;
    authModalView: 'login' | 'register' | 'forgotPassword' | 'forgotPasswordSuccess';
    boostRequests: BoostRequest[];
    isManageMembersModalOpen: {
        isOpen: boolean;
        habitId: string | null;
    };
};

export interface Event {
    id: string;
    title: string;
    date: string;
    startTime: string;
    type: 'online' | 'offline';
    location?: string;
    onlineUrl?: string;
    description: string;
    coverImage: string;
    isFree: boolean;
    organizer: string;
    price?: number;
    contactPerson?: string;
}