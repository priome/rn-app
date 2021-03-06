import { StackNavigator } from 'react-navigation'
import Screen1 from './Screen1'
import Screen2 from './Screen2'

export const OnboardingNavigator = StackNavigator(
  {
    Screen1: { screen: Screen1 },
    Screen2: { screen: Screen2 }
  },
  { headerMode: 'none' }
)

export default OnboardingNavigator
