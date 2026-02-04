import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Spinner, Badge, Tabs } from '../../components/ui';

/**
 * Professional Profile Edit page.
 */
const ProfileEdit = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [profile, setProfile] = useState({
        full_name: '',
        title: '',
        bio: '',
        years_experience: 0,
        languages: [],
        country: '',
        city: '',
        timezone: '',
        specializations: [],
        education: [],
        certifications: [],
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setProfile(mockProfile);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saved profile:', profile);
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'specializations', label: 'Specializations' },
        { id: 'credentials', label: 'Credentials' },
        { id: 'video', label: 'Video Intro' },
    ];

    const specializations = [
        'Hatha Yoga', 'Vinyasa', 'Therapeutic Yoga', 'Prenatal Yoga', 'Sports Yoga',
        'Meditation', 'Stress Management', 'Weight Management', 'Sports Nutrition',
    ];

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-earth-900">Edit Profile</h1>
                        <p className="text-earth-500 mt-1">Manage your public-facing profile</p>
                    </div>
                    <Button variant="ghost" as={Link} to={`/professional/${profile.id}`} target="_blank">
                        Preview Profile
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-card">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    <div className="p-6">
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 bg-earth-200 rounded-full flex items-center justify-center text-3xl">
                                        📷
                                    </div>
                                    <div>
                                        <Button variant="ghost" size="sm">Upload Photo</Button>
                                        <p className="text-xs text-earth-500 mt-1">JPG or PNG, max 2MB</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Professional Title</label>
                                        <input
                                            type="text"
                                            value={profile.title}
                                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                            placeholder="e.g., Certified Yoga Therapist, RYT-500"
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-earth-700 mb-1">Bio</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        rows={5}
                                        placeholder="Tell clients about yourself, your approach, and why you became a professional..."
                                        className="w-full px-4 py-2 border border-earth-200 rounded-lg resize-none"
                                    />
                                    <p className="text-xs text-earth-500 mt-1">{profile.bio?.length || 0}/500 words</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Years of Experience</label>
                                        <input
                                            type="number"
                                            value={profile.years_experience}
                                            onChange={(e) => setProfile({ ...profile, years_experience: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Country</label>
                                        <select
                                            value={profile.country}
                                            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                        >
                                            <option value="US">United States</option>
                                            <option value="IN">India</option>
                                            <option value="UK">United Kingdom</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={profile.city}
                                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specializations' && (
                            <div>
                                <p className="text-earth-600 mb-4">Select your areas of expertise</p>
                                <div className="flex flex-wrap gap-2">
                                    {specializations.map((spec) => (
                                        <button
                                            key={spec}
                                            onClick={() => {
                                                const updated = profile.specializations.includes(spec)
                                                    ? profile.specializations.filter(s => s !== spec)
                                                    : [...profile.specializations, spec];
                                                setProfile({ ...profile, specializations: updated });
                                            }}
                                            className={`px-4 py-2 rounded-full text-sm transition-colors ${profile.specializations.includes(spec)
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                                                }`}
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'credentials' && (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-earth-900">Education</h3>
                                        <Button variant="ghost" size="sm">+ Add Degree</Button>
                                    </div>
                                    {profile.education?.map((edu, i) => (
                                        <div key={i} className="p-4 border border-earth-200 rounded-lg mb-2">
                                            <p className="font-medium">{edu.degree} in {edu.field}</p>
                                            <p className="text-sm text-earth-500">{edu.institution} • {edu.year}</p>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-earth-900">Certifications</h3>
                                        <Button variant="ghost" size="sm">+ Add Certification</Button>
                                    </div>
                                    {profile.certifications?.map((cert, i) => (
                                        <div key={i} className="p-4 border border-earth-200 rounded-lg mb-2 flex justify-between">
                                            <div>
                                                <p className="font-medium">{cert.name}</p>
                                                <p className="text-sm text-earth-500">{cert.organization} • Issued {cert.issue_date}</p>
                                            </div>
                                            <Badge variant="success">Verified</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'video' && (
                            <div className="text-center py-8">
                                <div className="w-32 h-32 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                    🎥
                                </div>
                                <h3 className="font-semibold text-earth-900 mb-2">Add Video Introduction</h3>
                                <p className="text-earth-500 mb-4 max-w-md mx-auto">
                                    Let clients get to know you! Record a 30-60 second intro video.
                                </p>
                                <Button variant="primary">Upload Video</Button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-earth-100 flex justify-end">
                        <Button variant="primary" onClick={handleSave} loading={saving}>
                            Save Profile
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mockProfile = {
    id: 1,
    full_name: 'Dr. Sarah Williams',
    title: 'Certified Yoga Therapist, RYT-500',
    bio: 'With over 10 years of experience in therapeutic yoga, I specialize in helping clients manage chronic pain and stress through personalized yoga practice.',
    years_experience: 10,
    languages: ['English', 'Hindi'],
    country: 'US',
    city: 'Los Angeles',
    timezone: 'America/Los_Angeles',
    specializations: ['Therapeutic Yoga', 'Stress Management'],
    education: [
        { degree: 'Masters', field: 'Yoga Therapy', institution: 'University of Mumbai', year: '2015' },
    ],
    certifications: [
        { name: 'RYT-500', organization: 'Yoga Alliance', issue_date: '2016' },
        { name: 'Therapeutic Yoga Specialist', organization: 'IAYT', issue_date: '2018' },
    ],
};

export default ProfileEdit;
