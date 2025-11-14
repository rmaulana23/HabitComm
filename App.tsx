import React, { useReducer, useState, useEffect } from 'react';
import { AppState, Habit, User, Post, ReactionType, UserProfile, HabitStreak, StreakLog, Language, Comment, Event, Conversation, PrivateMessage, Notification, NotificationType, BoostRequest } from './types';
import { getInitialData } from './data';
import { translations } from './translations';
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
    | { type: 'KICK_MEMBER'; payload: { habitId: string; userId: string } };

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
};

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'LOGIN':
            const userToLogin = action.payload;
            const viewAfterLogin = userToLogin.isAdmin ? 'admin' : 'explore';
            return { 
                ...state, 
                currentUser: userToLogin, 
                loggedInUserProfile: userToLogin,
                currentView: viewAfterLogin,
                viewingProfileId: userToLogin.id,
                isAuthModalOpen: false,
                isLandingPage: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
                loggedInUserProfile: null,
                currentView: 'explore',
                selectedHabitId: null,
                viewingProfileId: null,
                isSettingsOpen: false,
                isLandingPage: true,
            };
        case 'REGISTER':
            const newUser = action.payload;
            return {
                ...state,
                users: [...state.users, newUser],
                currentUser: newUser,
                loggedInUserProfile: newUser,
                currentView: 'explore',
                viewingProfileId: newUser.id,
                isAuthModalOpen: false,
                isLandingPage: false,
            };
        case 'OPEN_AUTH_MODAL':
            return {
                ...state,
                isAuthModalOpen: true,
                authModalView: action.payload,
            };
        case 'CLOSE_AUTH_MODAL':
            return {
                ...state,
                isAuthModalOpen: false,
            };
        case 'ENTER_APP':
            return {
                ...state,
                isLandingPage: false,
            };
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

            const newStreak: HabitStreak = {
                id: `streak_${Date.now()}`,
                habitId: newHabit.id,
                name: newHabit.name,
                topic: newHabit.topic,
                logs: [],
            };

            const updatedProfileOnCreate = {
                    ...state.loggedInUserProfile,
                    streaks: [...state.loggedInUserProfile.streaks, newStreak],
            };

            return {
                ...state,
                habits: [newHabit, ...state.habits],
                loggedInUserProfile: updatedProfileOnCreate,
                users: state.users.map(u => u.id === state.loggedInUserProfile!.id ? updatedProfileOnCreate : u),
                selectedHabitId: newHabit.type === 'group' ? newHabit.id : null,
                currentView: newHabit.type === 'group' ? 'habit' : 'profile',
                viewingProfileId: newHabit.type === 'private' ? state.loggedInUserProfile.id : null,
            };
        }
        case 'ADD_POST': {
            if (!state.currentUser) {
                 return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            
            const habit = state.habits.find(h => h.id === action.payload.habitId);
            if (!habit) return state;

            const updatedUsersWithNotifications = state.users.map(user => {
                const isMember = habit.members.some(m => m.id === user.id);
                if (isMember && user.id !== state.currentUser!.id) {
                    const newNotification: Notification = {
                        id: `notif_${Date.now()}_${user.id}`,
                        type: NotificationType.NEW_POST,
                        sender: state.currentUser!,
                        habit: { id: habit.id, name: habit.name },
                        postContent: action.payload.post.content.substring(0, 30) + '...',
                        isRead: false,
                        timestamp: new Date(),
                    };
                    return { ...user, notifications: [newNotification, ...user.notifications] };
                }
                return user;
            });

            return {
                ...state,
                habits: state.habits.map(h =>
                    h.id === action.payload.habitId
                        ? { ...h, posts: [action.payload.post, ...h.posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) }
                        : h
                ),
                users: updatedUsersWithNotifications,
                loggedInUserProfile: updatedUsersWithNotifications.find(u => u.id === state.loggedInUserProfile?.id) || state.loggedInUserProfile,
            };
        }
        case 'ADD_REACTION': {
             if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }

            const habit = state.habits.find(h => h.id === action.payload.habitId);
            const post = habit?.posts.find(p => p.id === action.payload.postId);
            if (!post || !habit || post.author.id === state.currentUser.id) return state; // Don't notify for self-reactions
            
            let usersWithNewNotification = state.users;
            const postAuthorProfile = state.users.find(u => u.id === post.author.id);
            if (postAuthorProfile) {
                const newNotification: Notification = {
                    id: `notif_${Date.now()}`,
                    type: NotificationType.NEW_REACTION,
                    sender: state.currentUser,
                    habit: { id: habit.id, name: habit.name },
                    reactionType: action.payload.reactionType,
                    isRead: false,
                    timestamp: new Date(),
                };
                usersWithNewNotification = state.users.map(u => u.id === post.author.id ? { ...u, notifications: [newNotification, ...u.notifications] } : u);
            }

            return {
                ...state,
                habits: state.habits.map(h => {
                    if (h.id !== action.payload.habitId) return h;
                    return {
                        ...h,
                        posts: h.posts.map(p => {
                            if (p.id !== action.payload.postId) return p;
                            const reactionIndex = p.reactions.findIndex(r => r.userId === state.currentUser!.id);
                            if (reactionIndex > -1) {
                                if (p.reactions[reactionIndex].type === action.payload.reactionType) {
                                    return { ...p, reactions: p.reactions.filter(r => r.userId !== state.currentUser!.id) };
                                } else {
                                     return { ...p, reactions: [...p.reactions.filter(r => r.userId !== state.currentUser!.id), { userId: state.currentUser!.id, type: action.payload.reactionType }] };
                                }
                            } else {
                                return { ...p, reactions: [...p.reactions, { userId: state.currentUser!.id, type: action.payload.reactionType }] };
                            }
                        }),
                    };
                }),
                users: usersWithNewNotification,
                loggedInUserProfile: usersWithNewNotification.find(u => u.id === state.loggedInUserProfile?.id) || state.loggedInUserProfile,
            };
        }
        case 'ADD_COMMENT': {
            if (!state.currentUser) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            return {
                ...state,
                habits: state.habits.map(h => 
                    h.id === action.payload.habitId
                    ? {
                        ...h,
                        posts: h.posts.map(p => 
                            p.id === action.payload.postId
                            ? { ...p, comments: [...p.comments, action.payload.comment] }
                            : p
                        )
                    }
                    : h
                )
            };
        }
        case 'JOIN_HABIT': {
            if (!state.currentUser || !state.loggedInUserProfile) {
                return { ...state, isAuthModalOpen: true, authModalView: 'login' };
            }
            const habitToJoin = state.habits.find(h => h.id === action.payload);
            if (!habitToJoin || habitToJoin.members.some(m => m.id === state.currentUser!.id) || habitToJoin.members.length >= habitToJoin.memberLimit) {
                return { ...state, viewingHabitDetail: null };
            }

            const newStreak: HabitStreak = {
                id: `streak_${habitToJoin.id}_${state.currentUser.id}`,
                habitId: habitToJoin.id,
                name: habitToJoin.name,
                topic: habitToJoin.topic,
                logs: [],
            };
            
            const usersWithJoinNotif = state.users.map(user => {
                if (habitToJoin.members.some(m => m.id === user.id)) {
                     const newNotification: Notification = {
                        id: `notif_join_${Date.now()}_${user.id}`,
                        type: NotificationType.NEW_MEMBER,
                        sender: state.currentUser!,
                        habit: { id: habitToJoin.id, name: habitToJoin.name },
                        isRead: false,
                        timestamp: new Date(),
                    };
                    return { ...user, notifications: [newNotification, ...user.notifications] };
                }
                return user;
            });

            const updatedProfileOnJoin = {
                ...state.loggedInUserProfile,
                streaks: [...state.loggedInUserProfile.streaks, newStreak]
            };

            return {
                ...state,
                habits: state.habits.map(h =>
                    h.id === action.payload ? { ...h, members: [...h.members, state.currentUser!] } : h
                ),
                loggedInUserProfile: updatedProfileOnJoin,
                users: usersWithJoinNotif.map(u => u.id === state.currentUser!.id ? updatedProfileOnJoin : u),
                selectedHabitId: action.payload,
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
            const newStreak: HabitStreak = {
                id: `streak_${Date.now()}`,
                habitId: '', // No associated group habit
                name: action.payload.name,
                topic: action.payload.topic,
                logs: [],
            };
            const updatedProfileWithNewStreak = {
                ...state.loggedInUserProfile,
                streaks: [...state.loggedInUserProfile.streaks, newStreak],
            };
            return {
                ...state,
                loggedInUserProfile: updatedProfileWithNewStreak,
                users: state.users.map(u => u.id === state.loggedInUserProfile!.id ? updatedProfileWithNewStreak : u),
                isAddingHabit: false,
            };
        }
        case 'OPEN_STREAK_DAY_MODAL':
            return { ...state, streakDayModal: { isOpen: true, ...action.payload } };
        case 'CLOSE_STREAK_DAY_MODAL':
            return { ...state, streakDayModal: { isOpen: false, streakId: null, date: null, log: null } };
        case 'ADD_STREAK_LOG': {
            if (!state.loggedInUserProfile) return state;
            
            const updateUserLogs = (profile: UserProfile): UserProfile => ({
                ...profile,
                streaks: profile.streaks.map(streak => {
                    if (streak.id !== action.payload.streakId) return streak;
                    const existingLogs = streak.logs.filter(log => log.date.toDateString() !== action.payload.log.date.toDateString());
                    return {
                        ...streak,
                        logs: [...existingLogs, action.payload.log].sort((a,b) => a.date.getTime() - b.date.getTime()),
                    };
                }),
            });

            const updatedProfile = updateUserLogs(state.loggedInUserProfile);
            return {
                ...state,
                loggedInUserProfile: updatedProfile,
                users: state.users.map(u => u.id === state.loggedInUserProfile!.id ? updatedProfile : u),
                streakDayModal: { isOpen: false, streakId: null, date: null, log: null },
            };
        }
        case 'OPEN_SETTINGS':
            return { ...state, isSettingsOpen: true };
        case 'CLOSE_SETTINGS':
            return { ...state, isSettingsOpen: false };
        case 'SET_LANGUAGE':
            return {
                ...state,
                language: action.payload
            };
        case 'OPEN_EDIT_PROFILE_MODAL':
            return { ...state, isEditingProfile: true };
        case 'CLOSE_EDIT_PROFILE_MODAL':
            return { ...state, isEditingProfile: false };
        case 'UPDATE_PROFILE': {
            if (!state.currentUser || !state.loggedInUserProfile) return state;
            const { name, avatar, motto } = action.payload;

            const updatedProfileForChanges = { ...state.loggedInUserProfile, name, avatar, motto };

            const updateUserInState = (user: User) => {
                if (user.id === state.currentUser!.id) {
                    return { ...user, name, avatar };
                }
                return user;
            };
            
            const updateUserProfileInState = (user: UserProfile) => {
                if (user.id === state.currentUser!.id) {
                    return { ...user, name, avatar, motto };
                }
                return user;
            };

            return {
                ...state,
                currentUser: updateUserProfileInState(state.currentUser as UserProfile),
                loggedInUserProfile: updatedProfileForChanges,
                users: state.users.map(updateUserProfileInState),
                habits: state.habits.map(habit => ({
                    ...habit,
                    members: habit.members.map(member => updateUserInState(member) as User),
                    posts: habit.posts.map(post => ({
                        ...post,
                        author: updateUserInState(post.author) as User,
                        comments: post.comments.map(comment => ({
                            ...comment,
                            author: updateUserInState(comment.author) as User,
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
            const newEvent: Event = { ...action.payload, id: `event_${Date.now()}` };
            return {
                ...state,
                events: [newEvent, ...state.events],
                isCreatingEvent: false,
            };
        case 'VIEW_EVENT_DETAIL':
            return { ...state, viewingEventDetail: action.payload };
        case 'CLOSE_EVENT_DETAIL':
            return { ...state, viewingEventDetail: null };
        case 'OPEN_BOOST_HABIT_MODAL':
            return { ...state, isBoostingHabit: { isOpen: true, habitId: action.payload } };
        case 'CLOSE_BOOST_HABIT_MODAL':
            return { ...state, isBoostingHabit: { isOpen: false, habitId: null } };
        case 'BOOST_HABIT':
            return {
                ...state,
                boostedHabitId: action.payload,
                isBoostingHabit: { isOpen: false, habitId: null },
            };
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
        case 'SEND_PRIVATE_MESSAGE': {
            if (!state.currentUser) return state;
            const { recipientId, content } = action.payload;

            const conversationId = [state.currentUser.id, recipientId].sort().join('-');
            const newMessage: PrivateMessage = {
                id: `msg_${Date.now()}`,
                senderId: state.currentUser.id,
                content,
                timestamp: new Date(),
            };

            const recipientProfile = state.users.find(u => u.id === recipientId);
            let updatedUsersWithMessage = state.users;

            if (recipientProfile) {
                const newNotification: Notification = {
                    id: `notif_msg_${Date.now()}`,
                    type: NotificationType.NEW_MESSAGE,
                    sender: state.currentUser,
                    isRead: false,
                    timestamp: new Date(),
                };
                 updatedUsersWithMessage = state.users.map(u => u.id === recipientId ? { ...u, notifications: [newNotification, ...u.notifications] } : u);
            }

            const existingConversation = state.conversations.find(c => c.id === conversationId);
            
            let updatedConversations;
            if (existingConversation) {
                 updatedConversations = state.conversations.map(c => 
                    c.id === conversationId 
                    ? { ...c, messages: [...c.messages, newMessage] } 
                    : c
                );
            } else {
                const newConversation: Conversation = {
                    id: conversationId,
                    participantIds: [state.currentUser.id, recipientId],
                    messages: [newMessage],
                };
                updatedConversations = [...state.conversations, newConversation];
            }
            return { 
                ...state, 
                conversations: updatedConversations,
                users: updatedUsersWithMessage,
                loggedInUserProfile: updatedUsersWithMessage.find(u => u.id === state.loggedInUserProfile?.id) || state.loggedInUserProfile,
            };
        }
        case 'SELECT_ADMIN_VIEW':
            if (!state.currentUser?.isAdmin) return state;
            return { ...state, currentView: 'admin', selectedHabitId: null, viewingProfileId: null };

        case 'SUBMIT_BOOST_REQUEST':
            if (!state.currentUser) return state;
            const newRequest: BoostRequest = {
                id: `br_${Date.now()}`,
                habitId: action.payload.habitId,
                userId: state.currentUser.id,
                proofImage: action.payload.proofImage,
                status: 'pending',
                timestamp: new Date(),
            };
            return {
                ...state,
                boostRequests: [...state.boostRequests, newRequest],
                isBoostingHabit: { isOpen: false, habitId: null },
            };
        
        case 'APPROVE_BOOST_REQUEST': {
            const requestToApprove = state.boostRequests.find(r => r.id === action.payload);
            if (!requestToApprove) return state;

            return {
                ...state,
                boostRequests: state.boostRequests.map(r => r.id === action.payload ? { ...r, status: 'approved' } : r),
                boostedHabitId: requestToApprove.habitId, // Set the habit of the day
            };
        }

        case 'REJECT_BOOST_REQUEST':
            return {
                ...state,
                boostRequests: state.boostRequests.map(r => r.id === action.payload ? { ...r, status: 'rejected' } : r),
            };
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
            return {
                ...state,
                isManageMembersModalOpen: { isOpen: true, habitId: action.payload },
            };
        case 'CLOSE_MANAGE_MEMBERS_MODAL':
            return {
                ...state,
                isManageMembersModalOpen: { isOpen: false, habitId: null },
            };
        case 'KICK_MEMBER': {
            const { habitId, userId } = action.payload;
            
            const updatedHabits = state.habits.map(h => 
                h.id === habitId 
                ? { ...h, members: h.members.filter(m => m.id !== userId) }
                : h
            );

            const updatedUsers = state.users.map(u => {
                if (u.id === userId) {
                    return { ...u, streaks: u.streaks.filter(s => s.habitId !== habitId) };
                }
                return u;
            });

            const updatedLoggedInUserProfile = state.loggedInUserProfile?.id === userId 
                ? updatedUsers.find(u => u.id === userId) || state.loggedInUserProfile
                : state.loggedInUserProfile;

            return {
                ...state,
                habits: updatedHabits,
                users: updatedUsers,
                loggedInUserProfile: updatedLoggedInUserProfile
            };
        }
        default:
            return state;
    }
}


// --- MAIN APP ---
export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);

  const { habits, currentUser, loggedInUserProfile, users, conversations, selectedHabitId, currentView, viewingProfileId, viewingHabitDetail, isAddingHabit, streakDayModal, isSettingsOpen, language, isEditingProfile, events, isCreatingEvent, viewingEventDetail, boostedHabitId, isBoostingHabit, theme, isPrivacyPolicyOpen, isTermsConditionsOpen, isAboutModalOpen, isMessaging, isAuthModalOpen, authModalView, boostRequests, isManageMembersModalOpen, isLandingPage } = state;
  const t = (key: keyof typeof translations.id) => translations[language][key] || key;

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    localStorage.setItem('habitcom-theme', theme);
  }, [theme]);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  const handleLogin = (email: string, pass: string) => {
      // Dummy user validation
      const dummyUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
       if (dummyUser && (pass === 'password123' || (dummyUser.isAdmin && pass === 'adminpass'))) {
          dispatch({ type: 'LOGIN', payload: dummyUser });
      } else {
          alert(t('invalidCredentials'));
      }
  };

  const handleRegister = (name: string, email: string, pass: string) => {
      const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          name,
          email,
          avatar: `https://i.pravatar.cc/150?u=user_${Date.now()}`,
          motto: "New to HabitComm!",
          memberSince: new Date(),
          totalDaysActive: 0,
          level: "Novice",
          cheersGiven: 0,
          pushesGiven: 0,
          checkInPercentage: 0,
          streaks: [],
          badges: [],
          notifications: [],
      };
      dispatch({ type: 'REGISTER', payload: newUser });
  };

  const handleImageSelect = (file: File) => {
        if (postImagePreview) {
            URL.revokeObjectURL(postImagePreview);
        }
        setPostImage(file);
        setPostImagePreview(URL.createObjectURL(file));
  };
  
  const processImageAndPost = (imageUrl: string) => {
    if (!selectedHabit || !currentUser) return;
     const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      content: postContent,
      habitId: selectedHabit.id,
      imageUrl: imageUrl || undefined,
      streak: Math.floor(Math.random() * 30) + 1,
      reactions: [],
      comments: [],
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_POST', payload: { habitId: selectedHabit.id, post: newPost } });
    setPostContent('');
    setPostImage(null);
    setPostImagePreview(null);
    if(postImagePreview) URL.revokeObjectURL(postImagePreview);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!postContent.trim() && !postImage) || !selectedHabit || !currentUser) return;
    
    if (postImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processImageAndPost(reader.result as string);
      };
      reader.readAsDataURL(postImage);
    } else {
      processImageAndPost('');
    }
  };
  
  // FIX: Changed function signature to accept a single object with habit data including optional coverImage.
  const handleCreateHabit = (habitData: Omit<Habit, 'id'|'members'|'posts'|'memberLimit'|'highlightIcon'|'creatorId'>) => {
      if (!currentUser) return;
      
        const newHabit: Habit = {
            ...habitData,
            id: `habit_${Date.now()}`,
            creatorId: currentUser.id,
            members: [currentUser],
            posts: [],
            memberLimit: 20,
        };
        dispatch({ type: 'CREATE_HABIT', payload: newHabit });
  };
  
  const handleUpdateProfile = (name: string, avatarFile: File | null, motto: string) => {
    if (!loggedInUserProfile) return;

    const processUpdate = (avatarUrl: string) => {
        dispatch({ type: 'UPDATE_PROFILE', payload: { name, avatar: avatarUrl, motto } });
    };

    if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            processUpdate(reader.result as string);
        };
        reader.readAsDataURL(avatarFile);
    } else {
        processUpdate(loggedInUserProfile.avatar);
    }
  };

  const handleReaction = (postId: string, reactionType: ReactionType, habitId?: string) => {
    const targetHabitId = habitId || selectedHabitId;
    if (!targetHabitId) return;
    dispatch({ type: 'ADD_REACTION', payload: { habitId: targetHabitId, postId, reactionType } });
  }

  const handleCommentSubmit = (habitId: string, postId: string, content: string) => {
      if (!currentUser || !content.trim()) return;
      const newComment: Comment = {
          id: `comment_${Date.now()}`,
          author: currentUser,
          content,
          timestamp: new Date(),
      };
      dispatch({ type: 'ADD_COMMENT', payload: { habitId, postId, comment: newComment } });
  };

  const handleDayClick = (streakId: string, date: Date) => {
    const profile = users.find(u => u.streaks.some(s => s.id === streakId));
    if (!profile) return;
    const streak = profile.streaks.find(s => s.id === streakId);
    if (!streak) return;
    const log = streak.logs.find(l => l.date.toDateString() === date.toDateString()) || null;
    dispatch({ type: 'OPEN_STREAK_DAY_MODAL', payload: { streakId, date, log } });
  };
  
  const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
    dispatch({ type: 'CREATE_EVENT', payload: eventData });
  };
  
  const handleBoostHabit = (habitId: string) => {
    dispatch({ type: 'OPEN_BOOST_HABIT_MODAL', payload: habitId });
  };
  
  const handleViewProfile = (userId: string) => {
    dispatch({ type: 'VIEW_PROFILE', payload: userId });
  };

  const handleSendMessage = (content: string) => {
    if (!isMessaging.recipient) return;
    dispatch({ type: 'SEND_PRIVATE_MESSAGE', payload: { recipientId: isMessaging.recipient.id, content } });
  };

  // FIX: Changed function signature to accept base64 proofImage string directly.
  const handleBoostSubmit = (proofImage: string) => {
    if (isBoostingHabit.habitId) {
        dispatch({ type: 'SUBMIT_BOOST_REQUEST', payload: { habitId: isBoostingHabit.habitId!, proofImage } });
    }
  };

  const renderMainView = () => {
    const allUserHabits = loggedInUserProfile ? habits.filter(h => h.members.some(m => m.id === loggedInUserProfile!.id)) : [];
    switch (currentView) {
        case 'admin':
            return <AdminView 
                requests={boostRequests}
                habits={habits}
                users={users}
                onApprove={(id) => dispatch({ type: 'APPROVE_BOOST_REQUEST', payload: id })}
                onReject={(id) => dispatch({ type: 'REJECT_BOOST_REQUEST', payload: id })}
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
                onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })}
                onViewProfile={handleViewProfile}
                t={t}
                language={language}
             />;
        }
        case 'createHabit':
            return <CreateHabitView
                onCreate={handleCreateHabit}
                onCancel={() => dispatch({ type: 'SELECT_EXPLORE' })}
                t={t}
            />;
        case 'habit':
            if (!selectedHabit || !currentUser) {
                 return <ExploreView 
                        allHabits={habits}
                        currentUser={currentUser} 
                        onJoinHabit={(id) => dispatch({ type: 'JOIN_HABIT', payload: id })} 
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
                postImage={postImagePreview}
                setPostImage={(img) => {
                  if (img === null) {
                    setPostImage(null);
                    setPostImagePreview(null);
                    if(postImagePreview) URL.revokeObjectURL(postImagePreview);
                  }
                }}
                handleImageSelect={handleImageSelect}
                handlePostSubmit={handlePostSubmit}
                handleReaction={handleReaction}
                handleCommentSubmit={handleCommentSubmit}
                handleBoostHabit={handleBoostHabit}
                onOpenManageMembers={(habitId) => dispatch({ type: 'OPEN_MANAGE_MEMBERS_MODAL', payload: habitId })}
                onViewProfile={handleViewProfile}
                t={t}
                boostedHabitId={boostedHabitId}
            />;
        case 'groupHabits':
             return <UserHabitsListView 
                allUserHabits={allUserHabits}
                type="group"
                onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })}
                t={t}
             />;
        case 'privateHabits':
              return <UserHabitsListView 
                allUserHabits={allUserHabits}
                type="private"
                onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })}
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
                        onJoinHabit={(id) => dispatch({ type: 'JOIN_HABIT', payload: id })} 
                        onViewDetail={(habit) => dispatch({ type: 'VIEW_HABIT_DETAIL', payload: habit })}
                        t={t}
                        boostedHabitId={boostedHabitId}
                    />;
    }
  };

  // Landing Page View Logic
  // If no user is logged in, ALWAYS show Landing Page (and Auth Modal if open)
  if (!currentUser) {
    return (
        <>
            {isAuthModalOpen && (
                <AuthModal
                    initialView={authModalView}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onClose={() => dispatch({ type: 'CLOSE_AUTH_MODAL' })}
                    t={t}
                />
            )}
            <LandingPage 
                onLoginClick={() => dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'login' })}
                onRegisterClick={() => dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'register' })}
                language={language}
                onLanguageChange={(lang) => dispatch({type: 'SET_LANGUAGE', payload: lang})}
                t={t}
            />
        </>
    );
  }

  return (
    <div className="h-full md:p-4 w-full flex justify-center">
        <div className="h-full w-full max-w-[1100px] flex flex-col font-sans bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-border-color dark:border-neutral-800">
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
                    onKickMember={(userId) => dispatch({ type: 'KICK_MEMBER', payload: { habitId: isManageMembersModalOpen.habitId!, userId } })}
                    t={t}
                />
            )}
        {viewingHabitDetail && 
            <HabitDetailModal 
            habit={viewingHabitDetail} 
            onClose={() => dispatch({ type: 'CLOSE_HABIT_DETAIL'})}
            onJoin={(id) => dispatch({ type: 'JOIN_HABIT', payload: id })}
            onViewProfile={handleViewProfile}
            isMember={currentUser ? viewingHabitDetail.members.some(m => m.id === currentUser.id) : false}
            t={t}
            />}
            {isAddingHabit && (
                <AddHabitModal 
                    onClose={() => dispatch({type: 'CLOSE_ADD_HABIT_MODAL'})}
                    onSave={(data) => dispatch({type: 'ADD_HABIT_STREAK', payload: data })}
                    t={t}
                />
            )}
            {streakDayModal.isOpen && streakDayModal.date && streakDayModal.streakId && (
                <StreakDayModal
                    date={streakDayModal.date}
                    log={streakDayModal.log}
                    onClose={() => dispatch({type: 'CLOSE_STREAK_DAY_MODAL'})}
                    onSave={(note) => dispatch({type: 'ADD_STREAK_LOG', payload: { streakId: streakDayModal.streakId!, log: { date: streakDayModal.date!, note }} })}
                    t={t}
                    language={language}
                />
            )}
            {isSettingsOpen && (
                <SettingsModal
                    onClose={() => dispatch({type: 'CLOSE_SETTINGS'})}
                    onLogout={() => dispatch({ type: 'LOGOUT' })}
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
                    onSubmit={handleBoostSubmit}
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
            onLogout={() => dispatch({ type: 'LOGOUT' })}
            onLoginClick={() => dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'login' })}
            onRegisterClick={() => dispatch({ type: 'OPEN_AUTH_MODAL', payload: 'register' })}
            language={language}
            onLanguageChange={(lang) => dispatch({type: 'SET_LANGUAGE', payload: lang})}
            theme={theme}
            onThemeChange={(theme) => dispatch({ type: 'SET_THEME', payload: theme })}
            onOpenSettings={() => dispatch({type: 'OPEN_SETTINGS'})}
            onSelectCreateHabit={() => dispatch({ type: 'SELECT_CREATE_HABIT'})}
            onSelectAdminView={() => dispatch({ type: 'SELECT_ADMIN_VIEW' })}
            t={t}
            />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar 
            habits={habits} 
            selectedHabitId={selectedHabitId} 
            onSelectHabit={(id) => dispatch({ type: 'SELECT_HABIT', payload: id })} 
            onSelectCreateHabit={() => dispatch({ type: 'SELECT_CREATE_HABIT'})}
            currentView={currentView}
            currentUser={loggedInUserProfile}
            onSelectExplore={() => dispatch({ type: 'SELECT_EXPLORE' })}
            onViewHabitDetail={(habit) => dispatch({ type: 'VIEW_HABIT_DETAIL', payload: habit })}
            onViewProfile={(id) => dispatch({ type: 'VIEW_PROFILE', payload: id })}
            onOpenSettings={() => dispatch({type: 'OPEN_SETTINGS'})}
            onOpenEditProfile={() => dispatch({ type: 'OPEN_EDIT_PROFILE_MODAL' })}
            onSelectEvents={() => dispatch({ type: 'SELECT_EVENTS' })}
            onSelectMessagingList={() => dispatch({ type: 'SELECT_MESSAGING_LIST' })}
            onSelectAdminView={() => dispatch({ type: 'SELECT_ADMIN_VIEW'})}
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
            onSelectCreateHabit={() => dispatch({ type: 'SELECT_CREATE_HABIT'})}
            onSelectExplore={() => dispatch({ type: 'SELECT_EXPLORE' })}
            onSelectGroupHabits={() => dispatch({ type: 'SELECT_GROUP_HABITS' })}
            onSelectPrivateHabits={() => dispatch({ type: 'SELECT_PRIVATE_HABITS' })}
            onSelectMessagingList={() => dispatch({ type: 'SELECT_MESSAGING_LIST' })}
            onSelectEvents={() => dispatch({ type: 'SELECT_EVENTS' })}
            onViewProfile={(id) => dispatch({ type: 'VIEW_PROFILE', payload: id })}
            t={t}
        />
        <footer className="hidden md:block text-center py-3 border-t border-border-color dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <p className="text-xs text-text-secondary dark:text-neutral-500">{t('copyright')}</p>
        </footer>
        </div>
    </div>
  );
}