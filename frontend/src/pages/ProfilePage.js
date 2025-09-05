import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Lock, 
  Eye, 
  EyeOff,
  ShoppingBag,
  Heart,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPassword
  } = useForm();

  const newPassword = watchPassword('newPassword');

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      await userAPI.updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      resetPassword();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Please log in</h2>
          <p className="text-neutral-600 mb-8">You need to be logged in to view your profile</p>
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">My Profile</h1>
          <p className="text-neutral-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-800">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline flex items-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={20} className="text-neutral-400" />
                        </div>
                        <input
                          {...registerProfile('fullName', {
                            required: 'Full name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                          })}
                          type="text"
                          className="input-field pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {profileErrors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{profileErrors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={20} className="text-neutral-400" />
                        </div>
                        <input
                          {...registerProfile('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          type="email"
                          className="input-field pl-10"
                          placeholder="Enter your email"
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-red-500">{profileErrors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={20} className="text-neutral-400" />
                        </div>
                        <input
                          {...registerProfile('phone', {
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[\+]?[1-9][\d]{0,15}$/,
                              message: 'Invalid phone number',
                            },
                          })}
                          type="tel"
                          className="input-field pl-10"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {profileErrors.phone && (
                        <p className="mt-1 text-sm text-red-500">{profileErrors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={20} className="text-neutral-400" />
                        </div>
                        <input
                          {...registerProfile('address')}
                          type="text"
                          className="input-field pl-10"
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-outline flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">
                        {user.fullName || 'No name provided'}
                      </h3>
                      <p className="text-neutral-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Full Name</label>
                      <p className="text-neutral-800">{user.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Email</label>
                      <p className="text-neutral-800">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Phone</label>
                      <p className="text-neutral-800">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Address</label>
                      <p className="text-neutral-800">{user.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl p-6 shadow-soft mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-neutral-800">Security</h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="btn-outline flex items-center gap-2"
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={20} className="text-neutral-400" />
                      </div>
                      <input
                        {...registerPassword('currentPassword', {
                          required: 'Current password is required',
                        })}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="input-field pl-10 pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={20} className="text-neutral-400" />
                      </div>
                      <input
                        {...registerPassword('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                          },
                        })}
                        type={showNewPassword ? 'text' : 'password'}
                        className="input-field pl-10 pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={20} className="text-neutral-400" />
                      </div>
                      <input
                        {...registerPassword('confirmPassword', {
                          required: 'Please confirm your new password',
                          validate: (value) =>
                            value === newPassword || 'Passwords do not match',
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input-field pl-10 pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} />
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="btn-outline flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-neutral-600">
                  <p>Keep your account secure with a strong password</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <ShoppingBag size={20} className="text-primary-600" />
                    <span className="text-neutral-700">My Orders</span>
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <Heart size={20} className="text-red-600" />
                    <span className="text-neutral-700">Wishlist</span>
                  </Link>
                  <Link
                    to="/products"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <Settings size={20} className="text-neutral-600" />
                    <span className="text-neutral-700">Browse Products</span>
                  </Link>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Account</h3>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
