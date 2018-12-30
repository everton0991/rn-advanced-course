/**
 * Deck component with draggable cards
 *
 * @flow
 */
import * as React from 'react'
import {
  View, Animated, PanResponder, Dimensions
} from 'react-native'

/**
 * Get the width of the current device.
 */
const SCREEN_WIDTH = Dimensions.get('window').width

/**
 * data type expects an array of Objects
 * renderCard expects a method with a JSX response.
 */
type Props = {
  data: Array<Object>,
  renderCard: (item: Object) => React.Node
}

class Deck extends React.Component<Props> {
  /**
   * Initialize a few Class properties
   */
  position: Object = {}

  panResponder: Object = {}

  constructor(props: Props) {
    super(props)

    /**
     * The first position of the Animated element
     */
    const position = new Animated.ValueXY()

    /**
     * Get the Pan Responder events to see where the element is
     * at the moment.
     */
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: () => {}
    })

    this.position = position
    this.panResponder = panResponder
  }

  /**
   * This method defines the amount of rotation that the card will
   * have when it`s dragged by a press event.
   * Then returns a Object with the animation style amd interpolation.
   */
  getCardStyle = () => {
    const rotationDistance = SCREEN_WIDTH * 2

    const rotate = this.position.x.interpolate({
      inputRange: [-rotationDistance, 0, rotationDistance],
      outputRange: ['-120deg', '0deg', '120deg']
    })

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]

    }
  }

  /**
   * Render and assign the animation to an indivual Card
   */
  renderCards = () => {
    const { data, renderCard } = this.props

    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        )
      }

      return renderCard(item)
    })
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

export default Deck
