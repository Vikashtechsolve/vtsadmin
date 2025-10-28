
import React, { useEffect, useState } from "react";

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
};

export default function ResponsiveDashboard({ baseUrl }) {
  const API = baseUrl ;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchJson(`${API}/user`).catch((e) => null),
      fetchJson(`${API}/stats`).catch((e) => null),
      fetchJson(`${API}/activities`).catch((e) => []),
    ])
      .then(([userData, statsData, activitiesData]) => {
        if (!mounted) return;
        setUser(userData || { name: "Admin", role: "Admin", avatar: "" });
        setStats(
          statsData || {
            totalUsers: 0,
            masterClasses: 0,
            mentorSessions: 0,
            doubtSessions: 0,
            onlineContests: 0,
            resumeReview: 0,
          }
        );
        setActivities(activitiesData || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [API]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r transition-all duration-200 ease-in-out shadow-sm z-20 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-5 flex items-center gap-3">
          <div className="text-2xl font-bold text-red-700">VTS</div>
          {sidebarOpen && <div className="text-sm text-gray-500">Vikash Tech Solution</div>}
        </div>

        <nav className="mt-6 px-2">
          <NavItem icon={GridIcon} label="Dashboard" open={sidebarOpen} active />
          <NavItem icon={CardIcon} label="Our Programs" open={sidebarOpen} />
          <NavItem icon={BoxIcon} label="Our Products" open={sidebarOpen} />
          <NavItem icon={InfoIcon} label="About us" open={sidebarOpen} />
          <NavItem icon={BlogIcon} label="Blogs" open={sidebarOpen} />
          <NavItem icon={SettingsIcon} label="Settings" open={sidebarOpen} />
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-md"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <Hamburger />
            </button>
            <h1 className="text-2xl font-semibold text-red-700">Dashboard</h1>
            <div className="hidden md:block w-96 ml-6">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Bell />
            </div>
            <div className="flex items-center gap-3">
              <img
                src={user && user.avatar ? user.avatar : `https://i.pravatar.cc/40?u=${user?.name}`}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">{user?.name || "Admin"}</div>
                <div className="text-xs text-red-700 flex items-center gap-1">{user?.role || "Admin"}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <WelcomeCard loading={loading} />

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
                ) : (
                  <>
                    <StatCard title="Total Users" value={stats.totalUsers} />
                    <StatCard title="Master Classes" value={stats.masterClasses} />
                    <StatCard title="Mentor Sessions" value={stats.mentorSessions} />
                    <StatCard title="Doubt Sessions" value={stats.doubtSessions} />
                    <StatCard title="Online Contests" value={stats.onlineContests} />
                    <StatCard title="Resume Review" value={stats.resumeReview} />
                  </>
                )}
              </div>
            </div>

            <aside className="md:col-span-1">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <Calendar />
              </div>

              <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-3">Recent Activities</h3>
                {loading ? (
                  <div className="text-sm text-gray-500">Loading...</div>
                ) : activities.length === 0 ? (
                  <div className="text-sm text-gray-500">No activities yet.</div>
                ) : (
                  <Timeline items={activities} />
                )}
              </div>
            </aside>
          </div>
        </main>

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
function NavItem({ icon: Icon, label, open, active }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 hover:bg-gray-50 ${
        active ? "bg-gray-100 shadow-inner" : ""
      }`}
    >
      <div className="p-2 rounded-md bg-gray-100">
        <Icon />
      </div>
      {open && <div className="text-sm text-gray-600">{label}</div>}
    </div>
  );
}

function SearchBar() {
  return (
    <div className="relative">
      <input
        className="w-full rounded-full border border-gray-200 px-4 py-3 shadow-sm focus:outline-none"
        placeholder="Search here.."
      />
    </div>
  );
}

function WelcomeCard({ loading }) {
  return (
    <div className="bg-red-700 text-white rounded-lg p-6 shadow-md flex items-center gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-2">Welcome back, Vikash</h2>
        <p className="opacity-90">Here’s a quick overview of today’s activity!</p>
      </div>
      <div className="hidden sm:block w-40 h-40 bg-white rounded-lg overflow-hidden shadow-inner">
        {/* placeholder illustration: the user can swap with an SVG or img from API */}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"> 
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#C53030" strokeWidth="1.2"/></svg>
        </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
        </div>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-20"></div>
  );
}

function Calendar() {
  // Simple static calendar UI — connect to a date API if needed
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">October 2025</div>
        <div className="text-xs text-gray-400">›</div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-gray-600">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
        {Array.from({ length: 31 }).map((_, i) => (
          <div key={i} className="py-2 rounded-md">{i + 1}</div>
        ))}
      </div>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((it, idx) => (
          <li key={it.id || idx} className="mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white text-sm">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{it.text}</p>
                <p className="text-xs text-gray-400 mt-1">{it.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Icons ---------- */
function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" stroke="#9A091F" strokeWidth="1.2"/><rect x="13" y="3" width="8" height="8" stroke="#9A091F" strokeWidth="1.2"/><rect x="3" y="13" width="8" height="8" stroke="#9A091F" strokeWidth="1.2"/><rect x="13" y="13" width="8" height="8" stroke="#9A091F" strokeWidth="1.2"/></svg>
  );
}
function CardIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" stroke="#666" strokeWidth="1.2"/></svg>); }
function BoxIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4v9l-9 4-9-4V7z" stroke="#666" strokeWidth="1.2" fill="none"/></svg>); }
function InfoIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="1.2"/><path d="M12 8v.01M11 12h2v4h-2z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function BlogIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" stroke="#666" strokeWidth="1.2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="#666" strokeWidth="1" strokeLinecap="round"/></svg>); }
function SettingsIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="#666" strokeWidth="1.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.3 17.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.29-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 3.7A2 2 0 1 1 7.13.87l.06.06A1.65 1.65 0 0 0 9 1.3c.41.21 1 .21 1.41 0 .41-.21 1-.21 1.41 0a1.65 1.65 0 0 0 1.51-.33l.06-.06A2 2 0 1 1 20.2 4.3l-.06.06a1.65 1.65 0 0 0-.33 1.82c.21.7.21 1.29 0 1.51z" stroke="#666" strokeWidth="1"/></svg>); }
function Hamburger() { return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#111" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function Bell() { return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 17H9" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/><path d="M18 8a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2V8z" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }

