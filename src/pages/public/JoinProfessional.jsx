import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '../../components/ui';
import apiClient from '../../services/api';

/**
 * JoinProfessional - Application form for new professionals.
 */
const JoinProfessional = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        age: '', gender: '', country: '', city: '',
        profession: '', years_experience: '',
        bio: '',
        credentials: [''], // Array of strings
        idProof: null, // File object (mock)
        certificate: null // File object (mock)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCredentialChange = (index, value) => {
        const newCreds = [...formData.credentials];
        newCreds[index] = value;
        setFormData(prev => ({ ...prev, credentials: newCreds }));
    };

    const addCredential = () => {
        setFormData(prev => ({ ...prev, credentials: [...prev.credentials, ''] }));
    };

    const removeCredential = (index) => {
        const newCreds = formData.credentials.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, credentials: newCreds }));
    };

    const handleFileChange = (e) => {
        // In a real app, upload 
        // For now, we just store the name to simulate
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Transform data for API
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                age: parseInt(formData.age) || 0,
                gender: formData.gender,
                country: formData.country,
                city: formData.city,
                profession: formData.profession,
                years_experience: parseInt(formData.years_experience) || 0,
                bio: formData.bio,
                credentials: formData.credentials.filter(c => c.trim() !== ''),
                documents: [
                    { name: formData.idProof?.name || 'ID Proof', url: 'https://placehold.co/600x400?text=ID+Proof+Document', type: 'id' },
                    { name: formData.certificate?.name || 'Certificate', url: 'https://placehold.co/600x400?text=Certificate+Document', type: 'certificate' }
                ]
            };

            await apiClient.post('/api/apply/professional', payload);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-earth-50 pt-32 pb-12 flex items-center justify-center">
                <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-card text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h2 className="text-2xl font-bold text-earth-900 mb-4">Application Submitted!</h2>
                    <p className="text-earth-600 mb-8">
                        Thank you for your interest in joining Kaivalya. Our team will review your application and credential documents.
                        <br /><br />
                        You will receive an email with your login credentials once your application is approved (usually within 24-48 hours).
                    </p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-earth-50 pt-28 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-earth-900">Join Our Professional Network</h1>
                    <p className="text-earth-600 mt-2">Share your expertise and grow your practice with Kaivalya</p>
                </div>

                <div className="bg-white rounded-2xl shadow-card p-8">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8 gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-400'}`}>1</div>
                        <div className={`h-1 w-16 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-earth-100'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-400'}`}>2</div>
                        <div className={`h-1 w-16 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-earth-100'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-400'}`}>3</div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Personal Details */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-xl font-semibold text-earth-900 border-b border-earth-100 pb-2">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Full Name *</label>
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Dr. Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Email Address *</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Phone Number *</label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-earth-700 mb-1">Age *</label>
                                            <input
                                                required
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-earth-700 mb-1">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="">Select...</option>
                                                <option value="female">Female</option>
                                                <option value="male">Male</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Country *</label>
                                        <input
                                            required
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">City *</label>
                                        <input
                                            required
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="button" onClick={() => setStep(2)}>Next Step →</Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Professional Details */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-xl font-semibold text-earth-900 border-b border-earth-100 pb-2">Professional Expertise</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Profession / Title *</label>
                                        <select
                                            required
                                            name="profession"
                                            value={formData.profession}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">Select your specialisation...</option>
                                            <option value="Yoga Therapist">Yoga Therapist</option>
                                            <option value="Ayurvedic Doctor">Ayurvedic Doctor</option>
                                            <option value="Psychologist">Psychologist</option>
                                            <option value="Nutritionist">Nutritionist</option>
                                            <option value="Physiotherapist">Physiotherapist</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Years of Experience *</label>
                                        <input
                                            required
                                            type="number"
                                            name="years_experience"
                                            value={formData.years_experience}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-1">Professional Bio *</label>
                                        <textarea
                                            required
                                            rows={4}
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                            placeholder="Tell us about your background, approach, and philosophy..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-earth-700 mb-2">Qualifications / Credentials</label>
                                        {formData.credentials.map((cred, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    value={cred}
                                                    onChange={(e) => handleCredentialChange(index, e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="e.g. Master in Yoga Science"
                                                />
                                                {formData.credentials.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCredential(index)}
                                                        className="text-red-500 hover:text-red-700 px-2"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addCredential}
                                            className="text-primary-600 text-sm font-medium hover:text-primary-700 mt-1"
                                        >
                                            + Add Another Credential
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                                    <Button type="button" onClick={() => setStep(3)}>Next Step →</Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Documents & Submit */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-xl font-semibold text-earth-900 border-b border-earth-100 pb-2">Documentation Verification</h3>
                                <p className="text-sm text-earth-600">Please upload clear copies of your documents. These will be reviewed by our team.</p>

                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-earth-200 rounded-xl p-6 text-center hover:bg-earth-50 transition-colors">
                                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                            🆔
                                        </div>
                                        <h4 className="font-semibold text-earth-900">ID Proof / Passport</h4>
                                        <p className="text-xs text-earth-500 mb-4">Government issued identification (JPG, PDF)</p>
                                        <input
                                            type="file"
                                            name="idProof"
                                            id="idProof"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="idProof" className="cursor-pointer inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-50">
                                            {formData.idProof ? `✓ ${formData.idProof.name}` : 'Upload ID Proof'}
                                        </label>
                                    </div>

                                    <div className="border-2 border-dashed border-earth-200 rounded-xl p-6 text-center hover:bg-earth-50 transition-colors">
                                        <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                                            🎓
                                        </div>
                                        <h4 className="font-semibold text-earth-900">Professional Certificate</h4>
                                        <p className="text-xs text-earth-500 mb-4">Degree or Certification Proof (JPG, PDF)</p>
                                        <input
                                            type="file"
                                            name="certificate"
                                            id="certificate"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label htmlFor="certificate" className="cursor-pointer inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-50">
                                            {formData.certificate ? `✓ ${formData.certificate.name}` : 'Upload Certificate'}
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-800">
                                    <span className="text-lg">ℹ️</span>
                                    <p>By submitting this application, you confirm that all provided information is accurate. False information may lead to permanent ban from the platform.</p>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="bg-accent hover:bg-accent-hover"
                                        loading={loading}
                                        disabled={!formData.idProof || !formData.certificate}
                                    >
                                        Submit Application
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinProfessional;
