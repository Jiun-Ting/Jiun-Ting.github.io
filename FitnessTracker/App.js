import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';

import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import ProfileView from './ProfileView'
import MealView from './MealView'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { StyleSheet,TouchableOpacity, Image, View, Text } from 'react-native';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);

    this.SignoutButton = this.SignoutButton.bind(this);
  }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }

  /**
   * Defines a signout button... Your first TODO!
   */
  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}>
        <TouchableOpacity onPress={() => this.revokeAccessToken()}>
          <Text>
          <Ionicons name="ios-log-out" size={24} color="black" />
            
          </Text>
        </TouchableOpacity>
      </View>
    </>
  }

  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   * 
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   * 
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {

    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    return (
      <NavigationContainer>
        <Tab.Navigator>
          {!this.state.accessToken ? (
            <>
              <Tab.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                  tabBarIcon: () => {
                    return <Ionicons name={'ios-log-in'} size={25} />;
                  },
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </Tab.Screen>

              <Tab.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                  tabBarIcon: () => {
                    return <Ionicons name={'ios-key'} size={25} />;
                  },
                }}
              >
                {(props) => <SignupView {...props} />}
              </Tab.Screen>
            </>
          ) : (
              <>
                <Tab.Screen name="FitnessTracker" options={{
                  headerLeft: this.SignoutButton,
                  tabBarIcon: () => {
                    return <Ionicons name={'ios-list'} size={25} />;
                  },
                  tabBarOptions: {style:{height:500}}}} >
                  {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </Tab.Screen>
                <Tab.Screen name="Today" options={{
                  headerLeft: this.SignoutButton,
                  tabBarIcon: () => {
                    return <Ionicons name={'ios-stats'} size={25} />;
                  },
                  tabBarOptions: {style:{height:500}}
                }}>
                  {(props) => <TodayView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </Tab.Screen>
                <Tab.Screen name="Exercise" options={{
                  headerLeft: this.SignoutButton,
                  tabBarIcon: () => {
                    return <Ionicons name={'ios-american-football'} size={25} />;
                  },
                  tabBarOptions: {style:{height:500}}
                }}>
                  {(props) => <ExercisesView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </Tab.Screen>
                <Tab.Screen name="Meal" options={{
                  headerLeft: this.SignoutButton,
                  tabBarIcon: () => {
                    return <Ionicons name={'ios-pizza'} size={25} />;
                  },
                }}>
                  {(props) => <MealView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken} />}
                </Tab.Screen>
              </>
              

            )}
        </Tab.Navigator>
      </NavigationContainer>

    );
  }
}

export default App;
