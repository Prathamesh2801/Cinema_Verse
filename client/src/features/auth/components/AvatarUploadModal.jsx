/* Effects here legitimately sync with external state (object-URL lifecycle and
   resetting the form when the modal opens/closes). Opt out of the strict rule. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, ImageUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { uploadAvatar } from "../auth.api";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB — keep in sync with the server

export default function AvatarUploadModal({ open, onClose }) {
  const { token, updateAuth } = useAuth();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Build/tear down the object URL for the local preview.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Reset everything each time the modal opens/closes.
  useEffect(() => {
    if (!open) {
      setFile(null);
      setError("");
      setDragging(false);
      setUploading(false);
      setProgress(0);
    }
  }, [open]);

  const validateAndSet = (picked) => {
    if (!picked) return;
    if (!ALLOWED.includes(picked.type)) {
      setError("Please choose a JPEG, PNG, or WEBP image.");
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setError("");
    setFile(picked);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setProgress(0);
    try {
      const { user } = await uploadAvatar(file, token, (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
      });
      updateAuth({ user });
      toast.success("Profile photo updated");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={uploading ? undefined : onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 600,
            }}
          />

          {/* Centering wrapper — flexbox so Framer Motion's transform (scale/y)
              can't clobber the centering the way translate(-50%,-50%) would.
              pointer-events:none lets clicks fall through to the backdrop to close. */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 601,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              role="dialog"
              aria-modal="true"
              style={{
                width: "min(420px, 100%)",
                maxHeight: "90vh",
                overflowY: "auto",
                pointerEvents: "auto",
                background: "var(--color-bg-overlay)",
                border: "1px solid var(--color-gold-border)",
                borderRadius: "var(--radius-xl)",
                padding: 22,
                boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
              }}
            >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  margin: 0,
                }}
              >
                Update profile photo
              </h2>
              <button
                onClick={onClose}
                disabled={uploading}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                <X style={{ width: 14, height: 14, color: "var(--color-text-muted)" }} />
              </button>
            </div>

            {/* Drop zone / preview */}
            <div
              onClick={() => !uploading && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                if (!uploading) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={uploading ? undefined : handleDrop}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "28px 16px",
                borderRadius: "var(--radius-lg)",
                border: `1.5px dashed ${
                  dragging ? "var(--color-gold)" : "var(--color-gold-border)"
                }`,
                background: dragging
                  ? "var(--color-gold-glow)"
                  : "var(--color-bg-elevated)",
                cursor: uploading ? "default" : "pointer",
                transition: "border-color 0.2s, background 0.2s",
                textAlign: "center",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: "var(--radius-full)",
                    border: "2px solid var(--color-gold-border)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-gold-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ImageUp style={{ width: 24, height: 24, color: "var(--color-gold)" }} />
                </div>
              )}
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    margin: 0,
                  }}
                >
                  {previewUrl ? "Click to choose a different image" : "Click or drag an image here"}
                </p>
                <p style={{ fontSize: 11, color: "var(--color-text-muted)", margin: "4px 0 0" }}>
                  JPEG, PNG, or WEBP · up to 5 MB
                </p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => validateAndSet(e.target.files?.[0])}
              style={{ display: "none" }}
            />

            {/* Error */}
            {error && (
              <p
                style={{
                  fontSize: 12,
                  color: "#f87171",
                  margin: "12px 0 0",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            {/* Progress */}
            {uploading && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    height: 6,
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-bg-elevated)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                    style={{
                      height: "100%",
                      background: "var(--color-gold)",
                      borderRadius: "var(--radius-full)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    margin: "6px 0 0",
                    textAlign: "center",
                  }}
                >
                  Uploading… {progress}%
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={onClose}
                disabled={uploading}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "var(--radius-md)",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: file && !uploading ? 0.98 : 1 }}
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "11px",
                  borderRadius: "var(--radius-md)",
                  background:
                    !file || uploading
                      ? "var(--color-gold-dim)"
                      : "var(--color-gold)",
                  border: "none",
                  color: "var(--color-bg)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: !file || uploading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: !file ? 0.6 : 1,
                }}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                {uploading ? "Uploading" : "Upload"}
              </motion.button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
