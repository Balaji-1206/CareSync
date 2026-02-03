import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  // SplashScreen.preventAutoHideAsync() throws when not running on Expo
});

const App = () => {
  React.useEffect(() => {
    async function prepare() {
      try {
        // You can add font loading here if needed
        // await Font.loadAsync(Entypo.font);
        // Artificially delay for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync().catch(() => {
          // SplashScreen methods throw when not running on Expo
        });
      }
    }

    prepare();
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;
