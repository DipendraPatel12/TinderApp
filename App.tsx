import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigation from '././src/navigations/RootNavigation'
const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar></StatusBar>
      <RootNavigation></RootNavigation>
    </SafeAreaProvider>
  )
}

export default App