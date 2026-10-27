import { useEffect, useState } from "react";
import "./App.css";

type Device = {
  id: number;
  name: string;
  type: string;
  status: "Connected" | "Offline";
};

const initialDevices: Device[] = [
  { id: 1, name: "My Computer", type: "Desktop", status: "Connected" },
  { id: 2, name: "Android Device", type: "Mobile", status: "Offline" },
];

const navItems = [
  { label: "Dashboard", icon: "▦" },
  { label: "Devices", icon: "▣" },
  { label: "Activity", icon: "◷" },
  { label: "Security", icon: "◇" },
  { label: "Settings", icon: "⚙" },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [devices, setDevices] = useState<Device[]>(() => {
    try {
      const savedDevices = localStorage.getItem("hack-control-devices");

      if (savedDevices !== null) {
        return JSON.parse(savedDevices) as Device[];
      }
    } catch {
      console.warn("Could not load saved devices.");
    }

    return initialDevices;
  });
  const [showModal, setShowModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("hack-control-devices", JSON.stringify(devices));
  }, [devices]);

  function addDevice() {
    const name = deviceName.trim();

    if (!name) {
      setNotice("Please enter a device name.");
      return;
    }

    setDevices((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        type: "Device",
        status: "Offline",
      },
    ]);

    setDeviceName("");
    setShowModal(false);
    setNotice("Device added locally. Pairing is not connected yet.");
  }

  function selectPage(page: string) {
    setActivePage(page);
    setNotice("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">H</div>
          <div>
            <h2>HACK</h2>
            <span>CONTROL CENTER</span>
          </div>
        </div>

        <div className="nav-caption">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                activePage === item.label ? "active" : ""
              }`}
              onClick={() => selectPage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activePage === item.label && (
                <span className="active-dot" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <div className="security-icon">◇</div>
            <strong>Your security matters</strong>
            <p>
              Connect only devices you own or have permission to manage.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">HC</div>
            <div className="profile-info">
              <strong>Local Workspace</strong>
              <span>Personal account</span>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <span className="local-badge">
              <span className="status-dot" />
              LOCAL MODE
            </span>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setNotice("You're all caught up.")}
            >
              ♧
            </button>
            <div className="small-avatar">HC</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">CONTROL CENTER / OVERVIEW</div>
              <h1>
                {activePage === "Dashboard"
                  ? "Welcome back."
                  : activePage}
              </h1>
              <p className="page-subtitle">
                {activePage === "Dashboard"
                  ? "Your workspace at a glance. Everything in one place."
                  : `Manage your ${activePage.toLowerCase()} workspace.`}
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setDeviceName("");
                setShowModal(true);
              }}
            >
              <span>＋</span> Add Device
            </button>
          </div>

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                ×
              </button>
            </div>
          )}

          {activePage === "Dashboard" && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">TOTAL DEVICES</span>
                    <span className="stat-icon pink">▣</span>
                  </div>
                  <div className="stat-value">{devices.length}</div>
                  <div className="stat-foot">Devices in this workspace</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">CONNECTED</span>
                    <span className="stat-icon green">⌁</span>
                  </div>
                  <div className="stat-value">
                    {devices.filter((d) => d.status === "Connected").length}
                  </div>
                  <div className="stat-foot">Currently marked online</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">OFFLINE</span>
                    <span className="stat-icon orange">◷</span>
                  </div>
                  <div className="stat-value">
                    {devices.filter((d) => d.status === "Offline").length}
                  </div>
                  <div className="stat-foot">Not currently connected</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">SECURITY STATUS</span>
                    <span className="stat-icon blue">◇</span>
                  </div>
                  <div className="security-value">Local</div>
                  <div className="stat-foot">No remote connection enabled</div>
                </div>
              </div>

              <div className="content-grid">
                <section className="panel devices-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Your Devices</h2>
                      <p>Devices listed in this workspace</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => selectPage("Devices")}
                    >
                      View all <span>→</span>
                    </button>
                  </div>

                  <div className="device-list">
                    {devices.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">▣</div>
                        <strong>No devices yet</strong>
                        <p>Add a device to start organizing your workspace.</p>
                      </div>
                    ) : (
                      devices.map((device) => (
                        <div className="device-row" key={device.id}>
                          <div className="device-icon">
                            {device.type === "Mobile" ? "▯" : "▣"}
                          </div>
                          <div className="device-info">
                            <strong>{device.name}</strong>
                            <span>{device.type}</span>
                          </div>
                          <span
                            className={`device-status ${
                              device.status === "Connected"
                                ? "connected"
                                : "offline"
                            }`}
                          >
                            <span className="status-dot" />
                            {device.status}
                          </span>
                          <button
                            className="more-button"
                            aria-label={`Remove ${device.name}`}
                            onClick={() =>
                              setDevices((current) =>
                                current.filter((d) => d.id !== device.id)
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    className="add-device-row"
                    onClick={() => setShowModal(true)}
                  >
                    <span>＋</span> Add another device
                  </button>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Quick Actions</h2>
                      <p>Shortcuts for your workspace</p>
                    </div>
                  </div>

                  <button
                    className="quick-action"
                    onClick={() => setShowModal(true)}
                  >
                    <span className="action-icon pink">＋</span>
                    <span className="action-copy">
                      <strong>Add a device</strong>
                      <small>Register a device locally</small>
                    </span>
                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="quick-action"
                    onClick={() => selectPage("Security")}
                  >
                    <span className="action-icon orange">◇</span>
                    <span className="action-copy">
                      <strong>Security overview</strong>
                      <small>Review workspace safety</small>
                    </span>
                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="quick-action"
                    onClick={() => selectPage("Settings")}
                  >
                    <span className="action-icon blue">⚙</span>
                    <span className="action-copy">
                      <strong>Preferences</strong>
                      <small>View app settings</small>
                    </span>
                    <span className="action-arrow">→</span>
                  </button>

                  <div className="activity-note">
                    <span className="note-symbol">i</span>
                    <p>
                      This is a local demo. Device pairing and live monitoring
                      are not connected.
                    </p>
                  </div>
                </section>
              </div>
            </>
          )}

          {activePage === "Devices" && (
            <section className="panel standalone-panel">
              <div className="panel-header">
                <div>
                  <h2>Device Manager</h2>
                  <p>Add or remove devices from this local demo.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setShowModal(true)}
                >
                  ＋ Add Device
                </button>
              </div>
              {devices.map((device) => (
                <div className="device-row" key={device.id}>
                  <div className="device-icon">▣</div>
                  <div className="device-info">
                    <strong>{device.name}</strong>
                    <span>{device.type}</span>
                  </div>
                  <span className="device-status offline">
                    <span className="status-dot" />
                    {device.status}
                  </span>
                  <button
                    className="remove-button"
                    onClick={() =>
                      setDevices((current) =>
                        current.filter((d) => d.id !== device.id)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              {devices.length === 0 && (
                <p className="page-subtitle">No devices added yet.</p>
              )}
            </section>
          )}

          {activePage === "Activity" && (
            <section className="panel standalone-panel">
              <div className="large-placeholder-icon">◷</div>
              <h2>Activity Log</h2>
              <p className="page-subtitle">
                No activity has been recorded in this local demo yet.
              </p>
            </section>
          )}

          {activePage === "Security" && (
            <section className="panel standalone-panel">
              <div className="large-placeholder-icon">◇</div>
              <h2>Security Overview</h2>
              <p className="page-subtitle">
                Your workspace is running locally. No remote monitoring or
                device pairing is enabled.
              </p>
              <div className="security-check">
                <span className="check-mark">✓</span>
                Local demo mode is active
              </div>
              <div className="security-check">
                <span className="check-mark">✓</span>
                No passwords are collected by this dashboard
              </div>
              <div className="security-check">
                <span className="check-mark">✓</span>
                Device pairing requires a future explicit setup
              </div>
            </section>
          )}

          {activePage === "Settings" && (
            <section className="panel standalone-panel">
              <div className="large-placeholder-icon">⚙</div>
              <h2>Settings</h2>
              <p className="page-subtitle">
                HACK Control Center · Crimson Red theme
              </p>
              <div className="settings-row">
                <div>
                  <strong>Appearance</strong>
                  <p>Dark workspace with crimson accents</p>
                </div>
                <span className="local-badge">DARK MODE</span>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Workspace</strong>
                  <p>Local demo data stored in the current page session</p>
                </div>
                <span className="local-badge">LOCAL</span>
              </div>
            </section>
          )}

          <footer className="footer">
            <span>HACK CONTROL CENTER</span>
            <span>CRIMSON RED EDITION · LOCAL DEMO</span>
          </footer>
        </section>
      </main>

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="modal-symbol">＋</div>
            <h2 id="modal-title">Add a Device</h2>
            <p>
              Give your device a name to add it to this local demo.
            </p>

            <label className="input-label" htmlFor="device-name">
              DEVICE NAME
            </label>
            <input
              id="device-name"
              className="device-input"
              value={deviceName}
              onChange={(event) => setDeviceName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addDevice();
              }}
              placeholder="e.g. My Android"
              autoFocus
            />

            <div className="modal-note">
              This only adds a local entry. It does not connect to or control
              the actual device.
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="primary-button" onClick={addDevice}>
                Add Device
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;