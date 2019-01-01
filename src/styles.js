import { StyleSheet } from 'react-native'

/**
 * App Color schemes
 */
export const colors = {
  darkLiver: '#5F5E77',
  operaMauve: '#C183C0',
  aliceBlue: '#F2F9F9'
}

/**
 * App Global styles
 */
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.darkLiver
  },
  buttonContainer: {
    backgroundColor: colors.darkLiver,
    marginLeft: 0,
    marginRight: 0
  },
  defaultButton: {
    backgroundColor: colors.darkLiver
  },
  cardContainer: {
    backgroundColor: colors.operaMauve,
    borderColor: colors.darkLiver
  },
  cardTitle: {
    color: colors.aliceBlue
  },
  cardText: {
    marginBottom: 10,
    color: colors.aliceBlue
  }
})

export default styles
