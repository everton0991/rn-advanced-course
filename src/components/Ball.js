/**
 * Ball with animation component
 *
 * @flow
 */
import React, { Component } from 'react'
import { View, Animated } from 'react-native'

type Props = {}

class Ball extends Component<Props> {
  position = new Animated.ValueXY({ x: 0, y: 0 })

  componentDidMount() {
    Animated.spring(this.position, {
      toValue: { x: 200, y: 500 }
    }).start()

    console.log('ball')
  }

  render() {
    const { ballStyle } = styles

    return (
      <Animated.View
        style={this.position.getLayout()}
      >
        <View style={ballStyle} />
      </Animated.View>
    )
  }
}

const styles = {
  ballStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: '#000'
  }
}

export default Ball
