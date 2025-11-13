import React, { useReducer, useState, useEffect, useCallback } from 'react';
// FIX: Import `Reaction` type to resolve reference error on line 46.
import { AppState, Habit, User, Post, Reaction, ReactionType, UserProfile, HabitStreak, StreakLog, Language, Comment, Event, Conversation, PrivateMessage, Notification, NotificationType, BoostRequest } from './types';
import { translations } from './translations';
import { supabase } from './supabase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HabitView from './components/HuddleView';
import ProfilePage from './components/ProfilePage';
import ExploreView from './components/ExploreView';
import HabitDetailModal from './components/HuddleDetailModal';
import CreateHabitView from './components/CreateHuddleView';
import AddHabitModal from './components/AddHabitModal';
import StreakDayModal from './components/StreakDayModal';
import SettingsModal from './components/SettingsModal';
import EditProfileModal from './components/EditProfileModal';
import EventsView from './components/EventsView';
import CreateEventModal from './components/CreateEventModal';
import EventDetailModal from './components/EventDetailModal';
import BoostHabitModal from './components/BoostHabitModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsConditionsModal from './components/TermsConditionsModal';
import MessagingModal from './components/MessagingModal';
import MessagingListView from './components/MessagingListView';
import AuthModal from './components/AuthView';
import AdminView from './components/AdminView';
import ComingSoonView from './components/ComingSoonView';
import AboutModal from './components/AboutModal';
import BottomNavbar from './components/BottomNavbar';
import UserHabitsListView from './components/UserHabitsListView';
import ManageMembersModal from './components/ManageMembersModal';


// --- REDUCER & STATE ---
type Action =
    | { type: 'SET_INITIAL_DATA'; payload: { habits: Habit[], users: UserProfile[], events: Event[], conversations: Conversation[], boostRequests: BoostRequest[] } }
    | { type: 'LOGIN'; payload: UserProfile }
    | { type: 'LOGOUT' }
    | { type: 'OPEN_AUTH_MODAL'; payload: 'login' | 'register' }
    | { type: 'CLOSE_AUTH_MODAL' }
    | { type: 'SELECT_HABIT'; payload: string }
    | { type: 'SELECT_EXPLORE' }
    | { type: 'VIEW_PROFILE'; payload: string }
    | { type: 'SELECT_CREATE_HABIT' }
    | { type: 'CREATE_HABIT'; payload: Habit }
    // FIX: Update ADD_POST payload to include habitId, which is required by the reducer logic on line 219.
    | { type: 'ADD_POST'; payload: Post & { habitId: string } }
    | { type: 'UPDATE_REACTIONS'; payload: { habitId: string; postId: string; reactions: Reaction[] } }
    | { type: 'ADD_COMMENT'; payload: { habitId: string; postId: string; comment: Comment } }
    | { type: 'JOIN_HABIT'; payload: { habit: Habit, user: User, streak: HabitStreak } }
    | { type: 'VIEW_HABIT_DETAIL'; payload: Habit }
    | { type: 'CLOSE_HABIT_DETAIL' }
    | { type: 'OPEN_ADD_HABIT_MODAL' }
    | { type: 'CLOSE_ADD_HABIT_MODAL' }
    | { type: 'ADD_HABIT_STREAK'; payload: HabitStreak }
    | { type: 'OPEN_STREAK_DAY_MODAL'; payload: { streakId: string; date: Date; log: StreakLog | null } }
    | { type: 'CLOSE_STREAK_DAY_MODAL' }
    | { type: 'UPDATE_STREAK_LOG'; payload: { streakId: string; logs: StreakLog[] } }
    | { type: 'OPEN_SETTINGS' }
    | { type: 'CLOSE_SETTINGS' }
    | { type: 'SET_LANGUAGE', payload: Language }
    | { type: 'OPEN_EDIT_PROFILE_MODAL' }
    | { type: 'CLOSE_EDIT_PROFILE_MODAL' }
    | { type: 'UPDATE_PROFILE'; payload: UserProfile  }
    | { type: 'SELECT_EVENTS' }
    | { type: 'SELECT_MESSAGING_LIST' }
    | { type: 'OPEN_CREATE_EVENT_MODAL' }
    | { type: 'CLOSE_CREATE_EVENT_MODAL' }
    | { type: 'CREATE_EVENT', payload: Event }
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
    | { type: 'UPDATE_CONVERSATIONS'; payload: Conversation[] }
    | { type: 'SELECT_ADMIN_VIEW' }
    | { type: 'ADD_BOOST_REQUEST'; payload: BoostRequest }
    | { type: 'UPDATE_BOOST_REQUEST_STATUS'; payload: { requestId: string, status: 'approved' | 'rejected' } }
    | { type: 'SELECT_GROUP_HABITS' }
    | { type: 'SELECT_PRIVATE_HABITS' }
    | { type: 'OPEN_MANAGE_MEMBERS_MODAL'; payload: string }
    | { type: 'CLOSE_MANAGE_MEMBERS_MODAL' }
    | { type: 'KICK_MEMBER'; payload: { habitId: string; userId: string } };

const savedTheme = localStorage.getItem('habitcom-theme') || 'light';

const initialState: AppState = {
    habits: [],
    currentUser: null,
    loggedInUserProfile: null,
    users: [],
    conversations: [],
    selectedHabitId: null,
    currentView: 'explore',
    viewingProfileId: null,
    viewingHabitDetail: null,
    isAddingHabit: false,
    streakDayModal: { isOpen: false, streakId: null, date: null, log: null },
    isSettingsOpen: false,
    language: 'id',
    isEditingProfile: false,
    events: [],
    isCreatingEvent: false,
    viewingEventDetail: null,
    boostedHabitId: null,
    isBoostingHabit: { isOpen: false, habitId: null },
    theme: savedTheme === 'dark' ? 'dark' : 'light',
    isPrivacyPolicyOpen: false,
    isTermsConditionsOpen: false,
    isAboutModalOpen: false,
    isMessaging: { isOpen: false, recipient: null },
    isAuthModalOpen: false,
    authModalView: 'login',
    boostRequests: [],
    isManageMembersModalOpen: { isOpen: false, habitId: null },
};

// --- Helper to convert Supabase timestamps to Date objects ---
const parseDates = (data: any, fields: string[]): any => {
    if (!data) return data;
    if (Array.isArray(data)) {
        return data.map(item => parseDates(item, fields));
    }
    const newData = { ...data };
    fields.forEach(field => {
        if (newData[field]) {
            newData[field] = new Date(newData[field]);
        }
    });
    // Recursively parse nested objects
    Object.keys(newData).forEach(key => {
        if (typeof newData[key] === 'object' && newData[key] !== null) {
            newData[key] = parseDates(newData[key], fields);
        }
    });
    return newData;
};


function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_INITIAL_DATA':
            return {
                ...state,
                ...action.payload,
            };
        case 'LOGIN':
            const userToLogin = action.payload;
            const viewAfterLogin = userToLogin.isAdmin ? 'admin' : 'explore';
            if (userToLogin.isAdmin) window.location.hash = '/admin';
            else window.location.hash = '/explore';
            return { 
                ...state, 
                currentUser: userToLogin, 
                loggedInUserProfile: userToLogin,
                currentView: viewAfterLogin,
                isAuthModalOpen: false,
            };
        case 'LOGOUT':
            window.location.hash = '/explore';
            return {
                ...initialState, // Reset to initial state on logout
                language: state.language,
                theme: state.theme,
            };
        case 'OPEN_AUTH_MODAL':
            return { ...state, isAuthModalOpen: true, authModalView: action.payload };
        case 'CLOSE_AUTH_MODAL':
            return { ...state, isAuthModalOpen: false };
        case 'SELECT_HABIT':
            if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, selectedHabitId: action.payload, currentView: 'habit', viewingProfileId: null };
        case 'SELECT_EXPLORE':
            return { ...state, currentView: 'explore', selectedHabitId: null, viewingProfileId: null };
        case 'VIEW_PROFILE':
            if (!state.currentUser) {
                 return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, currentView: 'profile', selectedHabitId: null, viewingProfileId: action.payload };
        case 'SELECT_CREATE_HABIT':
             if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, currentView: 'createHabit', selectedHabitId: null, viewingProfileId: null };
        case 'CREATE_HABIT': {
            const newHabit = action.payload;
            if (!state.loggedInUserProfile) return state;

            const targetView = newHabit.type === 'group' ? 'habit' : 'profile';
            if (newHabit.type === 'group') {
                window.location.hash = `/#/habit/${newHabit.id}`;
            } else {
                window.location.hash = `/#/profile/${state.loggedInUserProfile.id}`;
            }

            return {
                ...state,
                habits: [newHabit, ...state.habits],
                selectedHabitId: newHabit.type === 'group' ? newHabit.id : null,
                currentView: targetView,
                viewingProfileId: newHabit.type === 'private' ? state.loggedInUserProfile.id : null,
            };
        }
        case 'ADD_POST': {
            if (!state.currentUser) return state;
            const newPost = action.payload;
            return {
                ...state,
                habits: state.habits.map(h =>
                    h.id === newPost.habitId
                        ? { ...h, posts: [newPost, ...h.posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) }
                        : h
                ),
            };
        }
        case 'UPDATE_REACTIONS': {
             if (!state.currentUser) return state;
            return {
                ...state,
                habits: state.habits.map(h => {
                    if (h.id !== action.payload.habitId) return h;
                    return {
                        ...h,
                        posts: h.posts.map(p => 
                            p.id !== action.payload.postId ? p : { ...p, reactions: action.payload.reactions }
                        ),
                    };
                }),
            };
        }
        case 'ADD_COMMENT': {
            if (!state.currentUser) return state;
            return {
                ...state,
                habits: state.habits.map(h => 
                    h.id === action.payload.habitId
                    ? { ...h, posts: h.posts.map(p => p.id === action.payload.postId ? { ...p, comments: [...p.comments, action.payload.comment] } : p ) }
                    : h
                )
            };
        }
        case 'JOIN_HABIT': {
            if (!state.currentUser || !state.loggedInUserProfile) return state;
            
            window.location.hash = `/#/habit/${action.payload.habit.id}`;

            return {
                ...state,
                habits: state.habits.map(h =>
                    h.id === action.payload.habit.id ? { ...h, members: [...h.members, action.payload.user] } : h
                ),
                loggedInUserProfile: {
                    ...state.loggedInUserProfile,
                    streaks: [...state.loggedInUserProfile.streaks, action.payload.streak]
                },
                selectedHabitId: action.payload.habit.id,
                currentView: 'habit',
                viewingHabitDetail: null,
            };
        }
        case 'VIEW_HABIT_DETAIL':
            return { ...state, viewingHabitDetail: action.payload };
        case 'CLOSE_HABIT_DETAIL':
            return { ...state, viewingHabitDetail: null };
        
        case 'OPEN_ADD_HABIT_MODAL':
            return { ...state, isAddingHabit: true };
        case 'CLOSE_ADD_HABIT_MODAL':
            return { ...state, isAddingHabit: false };
        case 'ADD_HABIT_STREAK': {
            if (!state.loggedInUserProfile) return state;
            return {
                ...state,
                loggedInUserProfile: {
                    ...state.loggedInUserProfile,
                    streaks: [...state.loggedInUserProfile.streaks, action.payload],
                },
                isAddingHabit: false,
            };
        }
        case 'OPEN_STREAK_DAY_MODAL':
            return { ...state, streakDayModal: { isOpen: true, ...action.payload } };
        case 'CLOSE_STREAK_DAY_MODAL':
            return { ...state, streakDayModal: { isOpen: false, streakId: null, date: null, log: null } };
        case 'UPDATE_STREAK_LOG': {
            if (!state.loggedInUserProfile) return state;
            const updatedProfile = {
                ...state.loggedInUserProfile,
                streaks: state.loggedInUserProfile.streaks.map(s => s.id === action.payload.streakId ? { ...s, logs: action.payload.logs } : s)
            };
            return {
                ...state,
                loggedInUserProfile: updatedProfile,
                users: state.users.map(u => u.id === updatedProfile.id ? updatedProfile : u),
                streakDayModal: { isOpen: false, streakId: null, date: null, log: null },
            };
        }
        case 'OPEN_SETTINGS':
            return { ...state, isSettingsOpen: true };
        case 'CLOSE_SETTINGS':
            return { ...state, isSettingsOpen: false };
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };
        case 'OPEN_EDIT_PROFILE_MODAL':
            return { ...state, isEditingProfile: true };
        case 'CLOSE_EDIT_PROFILE_MODAL':
            return { ...state, isEditingProfile: false };
        case 'UPDATE_PROFILE': {
            if (!state.currentUser) return state;
            const updatedProfile = action.payload;
            return {
                ...state,
                currentUser: updatedProfile,
                loggedInUserProfile: updatedProfile,
                users: state.users.map(u => u.id === updatedProfile.id ? updatedProfile : u),
                 habits: state.habits.map(habit => ({
                    ...habit,
                    members: habit.members.map(member => member.id === updatedProfile.id ? { ...member, name: updatedProfile.name, avatar: updatedProfile.avatar } : member),
                    posts: habit.posts.map(post => ({
                        ...post,
                        author: post.author.id === updatedProfile.id ? { ...post.author, name: updatedProfile.name, avatar: updatedProfile.avatar } : post.author,
                        comments: post.comments.map(comment => ({
                            ...comment,
                            author: comment.author.id === updatedProfile.id ? { ...comment.author, name: updatedProfile.name, avatar: updatedProfile.avatar } : comment.author,
                        }))
                    }))
                })),
                isEditingProfile: false,
            };
        }
        case 'SELECT_EVENTS':
             if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, currentView: 'events', selectedHabitId: null, viewingProfileId: null };
        case 'SELECT_MESSAGING_LIST':
             if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, currentView: 'messagingList', selectedHabitId: null, viewingProfileId: null };
        case 'OPEN_CREATE_EVENT_MODAL':
            return { ...state, isCreatingEvent: true };
        case 'CLOSE_CREATE_EVENT_MODAL':
            return { ...state, isCreatingEvent: false };
        case 'CREATE_EVENT':
            return { ...state, events: [action.payload, ...state.events], isCreatingEvent: false };
        case 'VIEW_EVENT_DETAIL':
            return { ...state, viewingEventDetail: action.payload };
        case 'CLOSE_EVENT_DETAIL':
            return { ...state, viewingEventDetail: null };
        case 'OPEN_BOOST_HABIT_MODAL':
            return { ...state, isBoostingHabit: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_BOOST_HABIT_MODAL':
            return { ...state, isBoostingHabit: { isOpen: false, habitId: null } };
        case 'BOOST_HABIT':
            return { ...state, boostedHabitId: action.payload, isBoostingHabit: { isOpen: false, habitId: null } };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'OPEN_PRIVACY_POLICY':
            return { ...state, isPrivacyPolicyOpen: true };
        case 'CLOSE_PRIVACY_POLICY':
            return { ...state, isPrivacyPolicyOpen: false };
        case 'OPEN_TERMS_CONDITIONS':
            return { ...state, isTermsConditionsOpen: true };
        case 'CLOSE_TERMS_CONDITIONS':
            return { ...state, isTermsConditionsOpen: false };
        case 'OPEN_ABOUT_MODAL':
            return { ...state, isAboutModalOpen: true };
        case 'CLOSE_ABOUT_MODAL':
            return { ...state, isAboutModalOpen: false };
        case 'OPEN_MESSAGING':
            return { ...state, isMessaging: { isOpen: true, recipient: action.payload }};
        case 'CLOSE_MESSAGING':
            return { ...state, isMessaging: { isOpen: false, recipient: null }};
        case 'UPDATE_CONVERSATIONS':
            return { ...state, conversations: action.payload };
        case 'SELECT_ADMIN_VIEW':
            if (!state.currentUser?.isAdmin) return state;
            return { ...state, currentView: 'admin', selectedHabitId: null, viewingProfileId: null };

        case 'ADD_BOOST_REQUEST':
            return {
                ...state,
                boostRequests: [...state.boostRequests, action.payload],
                isBoostingHabit: { isOpen: false, habitId: null },
            };
        
        case 'UPDATE_BOOST_REQUEST_STATUS': {
            const { requestId, status } = action.payload;
            const requestToUpdate = state.boostRequests.find(r => r.id === requestId);
            if (!requestToUpdate) return state;

            return {
                ...state,
                boostRequests: state.boostRequests.map(r => r.id === requestId ? { ...r, status } : r),
                boostedHabitId: status === 'approved' ? requestToUpdate.habitId : state.boostedHabitId,
            };
        }
        case 'SELECT_GROUP_HABITS':
            if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, currentView: 'groupHabits', selectedHabitId: null, viewingProfileId: null };
        case 'SELECT_PRIVATE_HABITS':
            if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return { ...state, currentView: 'privateHabits', selectedHabitId: null, viewingProfileId: null };
        
        case 'OPEN_MANAGE_MEMBERS_MODAL':
            return { ...state, isManageMembersModalOpen: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_MANAGE_MEMBERS_MODAL':
            return { ...state, isManageMembersModalOpen: { isOpen: false, habitId: null } };
        case 'KICK_MEMBER': {
            const { habitId, userId } = action.payload;
            
            const updatedHabits = state.habits.map(h => 
                h.id === habitId 
                ? { ...h, members: h.members.filter(m => m.id !== userId) }
                : h
            );

             const updatedProfile = state.users.find(u => u.id === userId);
             if (updatedProfile) {
                updatedProfile.streaks = updatedProfile.streaks.filter(s => s.habitId !== habitId);
             }

            return { ...state, habits: updatedHabits };
        }
        default:
            return state;
    }
}


// --- MAIN APP ---
export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null); // For base64 preview

  const { habits, currentUser, loggedInUserProfile, users, conversations, selectedHabitId, currentView, viewingProfileId, viewingHabitDetail, isAddingHabit, streakDayModal, isSettingsOpen, language, isEditingProfile, events, isCreatingEvent, viewingEventDetail, boostedHabitId, isBoostingHabit, theme, isPrivacyPolicyOpen, isTermsConditionsOpen, isAboutModalOpen, isMessaging, isAuthModalOpen, authModalView, boostRequests, isManageMembersModalOpen } = state;
  const t = (key: keyof typeof translations.id) => translations[language][key] || key;

  // --- AUTH & DATA FETCHING ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
            dispatch({ type: 'LOGIN', payload: parseDates(profile, ['memberSince']) as UserProfile });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async () => {
    const { data: habitsData, error: habitsError } = await supabase.from('habits').select('*, members:profiles(*), posts(*, author:profiles(*), comments(*, author:profiles(*)), reactions(*))');
    const { data: usersData, error: usersError } = await supabase.from('profiles').select('*, streaks(*)');
    const { data: eventsData, error: eventsError } = await supabase.from('events').select('*');
    const { data: boostRequestsData, error: boostRequestsError } = await supabase.from('boost_requests').select('*');
    // More fetches can be added here (conversations etc.)
    
    if (habitsError || usersError || eventsError || boostRequestsError) {
        console.error(habitsError || usersError || eventsError || boostRequestsError);
        return;
    }

    dispatch({
        type: 'SET_INITIAL_DATA',
        payload: {
            habits: parseDates(habitsData, ['timestamp']),
            users: parseDates(usersData, ['memberSince']),
            events: parseDates(eventsData, []),
            conversations: [], // Placeholder for now
            boostRequests: parseDates(boostRequestsData, ['timestamp']),
        }
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
        fetchData();
    }
  }, [currentUser, fetchData]);

  // --- REALTIME SUBSCRIPTIONS ---
  useEffect(() => {
    const channels = supabase.channel('realtime-all');
    channels
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            fetchData(); // Refetch all data on any change
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channels);
    };
  }, [fetchData]);


  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    localStorage.setItem('habitcom-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash.replace(/^#\/?/, ''); // #/foo -> foo
        const [path, id] = hash.split('/');

        switch (path) {
            case 'habit':
                if (id) dispatch({ type: 'SELECT_HABIT', payload: id });
                break;
            case 'profile':
                if (id) dispatch({ type: 'VIEW_PROFILE', payload: id });
                break;
            case 'createHabit':
                dispatch({ type: 'SELECT_CREATE_HABIT' });
                break;
            case 'events':
                dispatch({ type: 'SELECT_EVENTS' });
                break;
            case 'messagingList':
                dispatch({ type: 'SELECT_MESSAGING_LIST' });
                break;
            case 'admin':
                dispatch({ type: 'SELECT_ADMIN_VIEW' });
                break;
            case 'groupHabits':
                dispatch({ type: 'SELECT_GROUP_HABITS' });
                break;
            case 'privateHabits':
                dispatch({ type: 'SELECT_PRIVATE_HABITS' });
                break;
            case 'explore':
            default:
                dispatch({ type: 'SELECT_EXPLORE' });
                break;
        }
    };

    handleHashChange(); // Initial route
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
}, []); // Run only once

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  // --- HANDLERS ---
  const handleLogin = async (email: string, pass: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) alert(error.message);
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pass });
      if (authError) {
          alert(authError.message);
          return;
      }
      if (authData.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
              id: authData.user.id,
              name,
              avatar: `https://i.pravatar.cc/150?u=${authData.user.id}`,
              memberSince: new Date().toISOString(),
              level: 'Beginner',
              totalDaysActive: 0,
              cheersGiven: 0,
              pushesGiven: 0,
              checkInPercentage: 0,
              motto: '',
          });
          if (profileError) {
            alert(`Database error saving new user: ${profileError.message}`);
          }
      }
  };
  
   const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };
  
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  const handleImageSelect = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPostImage(reader.result as string); // Set base64 for preview
        };
        reader.readAsDataURL(file);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!postContent.trim() && !postImage) || !selectedHabit || !currentUser) return;
    
    let imageUrl: string | undefined = undefined;

    if (postImage) {
        const blob = dataURLtoBlob(postImage);
        if (blob) {
            const filePath = `posts/${currentUser.id}/${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, blob);
            if (uploadError) {
                console.error("Upload error:", uploadError);
            } else {
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
                imageUrl = publicUrl;
            }
        }
    }

    const { data: newPost, error } = await supabase.from('posts').insert({
      authorId: currentUser.id,
      habitId: selectedHabit.id,
      content: postContent,
      imageUrl,
      streak: 0, // Should be calculated
      timestamp: new Date().toISOString(),
    }).select('*, author:profiles(*)').single();

    if (error) {
        console.error(error);
    } else if (newPost) {
        // Optimistic update handled by realtime subscription
        setPostContent('');
        setPostImage(null);
    }
  };
  
  const handleCreateHabit = async (habitData: Omit<Habit, 'id'|'members'|'posts'|'memberLimit'|'highlightIcon'|'creatorId'>, coverImageFile: File | null) => {
      if (!currentUser) return;

      let coverImageUrl: string | undefined = undefined;
      if (coverImageFile) {
          const filePath = `covers/${currentUser.id}/${Date.now()}_${coverImageFile.name}`;
          await supabase.storage.from('images').upload(filePath, coverImageFile);
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
          coverImageUrl = publicUrl;
      }

      const { data: newHabit, error } = await supabase.from('habits').insert({
          ...habitData,
          creatorId: currentUser.id,
          memberLimit: 20,
          coverImage: coverImageUrl,
      }).select().single();

      if (error) console.error(error);
      // Further actions like adding member and streak are handled by realtime/refetch
  };
  
  const handleReaction = async (postId: string, reactionType: ReactionType) => {
    if(!currentUser || !selectedHabitId) return;

    const { data: existingReaction, error: fetchError } = await supabase.from('reactions')
      .select('id, type')
      .eq('postId', postId)
      .eq('userId', currentUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows" error
      console.error(fetchError);
      return;
    }

    if (existingReaction) {
        if (existingReaction.type === reactionType) { // Un-react
            await supabase.from('reactions').delete().match({ id: existingReaction.id });
        } else { // Change reaction
             await supabase.from('reactions').update({ type: reactionType }).match({ id: existingReaction.id });
        }
    } else { // New reaction
        await supabase.from('reactions').insert({ postId, userId: currentUser.id, type: reactionType });
    }
  }

  const handleCommentSubmit = async (habitId: string, postId: string, content: string) => {
      if (!currentUser || !content.trim()) return;
      await supabase.from('comments').insert({ postId, authorId: currentUser.id, content, timestamp: new Date().toISOString() });
  };
  
  const handleJoinHabit = async (habitId: string) => {
      if (!currentUser) return;
      await supabase.from('habit_members').insert({ habitId, userId: currentUser.id });
  };

  const handleDayClick = (streakId: string, date: Date) => {
    const profile = users.find(u => u.streaks.some(s => s.id === streakId));
    if (!profile) return;
    const streak = profile.streaks.find(s => s.id === streakId);
    if (!streak) return;
    const log = streak.logs.find(l => new Date(l.date).toDateString() === date.toDateString()) || null;
    dispatch({ type: 'OPEN_STREAK_DAY_MODAL', payload: { streakId, date, log } });
  };
  
  const handleAddStreakLog = async (streakId: string, log: StreakLog) => {
      if (!loggedInUserProfile) return;
      const streak = loggedInUserProfile.streaks.find(s => s.id === streakId);
      if (!streak) return;
      
      const existingLogs = streak.logs.filter(l => new Date(l.date).toDateString() !== log.date.toDateString());
      const updatedLogs = [...existingLogs, log].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const { error } = await supabase.from('streaks').update({ logs: updatedLogs }).eq('id', streakId);
      if (error) console.error(error);
      else dispatch({ type: 'UPDATE_STREAK_LOG', payload: { streakId, logs: updatedLogs } });
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id'>) => {
      await supabase.from('events').insert(eventData);
  };
  
  const handleBoostHabit = (habitId: string) => {
    dispatch({ type: 'OPEN_BOOST_HABIT_MODAL', payload: habitId });
  };
  
  const handleSendMessage = (content: string) => {
    if (!isMessaging.recipient) return;
    // Messaging logic needs to be fully implemented with conversations table
    console.log("Sending message...", { recipient: isMessaging.recipient.id, content });
  };

  const handleBoostSubmit = async (habitId: string, proofImageFile: File) => {
    if (!currentUser) return;
    const filePath = `boosts/${currentUser.id}/${Date.now()}_${proofImageFile.name}`;
    await supabase.storage.from('images').upload(filePath, proofImageFile);
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    
    await supabase.from('boost_requests').insert({
        habitId,
        userId: currentUser.id,
        proofImage: publicUrl,
        status: 'pending',
        timestamp: new Date().toISOString()
    });
  };
  
  const handleUpdateProfile = async (name: string, avatarFile: File | null) => {
      if(!loggedInUserProfile) return;
      let avatarUrl = loggedInUserProfile.avatar;

      if(avatarFile) {
          const filePath = `avatars/${loggedInUserProfile.id}/${Date.now()}_${avatarFile.name}`;
          await supabase.storage.from('images').upload(filePath, avatarFile, { upsert: true });
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
          avatarUrl = publicUrl;
      }
      const { data, error } = await supabase.from('profiles').update({ name, avatar: avatarUrl }).eq('id', loggedInUserProfile.id).select().single();
      if(data) dispatch({ type: 'UPDATE_PROFILE', payload: data as UserProfile });
      if(error) console.error(error);
  }

  const renderMainView = () => {
    const allUserHabits = loggedInUserProfile ? habits.filter(h => h.members.some(m => m.id === loggedInUserProfile!.id)) : [];
    switch (currentView) {
        case 'admin':
            return <AdminView 
                requests={boostRequests}
                habits={habits}
                users={users}
                onApprove={async (id) => await supabase.from('boost_requests').update({ status: 'approved' }).eq('id', id)}
                onReject={async (id) => await supabase.from('boost_requests').update({ status: 'rejected' }).eq('id', id)}
                t={t}
            />;
        case 'profile': {
            if (!viewingProfileId || !loggedInUserProfile) return null;
            const profileToView = users.find(u => u.id === viewingProfileId);
            if (!profileToView) return <p>User not found</p>;
            return <ProfilePage 
                profileToView={profileToView} 
                currentUserProfile={loggedInUserProfile}
                allHabits={habits}
                onAddHabit={() => dispatch({type: 'OPEN_ADD_HABIT_MODAL'})}
                onDayClick={handleDayClick}
                onOpenMessage={(user) => dispatch({ type: 'OPEN_MESSAGING', payload: user })}
                t={t}
                language={language}
             />;
        }
        case 'createHabit':
            return <CreateHabitView
                onCreate={handleCreateHabit}
                onCancel={() => window.location.hash = '/explore'}
                t={t}
            />;
        case 'habit':
            if (!selectedHabit || !currentUser) {
                 return <ExploreView 
                        allHabits={habits}
                        currentUser={currentUser} 
                        onJoinHabit={handleJoinHabit} 
                        onViewDetail={(habit) => dispatch({ type: 'VIEW_HABIT_DETAIL', payload: habit })}
                        t={t}
                        boostedHabitId={boostedHabitId}
                    />;
            }
            return <HabitView 
                selectedHabit={selectedHabit}
                currentUser={currentUser}
                allUsers={users}
                postContent={postContent}
                setPostContent={setPostContent}
                postImage={postImage}
                setPostImage={setPostImage}
                handleImageSelect={handleImageSelect}
                handlePostSubmit={handlePostSubmit}
                handleReaction={handleReaction}
                handleCommentSubmit={handleCommentSubmit}
                handleBoostHabit={handleBoostHabit}
                onOpenManageMembers={(habitId) => dispatch({ type: 'OPEN_MANAGE_MEMBERS_MODAL', payload: habitId })}
                t={t}
                boostedHabitId={boostedHabitId}
            />;
        case 'groupHabits':
             return <UserHabitsListView 
                allUserHabits={allUserHabits}
                type="group"
                t={t}
             />;
        case 'privateHabits':
              return <UserHabitsListView 
                allUserHabits={allUserHabits}
                type="private"
                t={t}
             />;
        case 'comingSoon':
            return <ComingSoonView t={t} />;
        case 'events':
            return <EventsView 
                        events={events} 
                        t={t} 
                        onCreateEvent={() => dispatch({ type: 'OPEN_CREATE_EVENT_MODAL'})}
                        onViewEvent={(event) => dispatch({ type: 'VIEW_EVENT_DETAIL', payload: event })}
                    />;
        case 'messagingList':
            if (!loggedInUserProfile) return null;
            return <MessagingListView
                conversations={conversations}
                users={users}
                currentUserProfile={loggedInUserProfile}
                onOpenConversation={(user) => dispatch({ type: 'OPEN_MESSAGING', payload: user })}
                t={t}
            />;
        case 'explore':
        default:
            return <ExploreView 
                        allHabits={habits}
                        currentUser={currentUser} 
                        onJoinHabit={handleJoinHabit} 
                        onViewDetail={(habit) => dispatch({ type: 'VIEW_HABIT_DETAIL', payload: habit })}
                        t={t}
                        boostedHabitId={boostedHabitId}
                    />;
    }
  };


  return (
    <div className="h-full max-w-[1100px] mx-auto flex flex-col font-sans bg-white dark:bg-neutral-900 md:rounded-xl overflow-hidden md:shadow-2xl md:border border-border-color dark:border-neutral-800">
        {isAuthModalOpen && (
            <AuthModal
                initialView={authModalView}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onClose={() => dispatch({ type: 'CLOSE_AUTH_MODAL' })}
                t={t}
            />
        )}
        {isManageMembersModalOpen.isOpen && state.habits.find(h => h.id === isManageMembersModalOpen.habitId) && currentUser && (
            <ManageMembersModal
                habit={state.habits.find(h => h.id === isManageMembersModalOpen.habitId)!}
                currentUser={currentUser}
                onClose={() => dispatch({ type: 'CLOSE_MANAGE_MEMBERS_MODAL' })}
                onKickMember={async (userId) => await supabase.from('habit_members').delete().match({ habitId: isManageMembersModalOpen.habitId, userId })}
                t={t}
            />
        )}
      {viewingHabitDetail && 
        <HabitDetailModal 
          habit={viewingHabitDetail} 
          onClose={() => dispatch({ type: 'CLOSE_HABIT_DETAIL'})}
          onJoin={handleJoinHabit}
          isMember={currentUser ? viewingHabitDetail.members.some(m => m.id === currentUser.id) : false}
          t={t}
        />}
        {isAddingHabit && (
            <AddHabitModal 
                onClose={() => dispatch({type: 'CLOSE_ADD_HABIT_MODAL'})}
                onSave={async (data) => {
                    if(!loggedInUserProfile) return;
                    await supabase.from('streaks').insert({ ...data, userId: loggedInUserProfile.id, logs: [] });
                }}
                t={t}
            />
        )}
        {streakDayModal.isOpen && streakDayModal.date && streakDayModal.streakId && (
            <StreakDayModal
                date={streakDayModal.date}
                log={streakDayModal.log}
                onClose={() => dispatch({type: 'CLOSE_STREAK_DAY_MODAL'})}
                onSave={(note) => handleAddStreakLog(streakDayModal.streakId!, { date: streakDayModal.date!, note })}
                t={t}
                language={language}
            />
        )}
        {isSettingsOpen && (
            <SettingsModal
                onClose={() => dispatch({type: 'CLOSE_SETTINGS'})}
                onLogout={handleLogout}
                currentLanguage={language}
                onLanguageChange={(lang) => dispatch({type: 'SET_LANGUAGE', payload: lang})}
                currentTheme={theme}
                onThemeChange={(theme) => dispatch({ type: 'SET_THEME', payload: theme })}
                onOpenPrivacyPolicy={() => dispatch({ type: 'OPEN_PRIVACY_POLICY' })}
                onOpenTermsConditions={() => dispatch({ type: 'OPEN_TERMS_CONDITIONS' })}
                onOpenAbout={() => dispatch({ type: 'OPEN_ABOUT_MODAL' })}
                t={t}
            />
        )}
        {isEditingProfile && loggedInUserProfile && (
            <EditProfileModal
                currentUser={loggedInUserProfile}
                onClose={() => dispatch({ type: 'CLOSE_EDIT_PROFILE_MODAL' })}
                onSave={handleUpdateProfile}
                t={t}
            />
        )}
        {isCreatingEvent && (
            <CreateEventModal
                onClose={() => dispatch({ type: 'CLOSE_CREATE_EVENT_MODAL' })}
                onSave={handleCreateEvent}
                t={t}
            />
        )}
        {viewingEventDetail && (
            <EventDetailModal
                event={viewingEventDetail}
                onClose={() => dispatch({ type: 'CLOSE_EVENT_DETAIL' })}
                t={t}
                language={language}
            />
        )}
        {isBoostingHabit.isOpen && state.habits.find(h => h.id === isBoostingHabit.habitId) && (
            <BoostHabitModal
                habit={state.habits.find(h => h.id === isBoostingHabit.habitId)!}
                onClose={() => dispatch({ type: 'CLOSE_BOOST_HABIT_MODAL' })}
                onSubmit={(file) => handleBoostSubmit(isBoostingHabit.habitId!, file)}
                t={t}
            />
        )}
        {isPrivacyPolicyOpen && (
            <PrivacyPolicyModal
                onClose={() => dispatch({ type: 'CLOSE_PRIVACY_POLICY' })}
                t={t}
            />
        )}
        {isTermsConditionsOpen && (
            <TermsConditionsModal
                onClose={() => dispatch({ type: 'CLOSE_TERMS_CONDITIONS' })}
                t={t}
            />
        )}
        {isAboutModalOpen && (
            <AboutModal
                onClose={() => dispatch({ type: 'CLOSE_ABOUT_MODAL' })}
                t={t}
            />
        )}
        {isMessaging.isOpen && isMessaging.recipient && currentUser && (() => {
          const conversationId = [currentUser.id, isMessaging.recipient!.id].sort().join('-');
          const conversation = conversations.find(c => c.id === conversationId);
          return (
            <MessagingModal
              recipient={isMessaging.recipient!}
              currentUser={currentUser}
              conversation={conversation}
              onClose={() => dispatch({ type: 'CLOSE_MESSAGING' })}
              onSendMessage={handleSendMessage}
              t={t}
            />
          );
        })()}
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onLoginClick={() => dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'login' })}
        onRegisterClick={() => dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'register' })}
        language={language}
        onLanguageChange={(lang) => dispatch({type: 'SET_LANGUAGE', payload: lang})}
        theme={theme}
        onThemeChange={(theme) => dispatch({ type: 'SET_THEME', payload: theme })}
        onOpenSettings={() => dispatch({type: 'OPEN_SETTINGS'})}
        t={t}
        />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          habits={habits} 
          selectedHabitId={selectedHabitId} 
          currentView={currentView}
          currentUser={loggedInUserProfile}
          onOpenSettings={() => dispatch({type: 'OPEN_SETTINGS'})}
          onOpenEditProfile={() => dispatch({ type: 'OPEN_EDIT_PROFILE_MODAL' })}
          t={t}
          language={language}
        />
        <main className="flex-1 bg-secondary dark:bg-neutral-950 flex flex-col pb-16 md:pb-0">
            {renderMainView()}
        </main>
      </div>
       <BottomNavbar
        currentUser={loggedInUserProfile}
        currentView={currentView}
        viewingProfileId={viewingProfileId}
        t={t}
      />
      <footer className="hidden md:block text-center py-3 border-t border-border-color dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <p className="text-xs text-text-secondary dark:text-neutral-500">{t('copyright')}</p>
      </footer>
    </div>
  );
}