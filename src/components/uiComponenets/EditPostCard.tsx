"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IPostImage } from "@/types/types";

interface EditPostCardProps {
  initialTitle: string;
  initialImages?: IPostImage[];
  isLoading: boolean;
  onCancel: () => void;
  onSave: (title: string, images: File[]) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EditPostCard: React.FC<EditPostCardProps> = ({ initialTitle, initialImages = [], isLoading, onCancel, onSave }) => {
  const [title, setTitle] = useState(initialTitle);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = newImages.map(file => globalThis.URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach(url => globalThis.URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title, newImages);
  };

  const handleCancel = () => {
    previews.forEach(url => globalThis.URL.revokeObjectURL(url));
    onCancel();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 shadow-lg">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold">Edit Post</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {initialImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Current Images</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {initialImages.map((img, idx) => (
                <div key={img.id || idx} className="relative">
                  <img
                    src={BASE_URL + img.imageUrl}
                    alt={`Current image ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-md border"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Adding new images will replace current ones</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {initialImages.length > 0 ? "Replace Images" : "Add Images"}
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-md px-3 py-2 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading}
          />
        </div>

        {previews.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">New Images Preview</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {previews.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`New preview ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-md border"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading || !title.trim()}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EditPostCard;
