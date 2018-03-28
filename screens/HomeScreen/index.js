import React from 'react';
import firebase from 'react-native-firebase';
import { IntroStack } from '../../config/router.js'
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

import { Text, View, Button } from 'react-native';

class HomeScreen extends React.Component{

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: <Icon.Button name="ios-settings-outline" color={EStyleSheet.value('$primaryColor')} size={28} backgroundColor="rgba(255,255,255,0)" onPress={()=>{ navigation.navigate('Settings'); }} />,
  });

  constructor() {
    super();
    this.state = {
      loading: true,
      daysLeft: 0,
    };
  }

  // Check to see if user has a wedding created.
  // Also listen for changes once it is created.
  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();

    db.collection('weddings').doc(uid).onSnapshot((wedding) => {
      if (wedding.data() !== undefined) {
        //Calculate days until wedding
        var oneDay = 24*60*60*1000;
        var today = new Date();
        var weddingDay = wedding.data().date;
        var daysLeft = Math.round(Math.abs((today.getTime() - weddingDay.getTime())/(oneDay)));
        wedding.data().daysleft = daysLeft;

        this.setState({
          loading: false,
          wedding: wedding.data(),
          daysLeft: daysLeft
        });
      }
    });
  }

  render(){

    // The application is initialising
    if (this.state.loading) return null;

    return (
      <View>
        <Text>Välkommen till {this.state.wedding.name1} & {this.state.wedding.name2Genitive} bröllop!</Text>
        <Text>{this.state.daysLeft} dagar kvar</Text>
      </View>
    );

  }
}

export default HomeScreen;
