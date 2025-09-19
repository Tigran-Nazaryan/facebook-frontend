"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProfileService from "@/service/profile";
import { IPost } from "@/types/types";
import PostItem from "@/components/uiComponenets/PostItem";
import { Button } from "@/components/ui/button";
import CreatePostModal from "@/components/uiComponenets/CreatePostModal";

const Profile = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await ProfileService.getAllPosts();
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
      setPosts((prev) => [newPost, ...prev]);
    } catch (err: any) {
      alert(err.userMessage || err.message);
    }
  }, []);

  const handleUpdatePost = useCallback((updatedPost: IPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  }, []);

  const handleDeletePost = useCallback((postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return (
    <div className="px-4">
      <div className="mb-6 max-w-2xl mx-auto">
        <Button onClick={() => setOpenModal(true)}>+ Create Post</Button>
      </div>

      <CreatePostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreatePost}
      />

      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
          isOwner={true}
        />
      ))}
    </div>
  );
};

export default Profile;
