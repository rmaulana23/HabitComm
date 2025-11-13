import { createClient } from '@supabase/supabase-js';
import { Habit, UserProfile, Post, Comment, Reaction, HabitStreak, Event, Conversation, PrivateMessage, Notification, BoostRequest } from './types';

// Define your database schema using TypeScript interfaces
export interface Database {
  public: {
    Tables: {
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'posts' | 'members'>;
        Update: Partial<Habit>;
      };
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id'>;
        Update: Partial<UserProfile>;
      };
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'author' | 'comments' | 'reactions'> & { habitId: string, authorId: string };
        Update: Partial<Post>;
      };
       comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'author'> & { postId: string, authorId: string };
        Update: Partial<Comment>;
      };
      reactions: {
        Row: Reaction & { id: number, postId: string };
        Insert: Reaction & { postId: string };
        Update: Partial<Reaction>;
      };
      streaks: {
        Row: HabitStreak;
        Insert: Omit<HabitStreak, 'id'> & { userId: string };
        Update: Partial<HabitStreak>;
      };
      habit_members: {
          Row: { habitId: string, userId: string };
          Insert: { habitId: string, userId: string };
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id'>;
        Update: Partial<Event>;
      };
       conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'messages'>;
        Update: Partial<Conversation>;
      };
      private_messages: {
        Row: PrivateMessage & { conversationId: string };
        Insert: Omit<PrivateMessage, 'id'> & { conversationId: string };
        Update: Partial<PrivateMessage>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'sender'> & { senderId: string, recipientId: string };
        Update: Partial<Notification>;
      };
      boost_requests: {
        Row: BoostRequest;
        Insert: Omit<BoostRequest, 'id'>;
        Update: Partial<BoostRequest>;
      }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}


const supabaseUrl = 'https://noumkgwcxuyyxmijuuvr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdW1rZ3djeHV5eXhtaWp1dXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMjk4ODQsImV4cCI6MjA3ODYwNTg4NH0.u0rbl857PRL3aBMWX5t3tySqw6esg76ahEvbASI5-Jg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
