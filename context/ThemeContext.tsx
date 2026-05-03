import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  accent: string;
  border: string;
  inputBg: string;
  headerBg: string;
  tabBar: string;
  shadow: string;
}

const LightTheme: ThemeColors = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#1a3b5c',
  subtext: '#64748b',
  accent: '#6B46C1',
  border: '#e2e8f0',
  inputBg: '#ffffff',
  headerBg: '#ffffff',
  tabBar: '#ffffff',
  shadow: '#000000',
};

const DarkTheme: ThemeColors = {
  background: '#0f172a',
  card: '#1e293b',
  text: '#f1f5f9',
  subtext: '#94a3b8',
  accent: '#A78BFA',
  border: '#334155',
  inputBg: '#334155',
  headerBg: '#1e293b',
  tabBar: '#1e293b',
  shadow: '#000000',
};

interface ThemeContextData {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('teac_theme');
      if (savedTheme) {
        setTheme(savedTheme as ThemeType);
      } else {
        const systemTheme = Appearance.getColorScheme();
        if (systemTheme) setTheme(systemTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('teac_theme', newTheme);
  };

  const colors = theme === 'light' ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors, 
      toggleTheme, 
      isDark: theme === 'dark' 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
