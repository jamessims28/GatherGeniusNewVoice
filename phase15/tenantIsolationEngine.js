
export function resolveTenantContext({ tenantId = "default", userKey = "anonymous_preview", role = "user" } = {}) {
  return {
    layer: "tenant_isolation_engine",
    tenantId,
    userKey,
    role,
    isolationMode: process.env.TENANT_ISOLATION_MODE || "strict",
    dataBoundary: `tenant:${tenantId}`,
    canCrossTenant: role === "super_admin",
    createdAt: new Date().toISOString()
  };
}

export function enforceTenantBoundary({ tenant = {}, resourceTenantId = "" } = {}) {
  const allowed = tenant.canCrossTenant || tenant.tenantId === resourceTenantId || !resourceTenantId;
  return {
    allowed,
    reason: allowed ? "tenant_boundary_allowed" : "tenant_boundary_blocked",
    tenantId: tenant.tenantId,
    resourceTenantId
  };
}
