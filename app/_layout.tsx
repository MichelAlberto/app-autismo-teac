import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import { View } from 'react-native';

function AppLayout() {
  const { theme, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#f8f9fa' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: isDark ? '#0f172a' : '#f8f9fa' }
        }} 
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
