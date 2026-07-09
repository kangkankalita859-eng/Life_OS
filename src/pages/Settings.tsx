import { useState } from 'react';
import { User, Settings as SettingsIcon, Database, Download, Upload, Trash2, Moon, Sun, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [dataRetention, setDataRetention] = useState('forever');

  const handleExportData = () => {
    // Export all data as JSON
    alert('Export functionality - will export all memories, categories, and settings as JSON');
  };

  const handleImportData = () => {
    // Import data from JSON
    alert('Import functionality - will import data from JSON file');
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      // Clear IndexedDB
      alert('All data cleared');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Profile Section */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Birth Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Appearance
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                <Sun className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                <Moon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Daily Reminders</h3>
              <p className="text-sm text-muted-foreground">Get reminded to capture memories</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Time Capsule Alerts</h3>
              <p className="text-sm text-muted-foreground">Notify when capsules are ready to open</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Privacy & Security
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Default Privacy Level</label>
            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="private">Private</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto Backup</h3>
              <p className="text-sm text-muted-foreground">Automatically backup data to local storage</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Data Retention</label>
            <select
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="forever">Forever</option>
              <option value="1year">1 Year</option>
              <option value="5years">5 Years</option>
              <option value="10years">10 Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Data Management
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            <button
              onClick={handleImportData}
              className="flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <Upload className="w-5 h-5" />
              Import Data
            </button>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleClearAllData}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Data
            </button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will permanently delete all memories, categories, and settings
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" />
          About
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data Storage</span>
            <span>IndexedDB (Local)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Backup</span>
            <span>Never</span>
          </div>
        </div>
      </div>
    </div>
  );
}
