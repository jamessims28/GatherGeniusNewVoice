import BackButton from "../../components/BackButton";
import DataPermissionCenter from "../../components/DataPermissionCenter";

export default function PermissionsPage() {
  return (
    <main className="gg-shell">
      <nav className="gg-nav">
        <div className="gg-brand"><div className="gg-logo" /><div><h1>Privacy</h1><span>Background Permissions</span></div></div>
        <div className="gg-actions"><BackButton /><a className="gg-pill" href="/">Home</a></div>
      </nav>
      <section className="gg-section">
        <div className="gg-card">
          <span className="gg-status good">Minimal Control</span>
          <h2 style={{ marginTop: 16 }}>GatherGenius will ask before using new data.</h2>
          <p className="gg-note">Permissions are handled quietly in the background. If something fails, GatherGenius will explain the issue clearly.</p>
          <DataPermissionCenter compact />
        </div>
      </section>
    </main>
  );
}
