import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, Sparkles, MonitorSmartphone, RefreshCw, Save, Palette } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { fadeIn, slideUp, staggerContainer } from '../utils/animations';
import { recordAuditEvent } from '../utils/audit';
import { defaultPreferences, readPreferences, writePreferences } from '../utils/preferences';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { darkMode, toggleTheme, setDarkMode } = useTheme();
  const [prefs, setPrefs] = useState(readPreferences());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('compact-ui', Boolean(prefs.compactMode));
    return () => {
      document.documentElement.classList.remove('compact-ui');
    };
  }, [prefs.compactMode]);

  const updatePref = (key, value) => {
    setPrefs((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    writePreferences(prefs);
    if (prefs.rememberTheme === false) {
      recordAuditEvent({
        action: 'settings_save',
        subject: 'Theme memory disabled',
        detail: 'Theme preference will not be persisted after session restore'
      });
    } else {
      recordAuditEvent({
        action: 'settings_save',
        subject: 'Preferences saved',
        detail: 'UI preferences updated successfully'
      });
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const reset = () => {
    setPrefs(defaultPreferences);
    writePreferences(defaultPreferences);
    setDarkMode(true);
    document.documentElement.classList.remove('compact-ui');
    recordAuditEvent({
      action: 'settings_reset',
      subject: 'Preferences reset',
      detail: 'Restored default app preferences'
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const themeLabel = useMemo(() => (darkMode ? 'Dark mode' : 'Light mode'), [darkMode]);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
      <motion.section variants={slideUp} className="rounded-[1.75rem] border border-theme bg-elevated p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-xs font-medium text-accent-hover-theme">
              <Sparkles size={14} />
              Application settings
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-theme md:text-4xl">
              Settings
            </h1>
            <p className="mt-3 text-sm leading-6 text-secondary-theme md:text-base">
              Manage appearance and behavior preferences for the current browser session.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Pill icon={<Palette size={14} />} label={themeLabel} accent />
            <Pill icon={<MonitorSmartphone size={14} />} label={prefs.compactMode ? 'Compact layout' : 'Comfort layout'} />
          </div>
        </div>
      </motion.section>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-4 lg:grid-cols-2">
        <motion.section variants={slideUp}>
          <Card className="p-5 md:p-6">
            <h2 className="text-xl font-semibold text-primary-theme">Appearance</h2>
            <p className="mt-1 text-sm text-secondary-theme">Control the look and spacing of the dashboard.</p>

            <div className="mt-5 space-y-4">
              <SettingRow
                icon={<Palette size={16} />}
                label="Theme"
                description="Switch between light and dark mode."
                action={
                  <Button variant="secondary" onClick={toggleTheme}>
                    {darkMode ? 'Use light' : 'Use dark'}
                  </Button>
                }
              />

              <SettingRow
                icon={<MonitorSmartphone size={16} />}
                label="Compact mode"
                description="Reduce spacing and tighten the layout."
                action={<Toggle checked={prefs.compactMode} onChange={(checked) => updatePref('compactMode', checked)} />}
              />

              <SettingRow
                icon={<RefreshCw size={16} />}
                label="Persist theme"
                description="Remember the selected theme across sessions."
                action={<Toggle checked={prefs.rememberTheme} onChange={(checked) => updatePref('rememberTheme', checked)} />}
              />
            </div>
          </Card>
        </motion.section>

        <motion.section variants={slideUp}>
          <Card className="p-5 md:p-6">
            <h2 className="text-xl font-semibold text-primary-theme">Notifications and privacy</h2>
            <p className="mt-1 text-sm text-secondary-theme">These preferences are stored locally for the current browser profile.</p>

            <div className="mt-5 space-y-4">
              <SettingRow
                icon={<Bell size={16} />}
                label="Action notifications"
                description="Enable a soft notification marker after major actions."
                action={<Toggle checked={prefs.soundOnAction} onChange={(checked) => updatePref('soundOnAction', checked)} />}
              />

              <SettingRow
                icon={<ShieldCheck size={16} />}
                label="Show email in profile"
                description="Keep the email visible in the profile page."
                action={<Toggle checked={prefs.showEmail} onChange={(checked) => updatePref('showEmail', checked)} />}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={save}>
                <Save size={16} />
                Save settings
              </Button>
              <Button variant="secondary" onClick={reset}>
                Reset defaults
              </Button>
            </div>

            {saved ? (
              <div className="mt-5 rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-3 text-sm text-accent-hover-theme">
                Settings saved locally.
              </div>
            ) : null}
          </Card>
        </motion.section>
      </motion.div>

      <motion.section variants={slideUp}>
        <Card className="p-5 md:p-6">
          <h2 className="text-xl font-semibold text-primary-theme">Current configuration</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <ConfigItem label="Theme memory" value={prefs.rememberTheme ? 'Enabled' : 'Disabled'} />
            <ConfigItem label="Layout density" value={prefs.compactMode ? 'Compact' : 'Comfort'} />
            <ConfigItem label="Email visibility" value={prefs.showEmail ? 'Visible' : 'Hidden'} />
            <ConfigItem label="Action cues" value={prefs.soundOnAction ? 'Enabled' : 'Disabled'} />
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
};

const SettingRow = ({ icon, label, description, action }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-theme bg-elevated p-4">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-[color:var(--accent)]/12 p-2 text-accent-hover-theme">{icon}</div>
        <p className="font-medium text-primary-theme">{label}</p>
      </div>
      <p className="mt-2 text-sm text-secondary-theme">{description}</p>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
      checked ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/20' : 'border-theme bg-surface'
    }`}
    aria-pressed={checked}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-accent-theme transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const ConfigItem = ({ label, value }) => (
  <div className="rounded-2xl border border-theme bg-surface p-4">
    <p className="text-xs uppercase tracking-[0.22em] text-muted-theme">{label}</p>
    <p className="mt-2 text-sm font-semibold text-primary-theme">{value}</p>
  </div>
);

const Pill = ({ icon, label, accent = false }) => (
  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${accent ? 'border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 text-accent-hover-theme' : 'border-theme bg-surface text-secondary-theme'}`}>
    {icon}
    {label}
  </span>
);

export default Settings;
