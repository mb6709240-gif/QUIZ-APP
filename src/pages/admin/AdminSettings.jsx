import { useState, useEffect } from 'react';
import { getSettings, saveSettings, getTheme, setTheme } from '../../utils/storage';
import { useToast } from '../../components/Toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState(getSettings());
  const toast = useToast();

  useEffect(() => { document.documentElement.setAttribute('data-theme', settings.theme); }, [settings.theme]);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    if (key === 'theme') {
      setTheme(value);
      document.documentElement.setAttribute('data-theme', value);
      window.dispatchEvent(new Event('theme-change'));
    }
    toast.success('Settings saved');
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Settings</h1>
        <p className="page-subtitle">Configure your QuizFlow admin preferences</p>
      </div>
      <div className="settings-layout">
        <div className="settings-card card">
          <h3 className="settings-card-title">{'\uD83C\uDFA8'} Appearance</h3>
          <p className="settings-card-desc">Choose how QuizFlow looks</p>
          <div className="radio-group mt-4">
            <div className={`radio-card ${settings.theme === 'light' ? 'active' : ''}`} onClick={() => updateSetting('theme', 'light')}>{'\u2600\uFE0F'} Light</div>
            <div className={`radio-card ${settings.theme === 'dark' ? 'active' : ''}`} onClick={() => updateSetting('theme', 'dark')}>{'\uD83C\uDF19'} Dark</div>
            <div className={`radio-card ${settings.theme === 'system' ? 'active' : ''}`} onClick={() => {
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              updateSetting('theme', 'system');
              const actualTheme = prefersDark ? 'dark' : 'light';
              setTheme(actualTheme);
              document.documentElement.setAttribute('data-theme', actualTheme);
            }}>{'\uD83D\uDCBB'} System</div>
          </div>
        </div>
        <div className="settings-card card">
          <h3 className="settings-card-title">{'\uD83D\uDD14'} Notifications</h3>
          <p className="settings-card-desc">Manage notification preferences</p>
          <div className="settings-toggle-row mt-4">
            <div><span className="settings-toggle-label">Notifications</span><p className="settings-toggle-desc">Receive in-app notifications</p></div>
            <label className="toggle"><input type="checkbox" checked={settings.notifications} onChange={(e) => updateSetting('notifications', e.target.checked)} /><span className="toggle-slider" /></label>
          </div>
        </div>
        <div className="settings-card card">
          <h3 className="settings-card-title">{'\uD83D\uDCBE'} Auto Save</h3>
          <p className="settings-card-desc">Automatically save quiz progress</p>
          <div className="settings-toggle-row mt-4">
            <div><span className="settings-toggle-label">Auto Save</span><p className="settings-toggle-desc">Save quiz progress automatically</p></div>
            <label className="toggle"><input type="checkbox" checked={settings.autoSave} onChange={(e) => updateSetting('autoSave', e.target.checked)} /><span className="toggle-slider" /></label>
          </div>
        </div>
      </div>
    </div>
  );
}
