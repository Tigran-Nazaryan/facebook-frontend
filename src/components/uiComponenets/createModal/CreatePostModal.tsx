"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {createPostSchema, FormValues} from "@/components/uiComponenets/createModal/schema";
import {DialogDescription} from "@radix-ui/react-dialog";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string, files: File[]) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      files: []
    }
  });

  const onSubmit = (data: FormValues) => {
    try {
      onCreate(data.title, data.files);
      toast.success("Post created successfully!");
      reset();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create post.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input placeholder="Post title" {...register("title")} />
          {errors.title?.message && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <Controller
            name="files"
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  field.onChange(files);
                }}
              />
            )}
          />
          {errors.files?.message && (
            <p className="text-red-500 text-sm">{errors.files.message}</p>
          )}

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              className="cursor-pointer"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              OK
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
