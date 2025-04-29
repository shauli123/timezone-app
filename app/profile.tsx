import React from 'react'
import { View, Text } from 'react-native'

export default function ProfileScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>הפרופיל שלי</Text>
      <Text>רצף ימי התמדה: 3 ימים ברצף ✅</Text>
      <Text>נקודות: 120 ⭐️</Text>
    </View>
  )
}
