import { useState, useEffect } from 'react';
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { remoteConfig } from '../lib/firebase';

export function useRemoteConfig() {
  const [config, setConfig] = useState({
    showMaintenance: false,
    accentColor: '#FFC107',
    welcomeMessage: 'Welcome to Bauhaus Lab'
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        setConfig({
          showMaintenance: getValue(remoteConfig, 'show_maintenance_mode').asBoolean(),
          accentColor: getValue(remoteConfig, 'theme_accent_color').asString(),
          welcomeMessage: getValue(remoteConfig, 'welcome_message').asString(),
        });
      } catch (err) {
        console.error("Remote Config fetch failed", err);
      }
    };
    loadConfig();
  }, []);

  return config;
}
