import { useState } from "react";
import {
  Eye,
  EyeOff,
  UserCircle2,
  Camera,
  Save,
  LockKeyhole,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { profileApi } from "../api/profile";

export default function Settings() {
  const { user, updateUser } = useAuth();

  // Profile
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

const [preview, setPreview] = useState(
  user?.profile_image
    ? `http://localhost:5000${user.profile_image}`
    : null
);

const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      const res = await profileApi.updateProfile({
        full_name: fullName,
      });

      updateUser(res.data);

      toast.success("Profile updated successfully!");

    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange() {
    try {
      setUpdatingPassword(true);

      const res = await profileApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      toast.success(res.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  }

  function handlePhotoChange(e) {
  const file = e.target.files[0];

  if (!file) return;

  setSelectedPhoto(file);

  setPreview(URL.createObjectURL(file));
}

async function handlePhotoUpload() {
  if (!selectedPhoto) {
    toast.error("Please select an image.");
    return;
  }

  try {
    setUploadingPhoto(true);

    const res = await profileApi.uploadPhoto(selectedPhoto);

    updateUser(res.data);

    setPreview(
      `http://localhost:5000${res.data.profile_image}`
    );

    toast.success("Profile picture updated!");

  } catch (err) {
    toast.error(err.message);
  } finally {
    setUploadingPhoto(false);
  }
}

async function handleRemovePhoto() {
  try {
    const res = await profileApi.removePhoto();

    updateUser(res.data);

    setSelectedPhoto(null);
    setPreview(null);

    document.getElementById("profilePhoto").value = "";

    toast.success("Profile picture removed.");

  } catch (err) {
    toast.error(err.message);
  }
}

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          ⚙️ Settings
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your account settings.
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-md p-8">

        <div className="flex items-center gap-3 mb-8">
          <UserCircle2
            className="text-blue-600"
            size={30}
          />

          <h2 className="text-2xl font-bold">
            Account Information
          </h2>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">

  {/* Profile Image */}
  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shadow">

    {preview ? (
      <img
        src={preview}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <UserCircle2
        size={90}
        className="text-slate-500"
      />
    )}

  </div>

  {/* Choose Image */}
  <input
  id="profilePhoto"
  type="file"
  accept="image/*"
  onChange={handlePhotoChange}
  className="hidden"
/>

<label
  htmlFor="profilePhoto"
  className="mt-5 cursor-pointer bg-slate-200 hover:bg-slate-300 px-5 py-2 rounded-lg transition"
>
  📷 Choose Photo
</label>

<p className="mt-3 text-sm text-slate-500">
  {selectedPhoto
    ? selectedPhoto.name.length > 20
      ? selectedPhoto.name.substring(0, 20) + "..."
      : selectedPhoto.name
    : "No image selected"}
</p>

  {/* Upload Button */}
  <div className="flex gap-3 mt-4">

  <button
    onClick={handlePhotoUpload}
    disabled={uploadingPhoto || !selectedPhoto}
    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50"
  >
    <Camera size={18} />
    {uploadingPhoto ? "Uploading..." : "Upload"}
  </button>

  <button
  onClick={handleRemovePhoto}
  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
>
  Remove
</button>

</div>
</div>

        {/* Full Name */}
        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        {/* Email */}
        <div className="mb-8">

          <label className="block font-semibold mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-slate-500"
          />

        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
        >
          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-md p-8">

        <div className="flex items-center gap-3 mb-8">

          <LockKeyhole
            className="text-green-600"
            size={28}
          />

          <h2 className="text-2xl font-bold">
            Security
          </h2>

        </div>

        {/* Current Password */}
        <div className="mb-6">

          <label className="block font-semibold mb-2">
            Current Password
          </label>

          <div className="relative">

            <input
              type={
                showCurrent
                  ? "text"
                  : "password"
              }
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrent(!showCurrent)
              }
              className="absolute right-4 top-3"
            >
              {showCurrent ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* New Password */}
        <div className="mb-6">

          <label className="block font-semibold mb-2">
            New Password
          </label>

          <div className="relative">

            <input
              type={
                showNew
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
              className="absolute right-4 top-3"
            >
              {showNew ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* Confirm Password */}
        <div className="mb-8">

          <label className="block font-semibold mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 pr-12"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(!showConfirm)
              }
              className="absolute right-4 top-3"
            >
              {showConfirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        <button
          onClick={handlePasswordChange}
          disabled={updatingPassword}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
        >
          <LockKeyhole size={18} />

          {updatingPassword
            ? "Updating..."
            : "Update Password"}
        </button>

      </div>

    </div>
  );
}