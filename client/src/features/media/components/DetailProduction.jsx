import { motion } from "framer-motion";
import { Building2, Users, Tv2 } from "lucide-react";
import { getImageUrl, IMAGE_SIZES } from "../../../utils/image";

function SectionHeading({ icon: Icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon className="w-4 h-4" style={{ color: "var(--color-gold-dim)" }} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function CompanyLogo({ company }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        padding: "12px 14px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        minWidth: 90,
        flex: "1 1 90px",
        maxWidth: 140,
        textAlign: "center",
      }}
    >
      {company.logo_path ? (
        <div
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={getImageUrl(company.logo_path, IMAGE_SIZES.verySmall)}
            alt={company.name}
            style={{
              maxHeight: 32,
              maxWidth: 80,
              objectFit: "contain",
              filter: "brightness(0) invert(0.8)",
              opacity: 0.7,
            }}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            background: "var(--color-bg-overlay)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
        </div>
      )}
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}
      >
        {company.name}
      </span>
    </div>
  );
}

function CreatorCard({ creator }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        flex: "1 1 160px",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          background: "var(--color-bg-overlay)",
          flexShrink: 0,
          border: "1px solid var(--color-gold-border)",
        }}
      >
        {creator.profile_path ? (
          <img
            src={getImageUrl(creator.profile_path,IMAGE_SIZES.verySmall)}
            alt={creator.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>
          {creator.name}
        </p>
        <p style={{ fontSize: 10, color: "var(--color-gold-dim)", margin: "2px 0 0", fontWeight: 500 }}>
          Creator
        </p>
      </div>
    </div>
  );
}

export default function DetailProduction({ data, type }) {
  const isTV    = type === "tv";
  const companies = data.production_companies ?? [];
  const creators  = data.created_by ?? [];
  const networks  = data.networks ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      style={{ marginBottom: 32 }}
    >
      {/* Created by — TV only */}
      {isTV && creators.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <SectionHeading icon={Users} label="Created By" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {creators.map((c) => <CreatorCard key={c.id} creator={c} />)}
          </div>
        </div>
      )}

      {/* Networks — TV only */}
      {isTV && networks.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <SectionHeading icon={Tv2} label="Networks" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {networks.map((n) => <CompanyLogo key={n.id} company={n} />)}
          </div>
        </div>
      )}

      {/* Production companies */}
      {companies.length > 0 && (
        <div>
          <SectionHeading icon={Building2} label="Production" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {companies.map((c) => <CompanyLogo key={c.id} company={c} />)}
          </div>
        </div>
      )}
    </motion.section>
  );
}
