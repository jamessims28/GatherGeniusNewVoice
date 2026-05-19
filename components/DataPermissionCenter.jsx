"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { buildPermissionDefaults, getApprovedContextSummary, permissionCatalog } from "../lib/permissions/permissionCatalog";

const STORAGE_KEY = "gathergenius-data-permissions";

export default function DataPermissionCenter({ compact = true, onPermissionsChange }) {
  const [permissions, setPermissions] = useState(buildPermissionDefaults());
  const [message, setMessage] = useState("I’ll only use approved data in the background.");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing) setPermissions({ ...buildPermissionDefaults(), ...JSON.parse(existing) });
    } catch {
      setMessage("I had trouble reading saved permissions. You can continue, but I may ask again if I need access.");
    }
  }, []);

  useEffect(() => {
    onPermissionsChange?.(permissions);
  }, [permissions, onPermissionsChange]);

  const approvedSummary = useMemo(() => getApprovedContextSummary(permissions), [permissions]);

  function save(nextPermissions, note = "Permissions updated in the background.") {
    setPermissions(nextPermissions);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPermissions));
      fetch("/api/permissions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: nextPermissions })
      }).then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.mode === "local-only") {
          setMessage(data.message || "Saved locally. Database permission sync needs attention.");
        } else {
          setMessage(note);
        }
      }).catch(() => {
        setMessage("Saved locally. I could not sync permissions to the database right now.");
      });
    } catch {
      setMessage("I could not save permissions. Please check browser storage or database settings.");
    }
  }

  function approveRecommended() {
    save(buildPermissionDefaults(), "Recommended permissions approved in the background.");
  }

  function denyAll() {
    const next = permissionCatalog.reduce((acc, item) => ({ ...acc, [item.id]: false }), {});
    save(next, "All optional permissions are off. I’ll ask before using anything else.");
  }

  function requestPermission(id) {
    const item = permissionCatalog.find((permission) => permission.id === id);
    const next = { ...permissions, [id]: true };
    save(next, `${item?.shortTitle || "Permission"} approved. I’ll use it only when it helps the experience.`);
  }

  return (
    <div className="gg-permission-minimal">
      <div>
        <span className="gg-status good">Background Permissions</span>
        <p className="gg-note">
          {message}
        </p>
        <p className="gg-note">
          Approved: <strong>{approvedSummary}</strong>
        </p>
      </div>

      <div className="gg-permission-minimal-actions">
        <motion.button type="button" className="gg-btn green" whileTap={{ scale: 0.98 }} onClick={approveRecommended}>
          ALLOW RECOMMENDED
        </motion.button>
        <motion.button type="button" className="gg-btn secondary" whileTap={{ scale: 0.98 }} onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "HIDE" : "CHANGE"}
        </motion.button>
      </div>

      {showDetails && (
        <div className="gg-permission-hidden-list">
          <p className="gg-note">GatherGenius may ask before turning on a data point in the background.</p>
          {permissionCatalog.map((item) => (
            <button key={item.id} type="button" className={`gg-permission-row ${permissions[item.id] ? "active" : ""}`} onClick={() => requestPermission(item.id)}>
              <span>{item.shortTitle}</span>
              <b>{permissions[item.id] ? "Allowed" : "Ask / Allow"}</b>
            </button>
          ))}
          <button type="button" className="gg-btn secondary" onClick={denyAll}>TURN OPTIONAL ACCESS OFF</button>
        </div>
      )}
    </div>
  );
}
