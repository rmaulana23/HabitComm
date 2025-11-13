import React, { useState } from 'react';
import { Post, ReactionType, User, Comment } from '../types';
import { parseContent } from '../utils';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onReact: (postId: string, reaction: ReactionType) => void;
  onCommentSubmit: (content: string) => void;
  t: (key: string) => string;
}
const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onReact, onCommentSubmit, t }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  
  const cheers = post.reactions.filter(r => r.type === ReactionType.CHEER).length;
  const pushes = post.reactions.filter(r => r.type === ReactionType.PUSH).length;
  const commentCount = post.comments.length;

  const handleCommentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    onCommentSubmit(commentContent);
    setCommentContent('');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm animate-fade-in border border-border-color dark:border-neutral-800">
      <div className="flex items-start space-x-3">
        <a href={`/#/profile/${post.author.id}`} title={post.author.name} className="shrink-0">
            <img src={post.author.avatar} alt={post.author.name} className="w-11 h-11 rounded-full" />
        </a>
        <div className="flex-1">
          <div>
            <a href={`/#/profile/${post.author.id}`} title={post.author.name} className="font-bold text-text-primary dark:text-neutral-200 hover:underline">
                {post.author.id === currentUser.id ? t('you') : post.author.name}
            </a>
            <span className="text-xs text-text-secondary dark:text-neutral-400 ml-2">{post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {post.content && <p className="text-text-primary dark:text-neutral-300 mt-1">{parseContent(post.content)}</p>}
          
          {post.imageUrl && (
            <div className="mt-3">
              <img src={post.imageUrl} alt="Post image" className="rounded-lg w-full max-h-80 object-cover border dark:border-neutral-800" />
            </div>
           )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pl-14">
            <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-neutral-400 font-medium">
                <button onClick={() => onReact(post.id, ReactionType.CHEER)} className="flex items-center space-x-1.5 hover:text-primary dark:hover:text-primary-400 transition-colors duration-200">
                    <span className="text-lg">👏</span>
                    <span>{cheers} <span className="hidden md:inline">{t('cheers')}</span></span>
                </button>
                 <button onClick={() => onReact(post.id, ReactionType.PUSH)} className="flex items-center space-x-1.5 hover:text-amber-500 transition-colors duration-200">
                    <span className="text-lg">🔥</span>
                    <span>{pushes} <span className="hidden md:inline">{t('pushes')}</span></span>
                </button>
                <button onClick={() => setCommentsOpen(!commentsOpen)} className="flex items-center space-x-1.5 hover:text-blue-500 transition-colors duration-200">
                    <span className="text-lg">💬</span>
                    <span>{commentCount} <span className="hidden md:inline">{t('comment')}</span></span>
                </button>
            </div>
            {post.streak > 0 &&
                <div className="text-xs font-bold text-white bg-gradient-to-r from-grad-pink-start to-grad-pink-end px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                    <span className="md:hidden">{post.streak} {t('days')}</span>
                    <span className="hidden md:inline">{post.streak}-{t('dayStreak')}</span>
                </div>
            }
      </div>
      {commentsOpen && (
        <div className="mt-4 pl-14 animate-fade-in space-y-3">
            {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-3">
                    <a href={`/#/profile/${comment.author.id}`} title={comment.author.name} className="shrink-0">
                        <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full"/>
                    </a>
                    <div className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-2">
                        <a href={`/#/profile/${comment.author.id}`} title={comment.author.name} className="font-bold text-sm text-text-primary dark:text-neutral-200 hover:underline">{comment.author.name}</a>
                        <p className="text-sm text-text-primary dark:text-neutral-300">{comment.content}</p>
                    </div>
                </div>
            ))}
            <form onSubmit={handleCommentFormSubmit} className="flex items-center space-x-2 pt-2">
                <img src={currentUser.avatar} alt="Your avatar" className="w-8 h-8 rounded-full" />
                <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder={t('addCommentPlaceholder')}
                    className="flex-1 bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 dark:placeholder-neutral-500 p-2 rounded-lg border border-gray-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="submit" disabled={!commentContent.trim()} className="p-2 bg-primary rounded-lg text-white disabled:bg-gray-300 dark:disabled:bg-neutral-700 transition-colors">
                    <span className="text-xl">➤</span>
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;