import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCamera, FaPlus, FaTrash, FaSave, FaTimes, FaCheck
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../../../context/UserAuthContext";
import "./userprofile.css";

const UserProfile = () => {
  const { selectedAddress, setSelectedAddress } = useAuth();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    nanoid: "",
    profileImage: null,
    bannerImage: null,
  });

  const [addresses, setAddresses] = useState([]);
  const [originalProfile, setOriginalProfile] = useState({});
  const [originalAddresses, setOriginalAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://b-organics-backend.onrender.com/api/users/current", {
        withCredentials: true,
      });
      setProfile(res.data.profile);
      setAddresses(res.data.addresses || []);
      setOriginalProfile(res.data.profile);
      setOriginalAddresses(res.data.addresses || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setFeedback({ type: "error", message: "Failed to load profile details" });
      setLoading(false);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        label: "New Location",
        house: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        zip: "",
      },
    ]);
  };

  const handleDeleteAddress = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  const hasChanges =
    JSON.stringify(profile) !== JSON.stringify(originalProfile) ||
    JSON.stringify(addresses) !== JSON.stringify(originalAddresses);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update profile details
      await axios.put(
        `https://b-organics-backend.onrender.com/api/users/profile/${profile.nanoid}`,
        {
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          addresses: addresses
        },
        { withCredentials: true }
      );

      setOriginalProfile(profile);
      setOriginalAddresses(addresses);
      showFeedback("success", "Profile updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      showFeedback("error", "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showFeedback("error", "Image size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("nanoid", profile.nanoid);
    formData.append("type", type);

    try {
      const res = await axios.post(
        "https://b-organics-backend.onrender.com/api/users/profile/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      const updatedDetails = res.data.details;
      setProfile((prev) => ({
        ...prev,
        profileImage: updatedDetails.profileImage,
        bannerImage: updatedDetails.bannerImage,
      }));
      showFeedback("success", `${type === "banner" ? "Banner" : "Profile"} image updated!`);
    } catch (err) {
      console.error(`${type} upload error:`, err);
      showFeedback("error", `Failed to upload ${type}.`);
    }
  };

  if (loading) return <div className="profile-loading">Loading your premium experience...</div>;

  return (
    <div className="premium-profile-wrapper">
      {/* Dynamic Feedback Notification */}
      {feedback.message && (
        <div className={`feedback-toast ${feedback.type}`} data-aos="fade-down">
          {feedback.type === "success" ? <FaCheck /> : <FaTimes />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="banner-container">
          <img
            src={profile.bannerImage ? `data:image/jpeg;base64,${profile.bannerImage}` : "/default-banner.png"}
            alt="Banner"
            className="hero-banner"
          />
          <label className="banner-edit-btn">
            <FaCamera />
            <input type="file" onChange={(e) => handleImageUpload(e, "banner")} hidden />
          </label>
        </div>

        <div className="hero-content">
          <div className="avatar-container">
            <img
              src={profile.profileImage ? `data:image/jpeg;base64,${profile.profileImage}` : "/default-avatar.png"}
              alt="Profile"
              className="hero-avatar"
            />
            <label className="avatar-edit-btn">
              <FaCamera />
              <input type="file" onChange={(e) => handleImageUpload(e, "profile")} hidden />
            </label>
          </div>
          <div className="hero-text">
            <h1>{profile.fullName || "Valued Customer"}</h1>
            <p className="customer-id-tag">ID: {profile.nanoid}</p>
          </div>
        </div>
      </div>

      <div className="profile-main-grid">
        {/* Account Details Panel */}
        <div className="settings-panel" data-aos="fade-right">
          <div className="glass-card">
            <h2 className="section-title"><FaUser /> Personal Information</h2>
            <div className="input-group">
              <label><FaUser /> Full Name</label>
              <input
                value={profile.fullName}
                onChange={(e) => handleProfileChange("fullName", e.target.value)}
                placeholder="Ex: John Doe"
              />
            </div>
            <div className="input-group">
              <label><FaEnvelope /> Email Address</label>
              <input
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="input-group">
              <label><FaPhone /> Contact Number</label>
              <input
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                placeholder="+91 0000000000"
              />
            </div>
          </div>
        </div>

        {/* Addresses Panel */}
        <div className="address-panel" data-aos="fade-left">
          <div className="glass-card">
            <div className="section-header">
              <h2 className="section-title"><FaMapMarkerAlt /> Shipping Protocols</h2>
              <button className="add-address-pill" onClick={handleAddAddress}>
                <FaPlus /> Add Location
              </button>
            </div>

            <div className="address-scroll-area">
              {addresses.length > 0 ? (
                <>
                  {/* Active Selection Section */}
                  {selectedAddress && addresses.some(a => a.label === selectedAddress.label) && (
                    <div className="address-sub-section">
                      <h3 className="sub-section-title">PRIMARY LOGISTICS (ACTIVE)</h3>
                      {addresses.filter(a => a.label === selectedAddress.label).map((addr, index) => (
                        <div className="modern-address-card flagship" key={`active-${index}`} data-aos="zoom-in">
                          <div className="address-card-header selected-header">
                            <div className="header-left">
                              <input
                                className="label-input"
                                value={addr.label}
                                onChange={(e) => handleAddressChange(addresses.indexOf(addr), "label", e.target.value)}
                              />
                              <span className="selected-badge"><FaCheck /> ACTIVE SELECTION</span>
                            </div>
                            <button className="delete-icon-btn" onClick={() => handleDeleteAddress(addresses.indexOf(addr))}>
                              <FaTrash />
                            </button>
                          </div>
                          <div className="address-grid">
                            <input placeholder="Flat/House No." value={addr.house} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "house", e.target.value)} />
                            <input placeholder="Street/Area" value={addr.street} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "street", e.target.value)} />
                            <input placeholder="Landmark" value={addr.landmark} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "landmark", e.target.value)} />
                            <input placeholder="City" value={addr.city} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "city", e.target.value)} />
                            <input placeholder="State" value={addr.state} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "state", e.target.value)} />
                            <input placeholder="Pincode" value={addr.zip} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "zip", e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Alternatives Section */}
                  <div className="address-sub-section">
                    <h3 className="sub-section-title">ALTERNATIVE ARCHIVES</h3>
                    {addresses.filter(a => !selectedAddress || a.label !== selectedAddress.label).map((addr, index) => (
                      <div className="modern-address-card" key={`alt-${index}`} data-aos="zoom-in">
                        <div className="address-card-header">
                          <div className="header-left">
                            <input
                              className="label-input"
                              value={addr.label}
                              onChange={(e) => handleAddressChange(addresses.indexOf(addr), "label", e.target.value)}
                            />
                          </div>
                          <button className="delete-icon-btn" onClick={() => handleDeleteAddress(addresses.indexOf(addr))}>
                            <FaTrash />
                          </button>
                        </div>
                        <div className="address-grid">
                          <input placeholder="Flat/House No." value={addr.house} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "house", e.target.value)} />
                          <input placeholder="Street/Area" value={addr.street} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "street", e.target.value)} />
                          <input placeholder="Landmark" value={addr.landmark} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "landmark", e.target.value)} />
                          <input placeholder="City" value={addr.city} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "city", e.target.value)} />
                          <input placeholder="State" value={addr.state} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "state", e.target.value)} />
                          <input placeholder="Pincode" value={addr.zip} onChange={(e) => handleAddressChange(addresses.indexOf(addr), "zip", e.target.value)} />
                        </div>
                        <div className="address-actions">
                          <button
                            className="deliver-here-btn"
                            onClick={() => {
                              setSelectedAddress(addr);
                              showFeedback("success", `Primary logistics updated to ${addr.label}`);
                            }}
                          >
                            <FaMapMarkerAlt /> SET AS PRIMARY
                          </button>
                        </div>
                      </div>
                    ))}
                    {addresses.filter(a => !selectedAddress || a.label !== selectedAddress.label).length === 0 && (
                      <div className="empty-sub-section">No alternative addresses archived.</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-addresses">
                  <p>ZERO LOGISTICS RECORDS FOUND</p>
                  <span>Initialize your first shipping location above.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      {hasChanges && (
        <div className="floating-actions" data-aos="slide-up">
          <button className="cancel-pill" onClick={() => { setProfile(originalProfile); setAddresses(originalAddresses); }}>
            <FaTimes /> Discard
          </button>
          <button className="save-pill" onClick={handleSave} disabled={saving}>
            {saving ? <div className="spinner"></div> : <><FaSave /> Save Changes</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

