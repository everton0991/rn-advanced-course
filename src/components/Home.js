/**
 * Advanced React Native Course App
 * https://github.com/everton0991/rn-advanced-course
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Card, Button } from 'react-native-elements'
import DATA from '../dummydata'
import Deck from './Deck'
import styles, { colors } from '../styles'

type Props = {}

class Home extends Component<Props> {
  renderCard = (item: Object) => (
    <Card
      key={item.id}
      title={item.text}
      image={{ uri: item.uri }}
      containerStyle={styles.cardContainer}
      titleStyle={styles.cardTitle}
    >
      <Text style={styles.cardText}>
        I can customize the card
      </Text>
      <Button
        raised
        icon={{ name: 'code', color: colors.aliceBlue }}
        color={colors.aliceBlue}
        buttonStyle={styles.defaultButton}
        containerViewStyle={styles.buttonContainer}
        title="View Code"
      />
    </Card>
  )

  renderNoMoreCards = () => (
    <Card
      title="All Done!"
      containerStyle={styles.cardContainer}
      titleStyle={styles.cardTitle}
    >
      <Text style={styles.cardText}>
        There`s no more content here.
      </Text>
      <Button
        raised
        color={colors.aliceBlue}
        buttonStyle={styles.defaultButton}
        containerViewStyle={styles.buttonContainer}
        title="Get more"
      />
    </Card>
  )

  render() {
    return (
      <View>
        <Deck
          data={DATA}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    )
  }
}

export default Home
