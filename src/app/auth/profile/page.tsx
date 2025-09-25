"use client";

import React, {useState, useEffect, useCallback} from "react";
import ProfileService from "@/service/profile";
import {IPost} from "@/types/types";
import PostItem from "@/components/uiComponenets/PostItem";
import {Button} from "@/components/ui/button";
import CreatePostModal from "@/components/uiComponenets/createModal/CreatePostModal";

const Profile = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const currentUserId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await ProfileService.allPostsUser();
        setPosts(data);
      } catch (err: any) {
        console.error(err.userMessage || err.message);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = useCallback(async (title: string, files: File[]) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      files.forEach((file) => formData.append("images", file));

      const newPost = await ProfileService.createPost(formData);
      setPosts(prev => [newPost, ...prev]);
    } catch (err: any) {
      alert(err.userMessage || err.message);
    }
  }, []);

  const handleUpdatePost = useCallback((updatedPost: IPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  }, []);

  const handleDeletePost = useCallback((postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const handleLikePost = useCallback(async (postId: number, isCurrentlyLiked: boolean) => {
    try {
      if (isCurrentlyLiked) {
        await ProfileService.unLikePost(postId);
      } else {
        await ProfileService.likePost(postId);
      }

      setPosts(prev =>
        prev.map(post => {
          if (post.id === postId) {
            const updatedLikes = isCurrentlyLiked
              ? post.likes?.filter((like: { userId: number; }) => like.userId !== currentUserId) || []
              : [...(post.likes || []), {userId: currentUserId, postId}];
            return {...post, likes: updatedLikes};
          }
          return post;
        })
      );
    } catch (err: any) {
      console.error(err.userMessage || err.message);
    }
  }, [currentUserId]);

  const isPostLikedByUser = useCallback((post: IPost) => {
    return post.likes?.some((like: { userId: number; }) => like.userId === currentUserId) || false;
  }, [currentUserId]);

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => setOpenModal(true)} className="cursor-pointer">+ Create Post</Button>
      </div>

      <CreatePostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreatePost}
      />

      <div className="grid place-items-center gap-4">
        {posts.map(post => (
          <div key={post.id} className="w-full max-w-2xl min-h-[500px]">
            <PostItem
              post={post}
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
              onLike={handleLikePost}
              isLiked={isPostLikedByUser(post)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
