
import React, { useReducer, useState, useEffect } from 'react';
import { AppState, Habit, User, Post, ReactionType, UserProfile, HabitStreak, StreakLog, Language, Comment, Event, Conversation, PrivateMessage, Notification, NotificationType, BoostRequest, UserPreferences } from './types';
import { getInitialData } from './data';
import { translations } from './translations';
import { supabase } from './supabaseClient';
import { FullPageSpinner } from './components/AuthShared';
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
import LandingPage from './components/LandingPage';
import JoinRequestModal from './components/JoinRequestModal';
import JoinRequestsAdminModal from './components/JoinRequestsAdminModal';
import { slugify } from './utils';


// --- MOCK DATA ---
const { habits: initialHabits, users: initialUsers, events: initialEvents, conversations: initialConversations } = getInitialData();


// --- REDUCER & STATE ---
type Action =
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
    | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
    | { type: 'SET_VIEW'; view: AppState['currentView'] };

const savedTheme = localStorage.getItem('habitcom-theme') || 'light';

const initialState: AppState = {
    habits: initialHabits,
    currentUser: null,
    loggedInUserProfile: null,
    users: initialUsers,
    conversations: initialConversations,
    selectedHabitId: null,
    currentView: 'explore',
    viewingProfileId: null,
    viewingHabitDetail: null,
    isAddingHabit: false,
    streakDayModal: { isOpen: false, streakId: null, date: null, log: null },
    isSettingsOpen: false,
    language: 'id',
    isEditingProfile: false,
    events: initialEvents,
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
    isLandingPage: true,
    isJoinRequestModalOpen: { isOpen: false, habitId: null },
    isJoinRequestsAdminModalOpen: { isOpen: false, habitId: null },
};

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'LOGIN':
            const userToLogin = action.payload;
            // View logic handled by Effect now, but we update state
            const usersList = state.users.find(u => u.id === userToLogin.id) 
                ? state.users.map(u => u.id === userToLogin.id ? userToLogin : u) 
                : [...state.users, userToLogin];
            return { ...state, currentUser: userToLogin, loggedInUserProfile: userToLogin, users: usersList, isAuthModalOpen: false, isLandingPage: false };
        case 'LOGOUT':
            return { ...initialState, isLandingPage: true, habits: state.habits, users: state.users, events: state.events, conversations: state.conversations };
        case 'REGISTER':
             const newUser = action.payload;
             return { ...state, currentUser: newUser, loggedInUserProfile: newUser, users: [...state.users, newUser], isAuthModalOpen: false, isLandingPage: false, currentView: 'explore' };
        case 'OPEN_AUTH_MODAL':
            return { ...state, isAuthModalOpen: true, authModalView: action.payload };
        case 'CLOSE_AUTH_MODAL':
            return { ...state, isAuthModalOpen: false };
        case 'ENTER_APP':
             return { ...state, isLandingPage: false };
        case 'SELECT_HABIT':
            return { ...state, selectedHabitId: action.payload, currentView: 'habit', viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_EXPLORE':
            return { ...state, currentView: 'explore', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_EVENTS':
            return { ...state, currentView: 'events', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_MESSAGING_LIST':
            return { ...state, currentView: 'messagingList', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_ADMIN_VIEW':
            return { ...state, currentView: 'admin', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_GROUP_HABITS':
            return { ...state, currentView: 'groupHabits', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_PRIVATE_HABITS':
            return { ...state, currentView: 'privateHabits', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'VIEW_PROFILE':
            return { ...state, viewingProfileId: action.payload, currentView: 'profile', viewingHabitDetail: null, viewingEventDetail: null };
        case 'SELECT_CREATE_HABIT':
            return { ...state, currentView: 'createHabit', selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        case 'CREATE_HABIT':
            const newHabitId = `habit_${Date.now()}`;
            const newHabit: Habit = {
                ...action.payload,
                id: newHabitId,
                members: state.currentUser ? [state.currentUser] : [],
                pendingMembers: [],
                posts: [],
                memberLimit: 20, // Default limit
                creatorId: state.currentUser ? state.currentUser.id : 'unknown',
            };
            const updatedUsersWithStreak = state.users.map(u => {
                if (u.id === state.currentUser?.id) {
                    return {
                        ...u,
                        streaks: [...u.streaks, { id: `streak_${Date.now()}`, habitId: newHabitId, name: newHabit.name, topic: newHabit.topic, logs: [] }]
                    }
                }
                return u;
            });
            return {
                ...state,
                habits: [...state.habits, newHabit],
                users: updatedUsersWithStreak,
                currentUser: updatedUsersWithStreak.find(u => u.id === state.currentUser?.id) || null,
                currentView: 'habit',
                selectedHabitId: newHabitId
            };
        case 'ADD_POST':
            const updatedHabitsPost = state.habits.map(habit => {
                if (habit.id === action.payload.habitId) {
                    return { ...habit, posts: [action.payload.post, ...habit.posts] };
                }
                return habit;
            });
             // Notify other members
            const notifSenderPost = state.currentUser!;
            const habitPost = state.habits.find(h => h.id === action.payload.habitId);
            const updatedUsersPost = state.users.map(u => {
                if (habitPost && habitPost.members.some(m => m.id === u.id) && u.id !== notifSenderPost.id) {
                    const newNotification: Notification = {
                        id: `notif_${Date.now()}_${Math.random()}`,
                        type: NotificationType.NEW_POST,
                        sender: notifSenderPost,
                        habit: { id: habitPost.id, name: habitPost.name },
                        postContent: action.payload.post.content.substring(0, 30) + (action.payload.post.content.length > 30 ? '...' : ''),
                        isRead: false,
                        timestamp: new Date()
                    };
                    return { ...u, notifications: [newNotification, ...u.notifications] };
                }
                return u;
            });

            return { ...state, habits: updatedHabitsPost, users: updatedUsersPost, currentUser: updatedUsersPost.find(u => u.id === state.currentUser?.id) || null };
        case 'ADD_REACTION':
            const updatedHabitsReaction = state.habits.map(habit => {
                if (habit.id === action.payload.habitId) {
                    const updatedPosts = habit.posts.map(post => {
                        if (post.id === action.payload.postId) {
                            // Simple toggle or add logic could go here. For now, just adding.
                            // Ideally check if user already reacted.
                            const existingReaction = post.reactions.find(r => r.userId === state.currentUser?.id && r.type === action.payload.reactionType);
                            if (existingReaction) return post; // Already reacted
                            return { ...post, reactions: [...post.reactions, { userId: state.currentUser!.id, type: action.payload.reactionType }] };
                        }
                        return post;
                    });
                    return { ...habit, posts: updatedPosts };
                }
                return habit;
            });
             // Notify post author
            const habitReact = state.habits.find(h => h.id === action.payload.habitId);
            const postReact = habitReact?.posts.find(p => p.id === action.payload.postId);
            const notifSenderReact = state.currentUser!;
            
            let updatedUsersReact = state.users;

            if (habitReact && postReact && postReact.author.id !== notifSenderReact.id) {
                 updatedUsersReact = state.users.map(u => {
                    if (u.id === postReact.author.id) {
                         const newNotification: Notification = {
                            id: `notif_${Date.now()}_${Math.random()}`,
                            type: NotificationType.NEW_REACTION,
                            sender: notifSenderReact,
                            habit: { id: habitReact.id, name: habitReact.name },
                            reactionType: action.payload.reactionType,
                            isRead: false,
                            timestamp: new Date()
                        };
                        return { ...u, notifications: [newNotification, ...u.notifications] };
                    }
                    return u;
                });
            }

            return { ...state, habits: updatedHabitsReaction, users: updatedUsersReact, currentUser: updatedUsersReact.find(u => u.id === state.currentUser?.id) || null };
        case 'ADD_COMMENT':
            const updatedHabitsComment = state.habits.map(habit => {
                if (habit.id === action.payload.habitId) {
                    const updatedPosts = habit.posts.map(post => {
                        if (post.id === action.payload.postId) {
                            return { ...post, comments: [...post.comments, action.payload.comment] };
                        }
                        return post;
                    });
                    return { ...habit, posts: updatedPosts };
                }
                return habit;
            });
            return { ...state, habits: updatedHabitsComment };
        case 'JOIN_HABIT':
            const habitToJoin = state.habits.find(h => h.id === action.payload);
            if (!habitToJoin || !state.currentUser) return state;

            const updatedHabitsJoin = state.habits.map(habit => {
                if (habit.id === action.payload) {
                    return { ...habit, members: [...habit.members, state.currentUser!] };
                }
                return habit;
            });

            // Notify all existing members of the habit
            const updatedUsersJoin = state.users.map(u => {
                 // If user is a member of the habit (and not the one joining)
                 if (habitToJoin.members.some(m => m.id === u.id) && u.id !== state.currentUser!.id) {
                     const newNotification: Notification = {
                        id: `notif_${Date.now()}_${Math.random()}`,
                        type: NotificationType.NEW_MEMBER,
                        sender: state.currentUser!,
                        habit: { id: habitToJoin.id, name: habitToJoin.name },
                        isRead: false,
                        timestamp: new Date()
                    };
                    return { ...u, notifications: [newNotification, ...u.notifications] };
                 }
                 // Add streak to the joining user
                 if (u.id === state.currentUser!.id) {
                     return {
                        ...u,
                        streaks: [...u.streaks, { id: `streak_${Date.now()}`, habitId: habitToJoin.id, name: habitToJoin.name, topic: habitToJoin.topic, logs: [] }]
                    }
                 }
                 return u;
            });

            return {
                ...state,
                habits: updatedHabitsJoin,
                users: updatedUsersJoin,
                currentUser: updatedUsersJoin.find(u => u.id === state.currentUser?.id) || null,
                selectedHabitId: action.payload,
                currentView: 'habit',
                viewingHabitDetail: null
            };
        case 'REQUEST_JOIN_HABIT':
             const habitToRequest = state.habits.find(h => h.id === action.payload);
             if (!habitToRequest || !state.currentUser) return state;

             const updatedHabitsRequest = state.habits.map(habit => {
                if (habit.id === action.payload) {
                    return { ...habit, pendingMembers: [...(habit.pendingMembers || []), state.currentUser!.id] };
                }
                return habit;
            });
            
            // Notify Creator
            const updatedUsersRequest = state.users.map(u => {
                if (u.id === habitToRequest.creatorId) {
                     const newNotification: Notification = {
                        id: `notif_${Date.now()}_${Math.random()}`,
                        type: NotificationType.JOIN_REQUEST,
                        sender: state.currentUser!,
                        habit: { id: habitToRequest.id, name: habitToRequest.name },
                        isRead: false,
                        timestamp: new Date()
                    };
                    return { ...u, notifications: [newNotification, ...u.notifications] };
                }
                return u;
            });

            return {
                ...state,
                habits: updatedHabitsRequest,
                users: updatedUsersRequest,
                currentUser: updatedUsersRequest.find(u => u.id === state.currentUser?.id) || null,
            };
        case 'APPROVE_JOIN_REQUEST':
             const { habitId: approveHabitId, userId: approveUserId } = action.payload;
             const userToApprove = state.users.find(u => u.id === approveUserId);
             const habitToApprove = state.habits.find(h => h.id === approveHabitId);
             if (!userToApprove || !habitToApprove) return state;

             const updatedHabitsApprove = state.habits.map(habit => {
                 if (habit.id === approveHabitId) {
                     return {
                         ...habit,
                         pendingMembers: habit.pendingMembers.filter(id => id !== approveUserId),
                         members: [...habit.members, userToApprove]
                     };
                 }
                 return habit;
             });

             // Notify user that they were approved AND Notify all existing members of new member
             const updatedUsersApprove = state.users.map(u => {
                 // Notify the approved user
                 if (u.id === approveUserId) {
                     const approvedNotification: Notification = {
                         id: `notif_${Date.now()}_${Math.random()}`,
                         type: NotificationType.JOIN_APPROVED,
                         sender: state.currentUser!, // Admin/Creator approved it
                         habit: { id: habitToApprove.id, name: habitToApprove.name },
                         isRead: false,
                         timestamp: new Date()
                     };
                     return {
                         ...u,
                         streaks: [...u.streaks, { id: `streak_${Date.now()}`, habitId: habitToApprove.id, name: habitToApprove.name, topic: habitToApprove.topic, logs: [] }],
                         notifications: [approvedNotification, ...u.notifications]
                     };
                 }
                 // Notify existing members
                 if (habitToApprove.members.some(m => m.id === u.id)) {
                     const newMemberNotification: Notification = {
                         id: `notif_${Date.now()}_${Math.random()}`,
                         type: NotificationType.NEW_MEMBER,
                         sender: userToApprove,
                         habit: { id: habitToApprove.id, name: habitToApprove.name },
                         isRead: false,
                         timestamp: new Date()
                     };
                     return { ...u, notifications: [newMemberNotification, ...u.notifications] };
                 }
                 return u;
             });

             return {
                 ...state,
                 habits: updatedHabitsApprove,
                 users: updatedUsersApprove,
                 currentUser: updatedUsersApprove.find(u => u.id === state.currentUser?.id) || null,
             };
        case 'REJECT_JOIN_REQUEST':
             const { habitId: rejectHabitId, userId: rejectUserId } = action.payload;
             const updatedHabitsReject = state.habits.map(habit => {
                 if (habit.id === rejectHabitId) {
                     return {
                         ...habit,
                         pendingMembers: habit.pendingMembers.filter(id => id !== rejectUserId)
                     };
                 }
                 return habit;
             });
             return { ...state, habits: updatedHabitsReject };
        case 'OPEN_JOIN_REQUEST_MODAL':
            return { ...state, isJoinRequestModalOpen: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_JOIN_REQUEST_MODAL':
            return { ...state, isJoinRequestModalOpen: { isOpen: false, habitId: null } };
        case 'OPEN_JOIN_REQUESTS_ADMIN_MODAL':
            return { ...state, isJoinRequestsAdminModalOpen: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_JOIN_REQUESTS_ADMIN_MODAL':
            return { ...state, isJoinRequestsAdminModalOpen: { isOpen: false, habitId: null } };
        case 'VIEW_HABIT_DETAIL':
            return { ...state, viewingHabitDetail: action.payload };
        case 'CLOSE_HABIT_DETAIL':
            return { ...state, viewingHabitDetail: null };
        case 'OPEN_ADD_HABIT_MODAL':
            return { ...state, isAddingHabit: true };
        case 'CLOSE_ADD_HABIT_MODAL':
            return { ...state, isAddingHabit: false };
        case 'ADD_HABIT_STREAK':
            if (!state.currentUser) return state;
            const newStreak: HabitStreak = {
                id: `streak_${Date.now()}`,
                habitId: `private_${Date.now()}`, // Pseudo ID for private note habits
                name: action.payload.name,
                topic: action.payload.topic,
                logs: []
            };
            // Create a private habit object as well so it appears in lists
            const newPrivateHabit: Habit = {
                id: newStreak.habitId,
                name: action.payload.name,
                topic: action.payload.topic,
                description: 'Private Habit Tracker',
                creatorId: state.currentUser.id,
                members: [state.currentUser],
                pendingMembers: [],
                posts: [],
                rules: '',
                memberLimit: 1,
                type: 'private',
                isLocked: true
            };
            
            const updatedUsersStreak = state.users.map(u => {
                if (u.id === state.currentUser!.id) {
                    return { ...u, streaks: [...u.streaks, newStreak] };
                }
                return u;
            });
            return { 
                ...state, 
                users: updatedUsersStreak, 
                currentUser: updatedUsersStreak.find(u => u.id === state.currentUser?.id) || null,
                habits: [...state.habits, newPrivateHabit],
                isAddingHabit: false 
            };
        case 'OPEN_STREAK_DAY_MODAL':
            return { ...state, streakDayModal: { isOpen: true, ...action.payload } };
        case 'CLOSE_STREAK_DAY_MODAL':
            return { ...state, streakDayModal: { isOpen: false, streakId: null, date: null, log: null } };
        case 'ADD_STREAK_LOG':
            if (!state.currentUser) return state;
            const updatedUsersLog = state.users.map(u => {
                if (u.id === state.currentUser!.id) {
                    const updatedStreaks = u.streaks.map(s => {
                        if (s.id === action.payload.streakId) {
                             // Check if log for this date already exists, update it if so
                            const existingLogIndex = s.logs.findIndex(l => new Date(l.date).toDateString() === new Date(action.payload.log.date).toDateString());
                            if (existingLogIndex >= 0) {
                                const newLogs = [...s.logs];
                                newLogs[existingLogIndex] = action.payload.log;
                                return { ...s, logs: newLogs };
                            }
                            return { ...s, logs: [...s.logs, action.payload.log] };
                        }
                        return s;
                    });
                    return { ...u, streaks: updatedStreaks };
                }
                return u;
            });
            return { ...state, users: updatedUsersLog, currentUser: updatedUsersLog.find(u => u.id === state.currentUser?.id) || null, streakDayModal: { isOpen: false, streakId: null, date: null, log: null } };
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
        case 'UPDATE_PROFILE':
             if (!state.currentUser) return state;
             const updatedUsersProfile = state.users.map(u => {
                 if (u.id === state.currentUser!.id) {
                     return { ...u, ...action.payload };
                 }
                 return u;
             });
             return { ...state, users: updatedUsersProfile, currentUser: updatedUsersProfile.find(u => u.id === state.currentUser?.id) || null, isEditingProfile: false };
        case 'OPEN_CREATE_EVENT_MODAL':
            return { ...state, isCreatingEvent: true };
        case 'CLOSE_CREATE_EVENT_MODAL':
            return { ...state, isCreatingEvent: false };
        case 'CREATE_EVENT':
            const newEvent: Event = {
                ...action.payload,
                id: `event_${Date.now()}`
            };
            return { ...state, events: [...state.events, newEvent], isCreatingEvent: false };
        case 'VIEW_EVENT_DETAIL':
            return { ...state, viewingEventDetail: action.payload };
        case 'CLOSE_EVENT_DETAIL':
            return { ...state, viewingEventDetail: null };
        case 'OPEN_BOOST_HABIT_MODAL':
            return { ...state, isBoostingHabit: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_BOOST_HABIT_MODAL':
            return { ...state, isBoostingHabit: { isOpen: false, habitId: null } };
        case 'BOOST_HABIT':
            return { ...state, boostedHabitId: action.payload };
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
            return { ...state, isMessaging: { isOpen: true, recipient: action.payload } };
        case 'CLOSE_MESSAGING':
            return { ...state, isMessaging: { isOpen: false, recipient: null } };
        case 'SEND_PRIVATE_MESSAGE':
             if (!state.currentUser) return state;
             const { recipientId, content } = action.payload;
             const senderId = state.currentUser.id;
             
             // Composite ID: smallerId-largerId
             const participantIds = [senderId, recipientId].sort();
             const conversationId = `${participantIds[0]}-${participantIds[1]}`;
             
             const newMessage: PrivateMessage = {
                 id: `msg_${Date.now()}`,
                 senderId: senderId,
                 content: content,
                 timestamp: new Date()
             };

             let updatedConversations = [...state.conversations];
             const existingConvIndex = updatedConversations.findIndex(c => c.id === conversationId);

             if (existingConvIndex >= 0) {
                 const updatedConv = {
                     ...updatedConversations[existingConvIndex],
                     messages: [...updatedConversations[existingConvIndex].messages, newMessage]
                 };
                 updatedConversations[existingConvIndex] = updatedConv;
             } else {
                 const newConv: Conversation = {
                     id: conversationId,
                     participantIds: participantIds,
                     messages: [newMessage]
                 };
                 updatedConversations.push(newConv);
             }

             // Notify Recipient
             const updatedUsersMsg = state.users.map(u => {
                if (u.id === recipientId) {
                     const newNotification: Notification = {
                        id: `notif_${Date.now()}_${Math.random()}`,
                        type: NotificationType.NEW_MESSAGE,
                        sender: state.currentUser!,
                        isRead: false,
                        timestamp: new Date()
                    };
                    return { ...u, notifications: [newNotification, ...u.notifications] };
                }
                return u;
            });

             return { ...state, conversations: updatedConversations, users: updatedUsersMsg, currentUser: updatedUsersMsg.find(u => u.id === state.currentUser?.id) || null };
        case 'SUBMIT_BOOST_REQUEST':
             const newRequest: BoostRequest = {
                 id: `req_${Date.now()}`,
                 habitId: action.payload.habitId,
                 userId: state.currentUser!.id,
                 proofImage: action.payload.proofImage,
                 status: 'pending',
                 timestamp: new Date()
             };
             return { ...state, boostRequests: [...state.boostRequests, newRequest], isBoostingHabit: { isOpen: false, habitId: null } };
        case 'APPROVE_BOOST_REQUEST':
            const reqToApprove = state.boostRequests.find(r => r.id === action.payload);
            if (reqToApprove) {
                 const updatedRequests = state.boostRequests.map(r => r.id === action.payload ? { ...r, status: 'approved' } as BoostRequest : r);
                 return { ...state, boostRequests: updatedRequests, boostedHabitId: reqToApprove.habitId };
            }
            return state;
        case 'REJECT_BOOST_REQUEST':
             const updatedRequestsReject = state.boostRequests.map(r => r.id === action.payload ? { ...r, status: 'rejected' } as BoostRequest : r);
             return { ...state, boostRequests: updatedRequestsReject };
        case 'OPEN_MANAGE_MEMBERS_MODAL':
            return { ...state, isManageMembersModalOpen: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_MANAGE_MEMBERS_MODAL':
            return { ...state, isManageMembersModalOpen: { isOpen: false, habitId: null } };
        case 'KICK_MEMBER':
            const { habitId, userId } = action.payload;
            const updatedHabitsKick = state.habits.map(h => {
                if (h.id === habitId) {
                    return { ...h, members: h.members.filter(m => m.id !== userId) };
                }
                return h;
            });
            // Remove streak from user
            const updatedUsersKick = state.users.map(u => {
                if (u.id === userId) {
                    return { ...u, streaks: u.streaks.filter(s => s.habitId !== habitId) };
                }
                return u;
            });
            return {
                ...state,
                habits: updatedHabitsKick,
                users: updatedUsersKick,
                // If current user was kicked from the viewing habit, maybe redirect? 
                // For now, simplistic update:
                currentUser: updatedUsersKick.find(u => u.id === state.currentUser?.id) || null
            };
        case 'MARK_NOTIFICATIONS_READ':
             if (!state.currentUser) return state;
             // Mark all notifications as read for current user
             const updatedUserNotifs = state.currentUser.notifications.map(n => ({ ...n, isRead: true }));
             const updatedUserWithReadNotifs = { ...state.currentUser, notifications: updatedUserNotifs };
             
             const updatedUsersWithRead = state.users.map(u => {
                 if (u.id === state.currentUser!.id) {
                     return updatedUserWithReadNotifs;
                 }
                 return u;
             });
             
             return { ...state, users: updatedUsersWithRead, currentUser: updatedUserWithReadNotifs };
        case 'UPDATE_PREFERENCES':
             if (!state.currentUser) return state;
             const updatedPreferences = { ...state.currentUser.preferences, ...action.payload };
             const updatedUserWithPrefs = { ...state.currentUser, preferences: updatedPreferences };
             
             const updatedUsersWithPrefs = state.users.map(u => {
                 if (u.id === state.currentUser!.id) {
                     return updatedUserWithPrefs;
                 }
                 return u;
             });
             return { ...state, users: updatedUsersWithPrefs, currentUser: updatedUserWithPrefs };
        case 'SET_VIEW':
            return { ...state, currentView: action.view, selectedHabitId: null, viewingProfileId: null, viewingHabitDetail: null, viewingEventDetail: null };
        default:
            return state;
    }
}


const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- URL ROUTING LOGIC ---

    // 1. Sync Hash -> State (Listener)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            
            if (!state.currentUser && !['/login', '/register'].includes(hash) && hash !== '') {
                // If not logged in, we might want to allow exploring or redirect to landing
                // For now, let's assume basic routes work, but detailed ones depend on auth state
            }

            if (hash === '' || hash === '/') {
                // Landing page or explore depending on auth
                if (state.currentUser) dispatch({ type: 'SELECT_EXPLORE' });
            } else if (hash === '/explore') {
                dispatch({ type: 'SELECT_EXPLORE' });
            } else if (hash === '/events') {
                dispatch({ type: 'SELECT_EVENTS' });
            } else if (hash === '/messages') {
                dispatch({ type: 'SELECT_MESSAGING_LIST' });
            } else if (hash === '/admin') {
                dispatch({ type: 'SELECT_ADMIN_VIEW' });
            } else if (hash === '/habits/group') {
                dispatch({ type: 'SELECT_GROUP_HABITS' });
            } else if (hash === '/habits/private') {
                dispatch({ type: 'SELECT_PRIVATE_HABITS' });
            } else if (hash === '/create-habit') {
                dispatch({ type: 'SELECT_CREATE_HABIT' });
            } else if (hash.startsWith('/habit/')) {
                // Format: /habit/slug-id  (Extract ID from end)
                const parts = hash.split('-');
                const habitId = parts.length > 1 ? parts.pop() : null; // Get last part
                // If strict format isn't followed, fallback to assuming the whole slug is ID or finding by slug
                // But standardizing on slug-ID is safer for this implementation.
                // Let's try to find by ID directly first (if URL was just #/habit/habit_1)
                
                const rawIdFromUrl = hash.replace('/habit/', '');
                // Check if it looks like "slug-id" or just "id"
                // Our IDs are "habit_..."
                let targetId = rawIdFromUrl;
                if (rawIdFromUrl.includes('-habit_')) {
                     targetId = 'habit_' + rawIdFromUrl.split('-habit_')[1];
                }

                if (targetId) {
                    dispatch({ type: 'SELECT_HABIT', payload: targetId });
                }
            } else if (hash.startsWith('/profile/')) {
                const userId = hash.replace('/profile/', '');
                dispatch({ type: 'VIEW_PROFILE', payload: userId });
            } else if (hash === '/login') {
                dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'login' });
            } else if (hash === '/register') {
                dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'register' });
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        // Run on mount to handle initial URL
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [state.currentUser]); // Re-run if auth changes to potentially redirect

    // 2. Sync State -> Hash (Broadcaster)
    useEffect(() => {
        if (state.isLandingPage && !state.currentUser) {
            // Do not overwrite hash if on landing page unless specific modal is open
            if (state.isAuthModalOpen && state.authModalView === 'login') {
                 if (window.location.hash !== '#/login') window.location.hash = '/login';
            } else if (state.isAuthModalOpen && state.authModalView === 'register') {
                 if (window.location.hash !== '#/register') window.location.hash = '/register';
            } else {
                 // Clear hash on landing page base
                 if (window.location.hash !== '' && window.location.hash !== '#/') {
                     history.replaceState(null, '', ' ');
                 }
            }
            return;
        }

        let newHash = '';
        if (state.currentView === 'explore') newHash = '/explore';
        else if (state.currentView === 'events') newHash = '/events';
        else if (state.currentView === 'messagingList') newHash = '/messages';
        else if (state.currentView === 'admin') newHash = '/admin';
        else if (state.currentView === 'groupHabits') newHash = '/habits/group';
        else if (state.currentView === 'privateHabits') newHash = '/habits/private';
        else if (state.currentView === 'createHabit') newHash = '/create-habit';
        else if (state.currentView === 'habit' && state.selectedHabitId) {
            const habit = state.habits.find(h => h.id === state.selectedHabitId);
            if (habit) {
                newHash = `/habit/${slugify(habit.name)}-${habit.id}`;
            }
        }
        else if (state.currentView === 'profile' && state.viewingProfileId) {
            newHash = `/profile/${state.viewingProfileId}`;
        }

        if (newHash && window.location.hash.replace('#', '') !== newHash) {
            window.location.hash = newHash;
        }
    }, [state.currentView, state.selectedHabitId, state.viewingProfileId, state.isLandingPage, state.isAuthModalOpen, state.authModalView]);


    // --- Supabase Auth & Sync ---
    
    // Fetch user profile from Supabase and map to app state
    const fetchAndSetUser = async (user: any) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            let userProfileData = profile;

            if (error || !profile) {
                // Fallback: Create temporary profile object from auth metadata if DB record is missing/slow
                userProfileData = {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                    avatar: user.user_metadata?.avatar || 'https://i.pravatar.cc/150',
                    motto: "Ready to start!",
                    member_since: new Date().toISOString(),
                    total_days_active: 0,
                    level: "Newbie",
                    cheers_given: 0,
                    pushes_given: 0,
                    check_in_percentage: 0,
                    preferences: { showStats: true, showBadges: true, showDailyTips: false, showTools: true },
                    is_admin: false
                };
            }

            const userProfile: UserProfile = {
                id: userProfileData.id,
                name: userProfileData.name,
                avatar: userProfileData.avatar,
                email: userProfileData.email,
                motto: userProfileData.motto,
                memberSince: new Date(userProfileData.member_since),
                totalDaysActive: userProfileData.total_days_active,
                level: userProfileData.level,
                cheersGiven: userProfileData.cheers_given,
                pushesGiven: userProfileData.pushes_given,
                checkInPercentage: userProfileData.check_in_percentage,
                preferences: userProfileData.preferences,
                streaks: [], // TODO: Fetch streaks from DB
                badges: [],
                notifications: [],
                isAdmin: userProfileData.is_admin
            };
            
            dispatch({ type: 'LOGIN', payload: userProfile });
        } catch (err) {
            console.error("Unexpected error in fetchAndSetUser:", err);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    await fetchAndSetUser(session.user);
                } else {
                    // No session, stop loading (landing page will show)
                }
            } catch (err) {
                console.error("Auth init error:", err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                dispatch({ type: 'LOGOUT' });
                if (mounted) setIsLoading(false);
            } else if (session?.user && event !== 'INITIAL_SESSION') {
                // Handle sign in or token refresh
                await fetchAndSetUser(session.user);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // --- Handlers ---

    const t = (key: string) => {
        return translations[state.language][key as keyof typeof translations['en']] || key;
    };
    
    useEffect(() => {
        if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('habitcom-theme', state.theme);
    }, [state.theme]);


    const handleLogin = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        if (error) {
            alert(error.message);
        }
        // setIsLoading(false) handled by onAuthStateChange or should be reset if error
    };
    
    const handleRegister = async (name: string, email: string, pass: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    name: name,
                    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
                }
            }
        });
        
        if (error) {
            alert(error.message);
        } else {
            alert("Registration successful! Please check your email for verification.");
            dispatch({ type: 'CLOSE_AUTH_MODAL' });
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // Force state update to ensure UI doesn't freeze
            dispatch({ type: 'LOGOUT' });
            setIsLoading(false);
        }
    };
    
    const handleForgotPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.href,
        });
        if (error) throw error;
    };

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!postContent.trim() && !postImage) || !state.selectedHabitId || !state.currentUser) return;

        const newPost: Post = {
            id: `post_${Date.now()}`,
            author: state.currentUser,
            content: postContent,
            habitId: state.selectedHabitId,
            imageUrl: postImage || undefined,
            streak: state.currentUser.streaks.find(s => s.habitId === state.selectedHabitId)?.logs.length || 0,
            reactions: [],
            comments: [],
            timestamp: new Date(),
        };

        dispatch({ type: 'ADD_POST', payload: { habitId: state.selectedHabitId, post: newPost } });
        setPostContent('');
        setPostImage(null);
    };

    const handleImageSelect = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPostImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleReaction = (postId: string, reactionType: ReactionType) => {
        if (state.selectedHabitId) {
            dispatch({ type: 'ADD_REACTION', payload: { habitId: state.selectedHabitId, postId, reactionType } });
        }
    };

    const handleCommentSubmit = (habitId: string, postId: string, content: string) => {
        if (!state.currentUser) return;
        const newComment: Comment = {
            id: `comment_${Date.now()}`,
            author: state.currentUser,
            content,
            timestamp: new Date(),
        };
        dispatch({ type: 'ADD_COMMENT', payload: { habitId, postId, comment: newComment } });
    };
    
    const handleJoinHabit = (habitId: string) => {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return;

        if (habit.isLocked) {
            dispatch({ type: 'OPEN_JOIN_REQUEST_MODAL', payload: habitId });
        } else {
            dispatch({ type: 'JOIN_HABIT', payload: habitId });
        }
    };

    const handleConfirmJoinRequest = () => {
        if (state.isJoinRequestModalOpen.habitId) {
            dispatch({ type: 'REQUEST_JOIN_HABIT', payload: state.isJoinRequestModalOpen.habitId });
            dispatch({ type: 'CLOSE_JOIN_REQUEST_MODAL' });
            alert('Permintaan bergabung terkirim!');
        }
    }
    
    const handleApproveJoinRequest = (userId: string) => {
        if (state.isJoinRequestsAdminModalOpen.habitId) {
            dispatch({ type: 'APPROVE_JOIN_REQUEST', payload: { habitId: state.isJoinRequestsAdminModalOpen.habitId, userId } });
        }
    }

    const handleRejectJoinRequest = (userId: string) => {
        if (state.isJoinRequestsAdminModalOpen.habitId) {
            dispatch({ type: 'REJECT_JOIN_REQUEST', payload: { habitId: state.isJoinRequestsAdminModalOpen.habitId, userId } });
        }
    }

    // Updated signature to accept coverImageFile
    const handleCreateHabit = (habitData: Omit<Habit, 'id' | 'members' | 'posts' | 'memberLimit' | 'highlightIcon' | 'creatorId' | 'coverImage' | 'pendingMembers'>, coverImageFile: File | null) => {
        // Mock image upload by creating a local URL
        let coverImageUrl: string | undefined = undefined;
        if (coverImageFile) {
            coverImageUrl = URL.createObjectURL(coverImageFile);
        }

        const newHabit: Habit = {
            ...habitData,
            id: '', // Handled by reducer
            members: [], // Handled by reducer
            posts: [],
            memberLimit: 20,
            highlightIcon: undefined,
            creatorId: '', // Handled by reducer
            coverImage: coverImageUrl,
            pendingMembers: [] // Handled by reducer
        };
        dispatch({ type: 'CREATE_HABIT', payload: newHabit });
    };

    const handleSaveLog = (note: string) => {
        if (state.streakDayModal.streakId && state.streakDayModal.date) {
            const newLog: StreakLog = {
                date: state.streakDayModal.date,
                note: note
            };
            dispatch({ type: 'ADD_STREAK_LOG', payload: { streakId: state.streakDayModal.streakId, log: newLog } });
        }
    };

    const handleUpdateProfile = (name: string, avatarFile: File | null, motto: string) => {
         // In a real app, upload file to server
         const avatarUrl = avatarFile ? URL.createObjectURL(avatarFile) : state.currentUser!.avatar;
         dispatch({ type: 'UPDATE_PROFILE', payload: { name, avatar: avatarUrl, motto } });
    };

    const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
        dispatch({ type: 'CREATE_EVENT', payload: eventData });
    };
    
    const handleBoostHabitSubmit = (proofImage: string) => {
        if (state.isBoostingHabit.habitId) {
            dispatch({ type: 'SUBMIT_BOOST_REQUEST', payload: { habitId: state.isBoostingHabit.habitId, proofImage } });
        }
    };

    if (isLoading) {
        return <FullPageSpinner />;
    }

    if (state.isLandingPage && !state.currentUser) {
        return (
            <>
                <LandingPage 
                    onLoginClick={() => window.location.hash = '/login'}
                    onRegisterClick={() => window.location.hash = '/register'}
                    language={state.language}
                    onLanguageChange={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
                    t={t}
                />
                 {state.isAuthModalOpen && (
                    <AuthModal
                        initialView={state.authModalView}
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                        onForgotPassword={handleForgotPassword}
                        onClose={() => {
                            dispatch({ type: 'CLOSE_AUTH_MODAL' });
                            window.history.replaceState(null, '', ' '); // Clear hash
                        }}
                        t={t}
                    />
                )}
            </>
        );
    }

    const selectedHabit = state.selectedHabitId ? state.habits.find(h => h.id === state.selectedHabitId) : undefined;
    const profileToView = state.viewingProfileId ? state.users.find(u => u.id === state.viewingProfileId) : null;

    // Pending requests for admin modal
    const pendingUsersForAdmin = state.isJoinRequestsAdminModalOpen.habitId 
        ? state.users.filter(u => state.habits.find(h => h.id === state.isJoinRequestsAdminModalOpen.habitId)?.pendingMembers?.includes(u.id))
        : [];
    const habitForAdmin = state.isJoinRequestsAdminModalOpen.habitId 
        ? state.habits.find(h => h.id === state.isJoinRequestsAdminModalOpen.habitId)
        : null;
    
    // Join request modal habit
    const habitForJoinRequest = state.isJoinRequestModalOpen.habitId 
        ? state.habits.find(h => h.id === state.isJoinRequestModalOpen.habitId)
        : null;

    if (!state.currentUser) return null; // Should not happen due to landing page check

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-neutral-900 flex justify-center transition-colors duration-200 md:py-4">
            <div className={`flex flex-col h-full w-full max-w-[1100px] bg-white dark:bg-black font-sans text-text-primary dark:text-neutral-200 overflow-hidden relative shadow-xl md:rounded-2xl`}>
                <Header 
                    currentUser={state.currentUser} 
                    onLogout={handleLogout} 
                    onLoginClick={() => window.location.hash = '/login'}
                    onRegisterClick={() => window.location.hash = '/register'}
                    language={state.language}
                    onLanguageChange={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
                    theme={state.theme}
                    onThemeChange={(theme) => dispatch({ type: 'SET_THEME', payload: theme })}
                    onOpenSettings={() => dispatch({ type: 'OPEN_SETTINGS' })}
                    onSelectCreateHabit={() => dispatch({ type: 'SELECT_CREATE_HABIT' })}
                    onSelectAdminView={() => dispatch({ type: 'SELECT_ADMIN_VIEW' })}
                    onMarkRead={() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' })}
                    t={t}
                />
                <div className="flex flex-1 overflow-hidden relative">
                    <Sidebar 
                        habits={state.habits} 
                        selectedHabitId={state.selectedHabitId} 
                        onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })} 
                        onSelectCreateHabit={() => dispatch({ type: 'SELECT_CREATE_HABIT' })}
                        currentView={state.currentView}
                        currentUser={state.currentUser}
                        onSelectExplore={() => dispatch({ type: 'SELECT_EXPLORE' })}
                        onViewHabitDetail={(habit) => dispatch({ type: 'VIEW_HABIT_DETAIL', payload: habit })}
                        onViewProfile={(userId) => dispatch({ type: 'VIEW_PROFILE', payload: userId })}
                        onOpenSettings={() => dispatch({ type: 'OPEN_SETTINGS' })}
                        onOpenEditProfile={() => dispatch({ type: 'OPEN_EDIT_PROFILE_MODAL' })}
                        onSelectEvents={() => dispatch({ type: 'SELECT_EVENTS' })}
                        onSelectMessagingList={() => dispatch({ type: 'SELECT_MESSAGING_LIST' })}
                        onSelectAdminView={() => dispatch({ type: 'SELECT_ADMIN_VIEW' })}
                        onMarkRead={() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' })}
                        t={t}
                        language={state.language}
                    />
                    
                    <main className="flex-1 flex flex-col overflow-hidden relative bg-gray-50 dark:bg-neutral-950 shadow-inner border-t border-l border-border-color dark:border-neutral-800 pb-16 md:pb-0">
                         {state.currentView === 'habit' && (
                            <HabitView 
                                selectedHabit={selectedHabit}
                                currentUser={state.currentUser}
                                allUsers={state.users}
                                postContent={postContent}
                                setPostContent={setPostContent}
                                postImage={postImage}
                                setPostImage={setPostImage}
                                handleImageSelect={handleImageSelect}
                                handlePostSubmit={handlePostSubmit}
                                handleReaction={handleReaction}
                                handleCommentSubmit={handleCommentSubmit}
                                handleBoostHabit={(habitId) => dispatch({ type: 'OPEN_BOOST_HABIT_MODAL', payload: habitId })}
                                onOpenManageMembers={(habitId) => dispatch({ type: 'OPEN_MANAGE_MEMBERS_MODAL', payload: habitId })}
                                onViewProfile={(userId) => dispatch({ type: 'VIEW_PROFILE', payload: userId })}
                                onOpenJoinRequests={(habitId) => dispatch({ type: 'OPEN_JOIN_REQUESTS_ADMIN_MODAL', payload: habitId })}
                                t={t}
                                boostedHabitId={state.boostedHabitId}
                            />
                        )}
                        {state.currentView === 'explore' && (
                            <ExploreView 
                                allHabits={state.habits} 
                                currentUser={state.currentUser} 
                                onJoinHabit={handleJoinHabit}
                                onViewDetail={(habit) => dispatch({ type: 'VIEW_HABIT_DETAIL', payload: habit })}
                                t={t}
                                boostedHabitId={state.boostedHabitId}
                            />
                        )}
                         {state.currentView === 'groupHabits' && (
                            <UserHabitsListView 
                                allUserHabits={state.habits.filter(h => h.members.some(m => m.id === state.currentUser?.id))}
                                type="group"
                                onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })}
                                t={t}
                            />
                        )}
                        {state.currentView === 'privateHabits' && (
                            <UserHabitsListView 
                                allUserHabits={state.habits.filter(h => h.members.some(m => m.id === state.currentUser?.id))}
                                type="private"
                                onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })}
                                t={t}
                            />
                        )}
                        {state.currentView === 'profile' && profileToView && (
                            <ProfilePage 
                                profileToView={profileToView} 
                                currentUserProfile={state.currentUser}
                                allHabits={state.habits}
                                onAddHabit={() => dispatch({ type: 'OPEN_ADD_HABIT_MODAL' })}
                                onDayClick={(streakId, date) => {
                                    const streak = profileToView.streaks.find(s => s.id === streakId);
                                    const log = streak?.logs.find(l => new Date(l.date).toDateString() === date.toDateString()) || null;
                                    dispatch({ type: 'OPEN_STREAK_DAY_MODAL', payload: { streakId, date, log } });
                                }}
                                onOpenMessage={(user) => dispatch({ type: 'OPEN_MESSAGING', payload: user })}
                                onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })}
                                onViewProfile={(userId) => dispatch({ type: 'VIEW_PROFILE', payload: userId })}
                                onOpenEditProfile={() => dispatch({ type: 'OPEN_EDIT_PROFILE_MODAL' })}
                                t={t}
                                language={state.language}
                            />
                        )}
                        {state.currentView === 'createHabit' && (
                            <CreateHabitView 
                                onCancel={() => dispatch({ type: 'SELECT_EXPLORE' })} 
                                onCreate={handleCreateHabit}
                                t={t}
                            />
                        )}
                        {state.currentView === 'events' && (
                            <EventsView 
                                events={state.events}
                                t={t}
                                onCreateEvent={() => dispatch({ type: 'OPEN_CREATE_EVENT_MODAL' })}
                                onViewEvent={(event) => dispatch({ type: 'VIEW_EVENT_DETAIL', payload: event })}
                            />
                        )}
                        {state.currentView === 'messagingList' && (
                            <MessagingListView
                                conversations={state.conversations}
                                users={state.users}
                                currentUserProfile={state.currentUser}
                                onOpenConversation={(user) => dispatch({ type: 'OPEN_MESSAGING', payload: user })}
                                t={t}
                            />
                        )}
                         {state.currentView === 'admin' && state.currentUser.isAdmin && (
                            <AdminView 
                                requests={state.boostRequests}
                                habits={state.habits}
                                users={state.users}
                                onApprove={(reqId) => dispatch({ type: 'APPROVE_BOOST_REQUEST', payload: reqId })}
                                onReject={(reqId) => dispatch({ type: 'REJECT_BOOST_REQUEST', payload: reqId })}
                                t={t}
                            />
                        )}
                        {(state.currentView === 'comingSoon') && <ComingSoonView t={t} />}
                    </main>
                </div>
                
                <BottomNavbar
                    currentView={state.currentView}
                    currentUser={state.currentUser}
                    viewingProfileId={state.viewingProfileId}
                    onSelectExplore={() => dispatch({ type: 'SELECT_EXPLORE' })}
                    onSelectGroupHabits={() => dispatch({ type: 'SELECT_GROUP_HABITS' })}
                    onSelectPrivateHabits={() => dispatch({ type: 'SELECT_PRIVATE_HABITS' })}
                    onSelectMessagingList={() => dispatch({ type: 'SELECT_MESSAGING_LIST' })}
                    onSelectEvents={() => dispatch({ type: 'SELECT_EVENTS' })}
                    onSelectCreateHabit={() => dispatch({ type: 'SELECT_CREATE_HABIT' })}
                    onViewProfile={(userId) => dispatch({ type: 'VIEW_PROFILE', payload: userId })}
                    t={t}
                />

                {/* Modals */}
                {state.viewingHabitDetail && (
                    <HabitDetailModal 
                        habit={state.viewingHabitDetail} 
                        currentUser={state.currentUser}
                        onClose={() => dispatch({ type: 'CLOSE_HABIT_DETAIL' })} 
                        onJoin={handleJoinHabit}
                        isMember={state.currentUser ? state.viewingHabitDetail.members.some(m => m.id === state.currentUser!.id) : false}
                        onViewProfile={(userId) => dispatch({ type: 'VIEW_PROFILE', payload: userId })}
                        t={t}
                    />
                )}
                {state.isAddingHabit && (
                    <AddHabitModal 
                        onClose={() => dispatch({ type: 'CLOSE_ADD_HABIT_MODAL' })} 
                        onSave={(data) => dispatch({ type: 'ADD_HABIT_STREAK', payload: data })}
                        t={t}
                    />
                )}
                {state.streakDayModal.isOpen && state.streakDayModal.date && (
                    <StreakDayModal 
                        date={state.streakDayModal.date} 
                        log={state.streakDayModal.log}
                        onClose={() => dispatch({ type: 'CLOSE_STREAK_DAY_MODAL' })} 
                        onSave={handleSaveLog}
                        t={t}
                        language={state.language}
                    />
                )}
                {state.isSettingsOpen && (
                    <SettingsModal 
                        onClose={() => dispatch({ type: 'CLOSE_SETTINGS' })} 
                        onLogout={handleLogout}
                        currentLanguage={state.language}
                        onLanguageChange={(lang) => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
                        currentTheme={state.theme}
                        onThemeChange={(theme) => dispatch({ type: 'SET_THEME', payload: theme })}
                        onOpenPrivacyPolicy={() => dispatch({ type: 'OPEN_PRIVACY_POLICY' })}
                        onOpenTermsConditions={() => dispatch({ type: 'OPEN_TERMS_CONDITIONS' })}
                        onOpenAbout={() => dispatch({ type: 'OPEN_ABOUT_MODAL' })}
                        currentUser={state.currentUser}
                        onUpdatePreferences={(prefs) => dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs })}
                        t={t}
                    />
                )}
                {state.isEditingProfile && state.currentUser && (
                    <EditProfileModal 
                        currentUser={state.currentUser}
                        onClose={() => dispatch({ type: 'CLOSE_EDIT_PROFILE_MODAL' })} 
                        onSave={handleUpdateProfile}
                        t={t}
                    />
                )}
                {state.isCreatingEvent && (
                    <CreateEventModal
                        onClose={() => dispatch({ type: 'CLOSE_CREATE_EVENT_MODAL' })}
                        onSave={handleCreateEvent}
                        t={t}
                    />
                )}
                {state.viewingEventDetail && (
                    <EventDetailModal
                        event={state.viewingEventDetail}
                        onClose={() => dispatch({ type: 'CLOSE_EVENT_DETAIL' })}
                        t={t}
                        language={state.language}
                    />
                )}
                {state.isBoostingHabit.isOpen && state.isBoostingHabit.habitId && (
                    <BoostHabitModal
                        habit={state.habits.find(h => h.id === state.isBoostingHabit.habitId)!}
                        onClose={() => dispatch({ type: 'CLOSE_BOOST_HABIT_MODAL' })}
                        onSubmit={handleBoostHabitSubmit}
                        t={t}
                    />
                )}
                 {state.isPrivacyPolicyOpen && (
                    <PrivacyPolicyModal onClose={() => dispatch({ type: 'CLOSE_PRIVACY_POLICY' })} t={t} />
                )}
                {state.isTermsConditionsOpen && (
                    <TermsConditionsModal onClose={() => dispatch({ type: 'CLOSE_TERMS_CONDITIONS' })} t={t} />
                )}
                {state.isAboutModalOpen && (
                    <AboutModal onClose={() => dispatch({ type: 'CLOSE_ABOUT_MODAL' })} t={t} />
                )}
                {state.isMessaging.isOpen && state.isMessaging.recipient && state.currentUser && (
                    <MessagingModal
                        recipient={state.isMessaging.recipient}
                        currentUser={state.currentUser}
                        conversation={state.conversations.find(c => {
                            const ids = c.participantIds;
                            return ids.includes(state.currentUser!.id) && ids.includes(state.isMessaging.recipient!.id);
                        })}
                        onClose={() => dispatch({ type: 'CLOSE_MESSAGING' })}
                        onSendMessage={(content) => dispatch({ type: 'SEND_PRIVATE_MESSAGE', payload: { recipientId: state.isMessaging.recipient!.id, content } })}
                        t={t}
                    />
                )}
                {state.isAuthModalOpen && (
                    <AuthModal
                        initialView={state.authModalView}
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                        onForgotPassword={handleForgotPassword}
                        onClose={() => {
                            dispatch({ type: 'CLOSE_AUTH_MODAL' });
                            window.history.replaceState(null, '', ' ');
                        }}
                        t={t}
                    />
                )}
                {state.isManageMembersModalOpen.isOpen && state.isManageMembersModalOpen.habitId && state.currentUser && (
                    <ManageMembersModal
                        habit={state.habits.find(h => h.id === state.isManageMembersModalOpen.habitId)!}
                        currentUser={state.currentUser}
                        onClose={() => dispatch({ type: 'CLOSE_MANAGE_MEMBERS_MODAL' })}
                        onKickMember={(userId) => dispatch({ type: 'KICK_MEMBER', payload: { habitId: state.isManageMembersModalOpen.habitId!, userId } })}
                        t={t}
                    />
                )}
                {state.isJoinRequestModalOpen.isOpen && habitForJoinRequest && (
                    <JoinRequestModal
                        habit={habitForJoinRequest}
                        onClose={() => dispatch({ type: 'CLOSE_JOIN_REQUEST_MODAL' })}
                        onConfirm={handleConfirmJoinRequest}
                        t={t}
                    />
                )}
                {state.isJoinRequestsAdminModalOpen.isOpen && habitForAdmin && (
                    <JoinRequestsAdminModal
                        habit={habitForAdmin}
                        pendingUsers={pendingUsersForAdmin}
                        onClose={() => dispatch({ type: 'CLOSE_JOIN_REQUESTS_ADMIN_MODAL' })}
                        onApprove={handleApproveJoinRequest}
                        onReject={handleRejectJoinRequest}
                        t={t}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
