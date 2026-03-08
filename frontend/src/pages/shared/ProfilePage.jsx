import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
    const { user: authUser, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const getPhotoUrl = (user) => {
        if (!user || !user.profilePhoto || user.profilePhoto === 'no-photo.jpg') {
            return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=14b8a6&color=fff&size=200&font-size=0.4&bold=true`;
        }
        if (user.profilePhoto.startsWith('http')) return user.profilePhoto;
        const baseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return user.profilePhoto.startsWith('/uploads')
            ? `${baseURL}${user.profilePhoto}`
            : `${baseURL}/uploads/profiles/${user.profilePhoto}`;
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setProfile(res.data.data);
            setName(res.data.data.name);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess('');
        try {
            const res = await api.put('/auth/updateprofile', { name });
            setProfile(res.data.data);
            updateUser(res.data.data);
            setEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingPhoto(true);
        setSuccess('');
        try {
            const formData = new FormData();
            formData.append('photo', file);
            const res = await api.put('/auth/uploadphoto', formData);
            setProfile(res.data.data);
            updateUser(res.data.data);
            setSuccess('Profile photo updated successfully!');
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-slate-500">
                    <span className="material-symbols-rounded animate-spin text-4xl mb-2 block">sync</span>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center text-red-500 p-8">
                Failed to load profile data.
            </div>
        );
    }

    const infoItems = [
        { icon: 'mail', label: 'Email', value: profile.email },
        { icon: 'badge', label: 'Role', value: profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1) },
        ...(profile.role === 'student' ? [{ icon: 'school', label: 'Semester', value: `Semester ${profile.semester}` }] : []),
        { icon: 'calendar_today', label: 'Member Since', value: new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    ];

    return (
        <div className="max-w-3xl mx-auto mt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-6 py-4 rounded-2xl font-semibold flex items-center gap-3">
                    <span className="material-symbols-rounded">check_circle</span>
                    {success}
                </div>
            )}

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <img
                            alt="Profile Avatar"
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md"
                            src={getPhotoUrl(profile)}
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                            {uploadingPhoto ? <span className="material-symbols-rounded animate-spin">sync</span> : <span className="material-symbols-rounded text-2xl">photo_camera</span>}
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                        </label>
                    </div>
                    <div className="text-center sm:text-left flex-grow">
                        {editing ? (
                            <form onSubmit={handleSave} className="flex flex-col sm:flex-row items-center gap-3">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="text-2xl font-bold px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white w-full sm:w-auto"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-primary hover:bg-teal-500 text-slate-900 px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-rounded text-sm">save</span>
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEditing(false); setName(profile.name); }}
                                        className="px-5 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{profile.name}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
                            </>
                        )}
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0"
                        >
                            <span className="material-symbols-rounded text-sm">edit</span>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Details Card */}
            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">info</span>
                    Account Details
                </h3>
                <div className="space-y-1">
                    {infoItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-rounded text-xl">{item.icon}</span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-rounded text-primary">verified_user</span>
                    Account Status
                </h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl font-semibold text-sm">
                        <span className="material-symbols-rounded text-sm">check_circle</span>
                        Email Verified
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl font-semibold text-sm">
                        <span className="material-symbols-rounded text-sm">shield</span>
                        Account Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
