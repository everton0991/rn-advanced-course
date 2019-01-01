/**
 * Advanced React Native Course App
 * https://github.com/everton0991/rn-advanced-course
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
import Home from './components/Home'
import styles from './styles'

type Props = {}

class App extends Component<Props> {
  componentDidMount() {
    console.log('The App is mounted!')
  }

  render() {
    return (
      <SafeAreaView
        style={styles.appContainer}
      >
        <Home />
      </SafeAreaView>
    )
  }
}

export default App
