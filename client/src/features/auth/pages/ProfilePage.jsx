import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, AtSign, Image as ImageIcon, Lock, Save, KeyRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../auth.api";
import Avatar from "../components/Avatar";

/* ── Shared field ── */
function Field({ icon: Icon, label, hint, ...inputProps }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-text-muted)",
          marginBottom: 7,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon
          className="w-4 h-4"
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-muted)",
          }}
        />
        <input
          {...inputProps}
          style={{
            width: "100%",
            padding: "12px 14px 12px 40px",
            background: "var(--color-bg-overlay)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-primary)",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-gold-border)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-gold-glow)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      {hint && (
        <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "6px 0 0" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ── Card wrapper ── */
function Card({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        padding: "24px 22px",
        marginBottom: 20,
      }}
    >
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "var(--color-text-primary)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "5px 0 20px" }}>
          {subtitle}
        </p>
      )}
      <div style={{ marginTop: subtitle ? 0 : 18 }}>{children}</div>
    </div>
  );
}

function SubmitButton({ loading, icon: Icon, children }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.01 }}
      whileTap={{ scale: loading ? 1 : 0.99 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "11px 20px",
        background: loading ? "var(--color-gold-dim)" : "var(--color-gold)",
        border: "none",
        borderRadius: "var(--radius-md)",
        color: "var(--color-bg)",
        fontSize: 13,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
      }}
    >
      <Icon className="w-4 h-4" />
      {children}
    </motion.button>
  );
}

export default function ProfilePage() {
  const { user, token, updateAuth } = useAuth();

  // ── Profile details form ──
  const [details, setDetails] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    avatar: user?.avatar || "",
  });
  const [savingDetails, setSavingDetails] = useState(false);

  // ── Password form ──
  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPw, setSavingPw] = useState(false);

  const detailsDirty =
    details.fullName !== (user?.fullName || "") ||
    details.username !== (user?.username || "") ||
    details.avatar !== (user?.avatar || "");

  const previewUser = { ...user, ...details };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!detailsDirty) return;
    setSavingDetails(true);
    try {
      const res = await updateProfile(
        {
          fullName: details.fullName,
          username: details.username,
          avatar: details.avatar,
        },
        token,
      );
      updateAuth(res); // { token, user }
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingDetails(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(
        { currentPassword: pw.currentPassword, newPassword: pw.newPassword },
        token,
      );
      toast.success("Password updated");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 620,
        margin: "0 auto",
        padding: "28px 16px 90px",
      }}
    >
      {/* ── Header with live avatar preview ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Avatar user={previewUser} size={64} />
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
              margin: 0,
            }}
          >
            {details.fullName || user?.username || "Your Profile"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: "3px 0 0" }}>
            @{details.username || user?.username}
          </p>
        </div>
      </div>

      {/* ── Profile details ── */}
      <Card title="Profile details" subtitle="Update your name, handle, and photo.">
        <form onSubmit={handleDetailsSubmit}>
          <Field
            icon={User}
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Your full name"
            value={details.fullName}
            maxLength={60}
            onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
          />
          <Field
            icon={AtSign}
            label="Username"
            name="username"
            type="text"
            placeholder="username"
            value={details.username}
            onChange={(e) => setDetails({ ...details, username: e.target.value })}
            hint="At least 3 characters. Must be unique."
          />
          <Field
            icon={ImageIcon}
            label="Avatar image URL"
            name="avatar"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={details.avatar}
            onChange={(e) => setDetails({ ...details, avatar: e.target.value })}
            hint="Paste a link to an image. Leave empty to use your initials."
          />
          <SubmitButton loading={savingDetails} icon={Save}>
            {savingDetails ? "Saving…" : "Save changes"}
          </SubmitButton>
        </form>
      </Card>

      {/* ── Change password ── */}
      <Card title="Change password" subtitle="Choose a strong password you don't use elsewhere.">
        <form onSubmit={handlePasswordSubmit}>
          <Field
            icon={Lock}
            label="Current password"
            name="currentPassword"
            type="password"
            placeholder="••••••••"
            value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
          />
          <Field
            icon={KeyRound}
            label="New password"
            name="newPassword"
            type="password"
            placeholder="At least 4 characters"
            value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
          />
          <Field
            icon={KeyRound}
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={pw.confirmPassword}
            onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })}
          />
          <SubmitButton loading={savingPw} icon={KeyRound}>
            {savingPw ? "Updating…" : "Update password"}
          </SubmitButton>
        </form>
      </Card>
    </motion.main>
  );
}
