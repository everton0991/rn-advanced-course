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
  onSwipeRight?: (item?: Object) => void,
  onSwipeLeft?: (item?: Object) => void
}

/**
 * Set the types of the component`s State
 */
type State = {
  prevData: Array<Object>,
  cardIndex: number
}

class Deck extends React.Component<Props, State> {
  /**
   * Default props for the callback method on each
   * swipe event
   */
  static defaultProps = {
    onSwipeRight: () => console.log('Please pass a method on Swipe Right'),
    onSwipeLeft: () => console.log('Please pass a method on Swipe Left')
  }

  /**
   * Set the initial state for the cardINdex and the
   * data control state.
   */
  state = {
    prevData: [],
    cardIndex: 0
  }

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
     * assign the data props to a control state and
     * The Current Card index that will receive the Animation.View
     * It gets the next card index after each Swipe complete
     */
    this.state = {
      prevData: props.data,
      cardIndex: 0
    }

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

  /**
   * If the Data has changed we reset the cardIndex to 0
   * and repopulate the state that controls the data received with
   * the new one.
   * If nothing has changed return null.
   */
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.data !== state.prevData) {
      return {
        prevData: props.data,
        cardIndex: 0
      }
    }

    return null
  }

  /**
   * Hack for Android
   */
  componentDidUpdate() {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    return LayoutAnimation.spring()
  }

  /**
   * This method defines the amount of rotation that the card will
   * have when it`s dragged by a gesture event. Then returns a Object
   * with the animation style amd interpolation.
   */
  getCardStyle = () => {
    const rotationDistance = SCREEN_WIDTH * 2

    const rotate = this.position.x.interpolate({
      inputRange: [-rotationDistance, 0, rotationDistance],
      outputRange: ['45deg', '0deg', '-45deg']
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
   * When the card is released far enough to the right or the left,
   * we animate it all the way out of the screen.
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

    return (direction === 'right')
      ? onSwipeRight && onSwipeRight(item)
      : onSwipeLeft && onSwipeLeft(item)
  }

  /**
   * Render and assign the animation to an indivual Card
   */
  renderCards = () => {
    const { cardStyle } = styles
    const { data, renderCard, renderNoMoreCards } = this.props
    const { cardIndex } = this.state

    /**
     * Render the card with the message that there is no
     * more cards left in the data.
     */
    if (cardIndex >= data.length) {
      return renderNoMoreCards()
    }

    /**
     * Loop trough the data array
     */
    return data.map((item, index) => {
      /**
       * If there is no more cards left
       */
      if (index < cardIndex) { return null }

      /**
       * If this is our current card, attach the animation
       * attributes to it.
       */
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

      /**
       * Render the secondary cards.
       * PS: The Animated.View tag was used here to prevent the
       * card infos to be refetched causing layout lag when the transition
       * between cards occurs.
       */
      return (
        <Animated.View
          key={item.id}
          style={[
            cardStyle,
            {
              top: 5 * (index - cardIndex)
            }
          ]}
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

/**
 * Sets the card width and position all of them over each other
 * the 'elevation' attribute is to set the correct order on Android.
 */
const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    elevation: 3
  }
}

export default Deck
