import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'

export default function StatsScreen() {
  const data = [
    { name: 'לימודים', population: 4, color: '#f39c12', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'פנאי', population: 2, color: '#2ecc71', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'חברים', population: 1, color: '#3498db', legendFontColor: '#333', legendFontSize: 14 },
  ]

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>חלוקת הזמן שלי</Text>
      <PieChart
        data={data}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          color: () => `#000`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  )
}
