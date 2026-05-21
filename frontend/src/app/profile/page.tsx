'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
  uploadUserAvatar,
} from '@/services/userService';

interface ProfileData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
  city?: string;
  district?: string;
  address?: string;
  language?: string;
  notifications?: boolean;
  marketingEmails?: boolean;
  emailVerified: boolean;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    city: '',
    district: '',
    address: '',
    language: '',
    notifications: true,
    marketingEmails: true,
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('hamroAuthToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetchUserProfile(token);
        setProfile(response.data.data);
        setFormValues({
          firstName: response.data.data.firstName || '',
          lastName: response.data.data.lastName || '',
          phoneNumber: response.data.data.phoneNumber || '',
          bio: response.data.data.bio || '',
          city: response.data.data.city || '',
          district: response.data.data.district || '',
          address: response.data.data.address || '',
          language: response.data.data.language || 'en',
          notifications: response.data.data.notifications ?? true,
          marketingEmails: response.data.data.marketingEmails ?? true,
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Unable to load profile. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, token]);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await updateUserProfile(token, {
        ...formValues,
      });
      setProfile(response.data.data);
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await changeUserPassword(token, passwordForm);
      setPasswordSuccess('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!token) {
      router.push('/login');
      return;
    }

    if (!file) {
      setUploadError('Please choose an image file to upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        setUploadError('Unable to read image file.');
        return;
      }

      try {
        const response = await uploadUserAvatar(token, result);
        setProfile(response.data.data);
        setUploadSuccess('Profile image uploaded successfully.');
      } catch (err: any) {
        setUploadError(err?.response?.data?.message || 'Image upload failed.');
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
          <p className="text-lg font-medium text-red-600">{error || 'No profile found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white py-10 px-4">
      <div className="container mx-auto grid gap-8 lg:grid-cols-[1.4fr,1fr]">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-white">{profile.firstName?.[0] || profile.email[0]}</div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{profile.firstName || 'User'} {profile.lastName || ''}</h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-500">{profile.role} • {profile.emailVerified ? 'Verified' : 'Unverified'}</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-dashed border-primary bg-primary/5 px-4 py-2 text-sm text-primary transition hover:bg-primary/10">
              <span>Upload profile image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleAvatarUpload(event.target.files?.[0] ?? null)}
              />
            </label>
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            {uploadSuccess && <p className="text-sm text-green-600">{uploadSuccess}</p>}
          </div>

          <div className="mt-10 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
              <p className="text-sm text-gray-600">Use the profile page to keep your account details updated and manage your personal settings.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href="/dashboard" className="block rounded-2xl bg-primary px-4 py-3 text-center text-white transition hover:bg-orange-500">Open dashboard</a>
                <a href="/" className="block rounded-2xl border border-gray-200 px-4 py-3 text-center text-gray-700 transition hover:bg-gray-100">Back to home</a>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Edit Profile</h2>
                <p className="text-sm text-gray-500">Keep your profile information up to date.</p>
              </div>
            </div>

            {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

            <form className="grid gap-4" onSubmit={handleUpdate}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">First Name</span>
                  <input
                    value={formValues.firstName}
                    onChange={(event) => setFormValues({ ...formValues, firstName: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Last Name</span>
                  <input
                    value={formValues.lastName}
                    onChange={(event) => setFormValues({ ...formValues, lastName: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Phone Number</span>
                  <input
                    value={formValues.phoneNumber}
                    onChange={(event) => setFormValues({ ...formValues, phoneNumber: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Preferred Language</span>
                  <input
                    value={formValues.language}
                    onChange={(event) => setFormValues({ ...formValues, language: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium">Bio</span>
                <textarea
                  value={formValues.bio}
                  onChange={(event) => setFormValues({ ...formValues, bio: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">City</span>
                  <input
                    value={formValues.city}
                    onChange={(event) => setFormValues({ ...formValues, city: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">District</span>
                  <input
                    value={formValues.district}
                    onChange={(event) => setFormValues({ ...formValues, district: event.target.value })}
                    className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </label>
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium">Address</span>
                <input
                  value={formValues.address}
                  onChange={(event) => setFormValues({ ...formValues, address: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formValues.notifications}
                    onChange={(event) => setFormValues({ ...formValues, notifications: event.target.checked })}
                  />
                  <span className="text-sm">Receive notifications</span>
                </label>
                <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formValues.marketingEmails}
                    onChange={(event) => setFormValues({ ...formValues, marketingEmails: event.target.checked })}
                  />
                  <span className="text-sm">Marketing emails</span>
                </label>
              </div>
              <button type="submit" className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-white font-semibold hover:bg-orange-500 transition">
                Save profile
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Security</h2>
              <p className="text-sm text-gray-500">Change your password to keep your account secure.</p>
            </div>

            {passwordError && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{passwordError}</div>}
            {passwordSuccess && <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{passwordSuccess}</div>}

            <form className="grid gap-4" onSubmit={handlePasswordChange}>
              <label className="space-y-2">
                <span className="text-sm font-medium">Current Password</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium">New Password</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
                  className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
              <button type="submit" className="mt-2 w-full rounded-xl bg-secondary px-4 py-3 text-white font-semibold hover:bg-blue-700 transition">
                Change password
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
