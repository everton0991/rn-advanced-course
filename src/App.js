/**
 * Advanced React Native Course App
 * https://github.com/everton0991/rn-advanced-course
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { Card, Button } from 'react-native-elements'
import DATA from './dummydata'
import Deck from './components/Deck'

type Props = {}

class App extends Component<Props> {
  renderCard = (item: Object) => (
    <Card
      key={item.id}
      title={item.text}
      image={{ uri: item.uri }}
    >
      <Text style={{ marginBottom: 10 }}>
        I can customize the card
      </Text>
      <Button
        raised
        icon={{
          name: 'code',
          color: '#fff'
        }}
        backgroundColor="#000"
        containerViewStyle={{
          backgroundColor: '#fff',
          marginLeft: 0,
          marginRight: 0
        }}
        title="View Code"
      />
    </Card>
  )

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Deck
          data={DATA}
          renderCard={this.renderCard}
        />
      </SafeAreaView>
    )
  }
}

export default App
