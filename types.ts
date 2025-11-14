

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
  habitId: string;
  imageUrl?: string; // Optional image for progress posts
  streak: number;
  reactions: Reaction[];
  comments: Comment[];
  timestamp: Date;
}

export interface Habit {
  id:string;
  name: string;
  topic: string;
  description: string;
  creatorId: string; // ID of the user who created the habit
  members: User[];
  pendingMembers: string[]; // IDs of users waiting for approval
  posts: Post[];
  rules: string;
  highlight?: string;
  highlightIcon?: string;
  memberLimit: number;
  coverImage?: string; 
  type: 'private' | 'group';
  isLocked: boolean; // If true, requires approval to join
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
    JOIN_REQUEST = 'JOIN_REQUEST',
    JOIN_APPROVED = 'JOIN_APPROVED',
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

export interface UserPreferences {
    showStats: boolean;
    showBadges: boolean;
    showDailyTips: boolean;
    showTools: boolean;
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
    preferences: UserPreferences;
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
    isLandingPage: boolean;
    isJoinRequestModalOpen: {
        isOpen: boolean;
        habitId: string | null;
    };
    isJoinRequestsAdminModalOpen: {
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

export type Action =
    | { type: 'LOGIN'; payload: UserProfile }
    | { type: 'LOGOUT' }
    | { type: 'REGISTER'; payload: UserProfile }
    | { type: 'OPEN_AUTH_MODAL'; payload: 'login' | 'register' }
    | { type: 'CLOSE_AUTH_MODAL' }
    | { type: 'ENTER_APP' }
    | { type: 'SELECT_HABIT'; payload: string }
    | { type: 'SELECT_EXPLORE' }
    | { type: 'VIEW_PROFILE'; payload: string }
    | { type: 'SELECT_CREATE_HABIT' }
    | { type: 'CREATE_HABIT'; payload: Habit }
    | { type: 'ADD_POST'; payload: { habitId: string; post: Post } }
    | { type: 'ADD_REACTION'; payload: { habitId: string; postId: string; reactionType: ReactionType } }
    | { type: 'ADD_COMMENT'; payload: { habitId: string; postId: string; comment: Comment } }
    | { type: 'JOIN_HABIT'; payload: string }
    | { type: 'REQUEST_JOIN_HABIT'; payload: string }
    | { type: 'OPEN_JOIN_REQUEST_MODAL'; payload: string }
    | { type: 'CLOSE_JOIN_REQUEST_MODAL' }
    | { type: 'OPEN_JOIN_REQUESTS_ADMIN_MODAL'; payload: string }
    | { type: 'CLOSE_JOIN_REQUESTS_ADMIN_MODAL' }
    | { type: 'APPROVE_JOIN_REQUEST'; payload: { habitId: string; userId: string } }
    | { type: 'REJECT_JOIN_REQUEST'; payload: { habitId: string; userId: string } }
    | { type: 'VIEW_HABIT_DETAIL'; payload: Habit }
    | { type: 'CLOSE_HABIT_DETAIL' }
    | { type: 'OPEN_ADD_HABIT_MODAL' }
    | { type: 'CLOSE_ADD_HABIT_MODAL' }
    | { type: 'ADD_HABIT_STREAK'; payload: { name: string; topic: string } }
    | { type: 'OPEN_STREAK_DAY_MODAL'; payload: { streakId: string; date: Date; log: StreakLog | null } }
    | { type: 'CLOSE_STREAK_DAY_MODAL' }
    | { type: 'ADD_STREAK_LOG'; payload: { streakId: string; log: StreakLog } }
    | { type: 'OPEN_SETTINGS' }
    | { type: 'CLOSE_SETTINGS' }
    | { type: 'SET_LANGUAGE', payload: Language }
    | { type: 'OPEN_EDIT_PROFILE_MODAL' }
    | { type: 'CLOSE_EDIT_PROFILE_MODAL' }
    | { type: 'UPDATE_PROFILE'; payload: { name: string, avatar: string, motto: string } }
    | { type: 'SELECT_EVENTS' }
    | { type: 'SELECT_MESSAGING_LIST' }
    | { type: 'OPEN_CREATE_EVENT_MODAL' }
    | { type: 'CLOSE_CREATE_EVENT_MODAL' }
    | { type: 'CREATE_EVENT', payload: Omit<Event, 'id'> }
    | { type: 'VIEW_EVENT_DETAIL', payload: Event }
    | { type: 'CLOSE_EVENT_DETAIL' }
    | { type: 'OPEN_BOOST_HABIT_MODAL'; payload: string }
    | { type: 'CLOSE_BOOST_HABIT_MODAL' }
    | { type: 'BOOST_HABIT'; payload: string }
    | { type: 'SET_THEME'; payload: 'light' | 'dark' }
    | { type: 'OPEN_PRIVACY_POLICY' }
    | { type: 'CLOSE_PRIVACY_POLICY' }
    | { type: 'OPEN_TERMS_CONDITIONS' }
    | { type: 'CLOSE_TERMS_CONDITIONS' }
    | { type: 'OPEN_ABOUT_MODAL' }
    | { type: 'CLOSE_ABOUT_MODAL' }
    | { type: 'OPEN_MESSAGING'; payload: User }
    | { type: 'CLOSE_MESSAGING' }
    | { type: 'SEND_PRIVATE_MESSAGE'; payload: { recipientId: string; content: string } }
    | { type: 'SELECT_ADMIN_VIEW' }
    | { type: 'SUBMIT_BOOST_REQUEST'; payload: { habitId: string, proofImage: string } }
    | { type: 'APPROVE_BOOST_REQUEST'; payload: string } // requestId
    | { type: 'REJECT_BOOST_REQUEST'; payload: string } // requestId
    | { type: 'SELECT_GROUP_HABITS' }
    | { type: 'SELECT_PRIVATE_HABITS' }
    | { type: 'OPEN_MANAGE_MEMBERS_MODAL'; payload: string }
    | { type: 'CLOSE_MANAGE_MEMBERS_MODAL' }
    | { type: 'KICK_MEMBER'; payload: { habitId: string; userId: string } }
    | { type: 'MARK_NOTIFICATIONS_READ' }
    | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> };