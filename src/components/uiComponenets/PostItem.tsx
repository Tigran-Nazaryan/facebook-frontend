"use client";

import React from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Badge} from "@/components/ui/badge";
import {Edit2, Trash2, Heart, Calendar} from "lucide-react";
import {IPost, IPostImage} from "@/types/types";
import ProfileService from "@/service/profile";
import EditPostCard from "./EditPostCard";
import {toast} from "react-toastify";

interface PostItemProps {
  post: IPost;
  isOwner?: boolean;
  onUpdate: (updatedPost: IPost) => void;
  onDelete: (postId: number) => void;
  onLike: (postId: number, isLiked: boolean) => void;
  isLiked: boolean;
}

const URL = process.env.NEXT_PUBLIC_BASE_URL;

const PostItem: React.FC<PostItemProps> = ({post, onUpdate, onDelete, onLike, isLiked}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpdatePost = async (title: string, images: File[]) => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      images.forEach((file) => formData.append("images", file));

      const updatedPost = await ProfileService.updatePost(post.id, formData);

      const postWithPreservedData = {
        ...updatedPost,
        likes: updatedPost.likes || post.likes,
        author: updatedPost.author || post.author,
      };

      onUpdate(postWithPreservedData);
      toast.success("Post updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err.userMessage || err.message);
      toast.error(err.userMessage || "Failed to update post.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await ProfileService.deletePost(post.id);
      onDelete(post.id);
      toast.success("Post deleted successfully!");
    } catch (err: any) {
      console.error(err.userMessage || err.message);
      toast.error(err.userMessage || "Failed to delete post.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    onLike(post.id, isLiked);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (isEditing) {
    return (
      <EditPostCard
        initialTitle={post.title}
        initialImages={post.images}
        isLoading={isLoading}
        onCancel={handleCancelEdit}
        onSave={handleUpdatePost}
      />
    );
  }

  return (
    <Card className="w-full mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200  ">
      <CardHeader className="pb-3 flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(post.author?.firstName, post.author?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{post.author?.firstName} {post.author?.lastName}</h4>
            {post.author?.isVerified && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">Verified</Badge>
            )}
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1"/>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <Edit2 className="h-4 w-4 text-blue-600"/>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <Trash2 className="h-4 w-4 text-red-600"/>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    className="cursor-pointer"
                    onClick={handleDelete}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <h3 className="text-xl font-semibold mb-4">{post.title}</h3>
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${
            post.images.length === 1
              ? "grid-cols-1"
              : post.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
          }`}>
            {post.images.map((img: IPostImage, idx: number) => (
              <div key={img.id || idx} className="relative overflow-hidden rounded-lg">
                <img
                  src={URL + img.imageUrl}
                  alt={`Post image ${idx + 1}`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-start items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center space-x-2 hover:bg-red-50 ${
            isLiked ? "text-red-600" : "text-gray-600"
          }`}
          disabled={isLoading}
        >
          <Heart className={`h-4 w-4 transition-colors ${isLiked ? "fill-current" : ""}`}/>
          <span className="font-medium">{post.likes?.length || 0}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostItem;