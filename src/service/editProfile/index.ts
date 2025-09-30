import $api from "@/http";

export interface UpdateProfilePayload {
  name?: string;
  lastName?: string;
  email?: string;
}

export async function updateProfile(data: UpdateProfilePayload) {
  const res = await $api.put("/profile", data);
  return res.data;
}

export async function updateCoverPhoto(file: File) {
  const formData = new FormData();
  formData.append("coverPhoto", file);

  const res = await $api.put("/profile/coverPhoto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function removeCoverPhoto() {
  const res = await $api.delete("/profile/coverPhoto");
  return res.data;
}
