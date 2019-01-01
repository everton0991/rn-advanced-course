/**
 * Deck component with draggable cards
 *
 * @flow
 */
import * as React from 'react'
import {
  View,
  Animated,
  LayoutAnimation,
  UIManager,
  PanResponder,
  Dimensions
} from 'react-native'

/**
 * Get the width of the current device.
 */
const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

/**
 * Set the Types of the component`s props
 */
type Props = {
  data: Array<Object>,
  renderCard: (item: Object) => React.Node,
  renderNoMoreCards: () => React.Node,
  onSwipeRight: (item?: Object) => void,
  onSwipeLeft: (item?: Object) => void
}

/**
 * Set the types of the component`s State
 */
type State = {
  cardIndex: number
}

class Deck extends React.Component<Props, State> {
  /**
   * The Current Card index that will receive the Animation.View
   * It gets the next card index after each Swipe complete
   */
  state = { cardIndex: 0 }

  /**
   * The Animation Position properties that is used to set
   * where the current Card is, will be, or will come back.
   */
  position: Object = {}

  /**
   * The Pan Responder object that handles the user gestures and
   * executes the callback on each event.
   */
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
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition()
        }
      }
    })

    this.position = position
    this.panResponder = panResponder
  }

  componentDidUpdate() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    return LayoutAnimation.spring()
  }

  /**
   * This method defines the amount of rotation that the card will
   * have when it`s dragged by a press event. Then returns a Object
   * with the animation style amd interpolation.
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
   * When the card is released set the the card to initial location
   */
  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start()
  }

  /**
   * When the card is released far enough to the right, we animate it
   * all the way out of the screen to the Right.
   */
  forceSwipe = (direction: string) => {
    const x = direction === 'right'
      ? SCREEN_WIDTH
      : -SCREEN_WIDTH

    Animated.timing(this.position, {
      toValue: { x: x * 1.5, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction))
  }

  /**
   * Handle the cards position afeter the swipe occurs
   */
  onSwipeComplete = (direction: string) => {
    const { onSwipeRight, onSwipeLeft, data } = this.props
    const { cardIndex } = this.state
    const item = data[cardIndex]

    this.position.setValue({ x: 0, y: 0 })
    this.setState({ cardIndex: cardIndex + 1 })

    return direction === 'right'
      ? onSwipeRight(item)
      : onSwipeLeft(item)
  }

  /**
   * Render and assign the animation to an indivual Card
   */
  renderCards = () => {
    const { cardStyle } = styles
    const { data, renderCard, renderNoMoreCards } = this.props
    const { cardIndex } = this.state

    if (cardIndex >= data.length) {
      return renderNoMoreCards()
    }

    return data.map((item, index) => {
      if (index < cardIndex) { return null }

      if (index === cardIndex) {
        return (
          <Animated.View
            key={item.id}
            style={[
              this.getCardStyle(),
              cardStyle
            ]}
            {...this.panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        )
      }

      return (
        <Animated.View
          key={item.id}
          style={[cardStyle, { top: 5 * (index - cardIndex) }]}
        >
          {renderCard(item)}
        </Animated.View>
      )
    }).reverse()
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    elevation: 3
  }
}

export default Deck
