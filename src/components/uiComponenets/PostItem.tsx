// "use client";
//
// import React, { useState } from "react";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { Badge } from "@/components/ui/badge";
// import { Edit2, Trash2, Heart, Calendar } from "lucide-react";
// import ProfileService from "@/service/profile";
// import { IPost, IPostImage } from "@/types/types";
//
// interface PostItemProps {
//   post: IPost;
//   onUpdate: (updatedPost: IPost) => void;
//   onDelete: (postId: number) => void;
//   isOwner?: boolean;
//   postLikeCount?: number;
//   setPostLikeCount?: React.Dispatch<React.SetStateAction<number>>;
// }
//
// const URL = process.env.NEXT_PUBLIC_BASE_URL
//
// const PostItem: React.FC<PostItemProps> = ({ post, onUpdate, onDelete, isOwner = false, postLikeCount = 0, setPostLikeCount }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [title, setTitle] = useState(post.title);
//   const [images, setImages] = useState<File[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//
//   const handleUpdate = async () => {
//     if (!title.trim()) return;
//
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       images.forEach((file) => formData.append("images", file));
//
//       const updated = await ProfileService.updatePost(post.id, formData);
//       onUpdate(updated);
//       setIsEditing(false);
//       setImages([]);
//     } catch (err: any) {
//       console.error("Failed to update post:", err.userMessage || err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleDelete = async () => {
//     setIsLoading(true);
//     try {
//       await ProfileService.deletePost(post.id);
//       onDelete(post.id);
//     } catch (err: any) {
//       console.error("Failed to delete post:", err.userMessage || err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const handleLike = async () => {
//     try {
//       if (isLiked) {
//         await ProfileService.unLikePost(post.id);
//         if (setPostLikeCount) {
//           setPostLikeCount(prev => prev - 1);
//         }
//       } else {
//         await ProfileService.likePost(post.id);
//         if (setPostLikeCount) {
//           setPostLikeCount(prev => prev + 1);
//         }
//       }
//       setIsLiked(!isLiked);
//     } catch (err: any) {
//       console.error("Failed to like/unlike post:", err.userMessage || err.message);
//     }
//   };
//
//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit"
//     });
//   };
//
//   const getInitials = (firstName?: string, lastName?: string) => {
//     return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
//   };
//
//   if (isEditing) {
//     return (
//       <Card className="w-full max-w-2xl mx-auto mb-6 shadow-lg">
//         <CardHeader className="pb-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">Edit Post</h3>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => {
//                 setIsEditing(false);
//                 setTitle(post.title);
//                 setImages([]);
//               }}
//             >
//               Cancel
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Title</label>
//             <Input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter post title..."
//               className="w-full"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Images</label>
//             <Input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={(e) => setImages(Array.from(e.target.files || []))}
//               className="w-full"
//             />
//             {images.length > 0 && (
//               <p className="text-sm text-gray-500">{images.length} image(s) selected</p>
//             )}
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-end space-x-2">
//           <Button
//             variant="outline"
//             onClick={() => {
//               setIsEditing(false);
//               setTitle(post.title);
//               setImages([]);
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleUpdate}
//             disabled={isLoading || !title.trim()}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             {isLoading ? "Saving..." : "Save Changes"}
//           </Button>
//         </CardFooter>
//       </Card>
//     );
//   }
//
//   return (
//     <Card className="w-full max-w-2xl mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center space-x-3">
//             <Avatar className="h-10 w-10">
//               <AvatarFallback className="bg-blue-100 text-blue-600">
//                 {getInitials(post.author?.firstName, post.author?.lastName)}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <div className="flex items-center space-x-2">
//                 <h4 className="font-semibold text-gray-900">
//                   {post.author?.firstName} {post.author?.lastName}
//                 </h4>
//                 {post.author?.isVerified && (
//                   <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">
//                     Verified
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
//                 <Calendar className="h-3 w-3" />
//                 <span>{formatDate(post.createdAt)}</span>
//               </div>
//             </div>
//           </div>
//           {isOwner && (
//             <div className="flex items-center space-x-1">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsEditing(true)}
//                 className="h-8 w-8 p-0 hover:bg-blue-50"
//               >
//                 <Edit2 className="h-4 w-4 text-blue-600" />
//               </Button>
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-8 w-8 p-0 hover:bg-red-50"
//                   >
//                     <Trash2 className="h-4 w-4 text-red-600" />
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Delete Post</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       Are you sure you want to delete this post? This action cannot be undone.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={handleDelete}
//                       className="bg-red-600 hover:bg-red-700"
//                     >
//                       {isLoading ? "Deleting..." : "Delete"}
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           )}
//         </div>
//       </CardHeader>
//
//       <CardContent className="pb-3">
//         <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
//           {post.title}
//         </h3>
//
//         {post.images && post.images.length > 0 && (
//           <div className={`grid gap-2 mb-4 ${
//             post.images.length === 1
//               ? "grid-cols-1"
//               : post.images.length === 2
//                 ? "grid-cols-2"
//                 : "grid-cols-2 md:grid-cols-3"
//           }`}>
//             {post.images.map((img: IPostImage, idx: number) => (
//               <div
//                 key={img.id || idx}
//                 className={`relative group overflow-hidden rounded-lg ${
//                   post.images?.length === 1 ? "aspect-video" : "aspect-square"
//                 }`}
//               >
//                 <img
//                   src={URL + img.imageUrl}
//                   alt={`Post image ${idx + 1}`}
//                   className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//
//       <CardFooter className="pt-2 border-t">
//         <div className="flex items-center justify-between w-full">
//           <div className="flex items-center space-x-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleLike}
//               className={`flex items-center space-x-2 hover:bg-red-50 ${
//                 isLiked ? "text-red-600" : "text-gray-600"
//               }`}
//             >
//               <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
//               <span className="text-sm">{postLikeCount}</span>
//             </Button>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// };
//
// export default PostItem;

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Heart, Calendar } from "lucide-react";
import ProfileService from "@/service/profile";
import { IPost, IPostImage } from "@/types/types";

interface PostItemProps {
  post: IPost;
  onUpdate: (updatedPost: IPost) => void;
  onDelete: (postId: number) => void;
  isOwner?: boolean;
}

const URL = process.env.NEXT_PUBLIC_BASE_URL;

const PostItem: React.FC<PostItemProps> = ({ post, onUpdate, onDelete, isOwner = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  const handleUpdate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      images.forEach((file) => formData.append("images", file));

      const updated = await ProfileService.updatePost(post.id, formData);
      onUpdate(updated);
      setIsEditing(false);
      setImages([]);
    } catch (err: any) {
      console.error("Failed to update post:", err.userMessage || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await ProfileService.deletePost(post.id);
      onDelete(post.id);
    } catch (err: any) {
      console.error("Failed to delete post:", err.userMessage || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await ProfileService.unLikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await ProfileService.likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err: any) {
      console.error("Failed to like/unlike post:", err.userMessage || err.message);
    }
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
      <Card className="w-full max-w-2xl mx-auto mb-6 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Edit Post</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setTitle(post.title);
                setImages([]);
              }}
            >
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full"
          />
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full"
          />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={isLoading || !title.trim()}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
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
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 text-blue-600" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
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
              <img
                key={img.id || idx}
                src={URL + img.imageUrl}
                alt={`Post image ${idx + 1}`}
                className="w-full object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-start items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center space-x-2 ${isLiked ? "text-red-600" : "text-gray-600"}`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likesCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
