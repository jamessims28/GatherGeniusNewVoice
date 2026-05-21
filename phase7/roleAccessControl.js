
export const roles = {
  user: ["voice:use", "actions:view_own", "approvals:own"],
  vendor: ["vendor:profile", "vendor:leads", "actions:view_own"],
  operator: ["actions:review", "approvals:review", "observability:view"],
  admin: ["*"],
  investor: ["metrics:view", "observability:summary"]
};

export function resolveRole({ email = "", requestedRole = "user" } = {}) {
  const admins = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (admins.includes(String(email).toLowerCase())) return "admin";
  if (roles[requestedRole]) return requestedRole;
  return "user";
}

export function can(role = "user", permission = "") {
  const granted = roles[role] || roles.user;
  return granted.includes("*") || granted.includes(permission);
}

export function requirePermission({ role = "user", permission = "" } = {}) {
  const allowed = can(role, permission);
  return {
    allowed,
    role,
    permission,
    message: allowed ? "Access granted." : "Access denied."
  };
}
