
export function updateOperationalMemoryLedger({ memory = {}, command = {}, incident = {}, escalation = {} } = {}) {
  const entries = [
    ...(memory.operationalLedger || []),
    {
      command: command.primaryCommand,
      incidentSeverity: incident.severity,
      escalationStatus: escalation.status,
      at: new Date().toISOString()
    }
  ].slice(-300);

  const patterns = {
    incidentCount: entries.filter((entry) => entry.incidentSeverity && entry.incidentSeverity !== "low").length,
    highSeverityCount: entries.filter((entry) => entry.incidentSeverity === "high").length,
    escalationCount: entries.filter((entry) => entry.escalationStatus === "escalation_prepared").length
  };

  return {
    layer: "operational_memory_ledger",
    entries,
    patterns,
    summary: `Operational ledger updated with ${entries.length} event(s).`
  };
}
