import React from 'react';
import firebase from 'react-native-firebase';
import Swipeout from 'react-native-swipeout';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

import { View, Text, FlatList, Button, TouchableHighlight } from 'react-native';

class GuestList extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: <Icon.Button name="ios-person-add-outline" color={EStyleSheet.value('$primaryColor')} size={28} backgroundColor="rgba(255,255,255,0)" onPress={()=>{ navigation.navigate('NewGuest'); }} />,
  });

  constructor() {
    super();
    this.state = {
      guests: '',
      totalGuests: '',
      selectedIndex: 0,
    }
  }

  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();

    db.collection("weddings").doc(uid).collection("guests").onSnapshot((querySnapshot) => {
        var guests = [];
        var totalGuests = 0;
        querySnapshot.forEach(function(doc) {
          const { name, status, extra, kids } = doc.data();
            guests.push({
              key: doc.id,
              name,
              status,
              extra,
              kids
            });
            totalGuests = totalGuests + extra;
        });
        totalGuests = totalGuests + guests.length;
        if (this.state.selectedIndex == 0) {
          this.setState({
            allGuests: guests,
            filteredGuests: guests,
            totalGuests: totalGuests
          });
        } else {
          filterGuests = (status) => {

             var filteredGuests = guests.filter(function(guest){
                return guest.status == status;
             }).map(function(guest){
                 return guest;
             });
             this.setState({
               filteredGuests: filteredGuests,
               allGuests: guests,
               totalGuests: totalGuests
             });
           }

          if (this.state.selectedIndex == 1) {
            filterGuests("attending");
          } else if (this.state.selectedIndex == 2) {
            filterGuests("notAttending");
          } else if (this.state.selectedIndex == 3) {
            filterGuests("noAnswer");
          }
        }

    });
  }

  componentWillUnmount() {
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    var unsubscribe = db.collection("weddings").doc(uid).collection("guests").onSnapshot(() => {});
    unsubscribe();
  }

  handleIndexChange = (index) => {
    this.setState({
      selectedIndex: index,
    });

    filterGuests = (status) => {
       var allGuests = this.state.allGuests;
       var filteredGuests = allGuests.filter(function(guest){
          return guest.status == status;
       }).map(function(guest){
           return guest;
       });
       this.setState({
         filteredGuests
       });
     }

    if (index == 1) {
      filterGuests("attending");
    } else if (index == 2) {
      filterGuests("notAttending");
    } else if (index == 3) {
      filterGuests("noAnswer");
    } else {
      this.setState({
        filteredGuests: this.state.allGuests,
      });
    }

  }

  _renderEmptyList = () => {
    if (this.state.totalGuests == 0) {
      return (
        <View>
          <Text>Du verkar inte ha lagt till några gäster</Text>
          <Button title="Lägg till gäst" onPress={()=>{ this.props.navigation.navigate('NewGuest'); }} />
        </View>
      )
    } else {
      return (
        <View>
          <Text>Inga gäster här</Text>
        </View>
      )
    }
  }

  renderItem(guest) {

    onGuestDelete = (guest) => {
      const uid = firebase.auth().currentUser.uid;
      const db = firebase.firestore().collection("weddings").doc(uid);

      db.collection("guests").doc(guest.item.key).delete();
    }

    onAttending = (guest) => {
      const uid = firebase.auth().currentUser.uid;
      const db = firebase.firestore().collection("weddings").doc(uid);

      db.collection("guests").doc(guest.item.key).update({
        status: 'attending'
      });
    }

    onNotAttending = (guest) => {
      const uid = firebase.auth().currentUser.uid;
      const db = firebase.firestore().collection("weddings").doc(uid);

      db.collection("guests").doc(guest.item.key).update({
        status: 'notAttending'
      });
    }

    // Swipe buttons
    let swipeBtns = [
      {
        text: 'Kommer',
        backgroundColor: 'green',
        onPress: () => {onAttending(guest)}
      },
      {
        text: 'Kommer inte',
        backgroundColor: 'yellow',
        onPress: () => {onNotAttending(guest)}
      },
      {
      text: 'Ta bort',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 1, 0.6)',
      onPress: () => {onGuestDelete(guest)}
    }];

    // Define styles depending on status
    if (guest.item.status == 'attending') {
      var style = styles.attending;
    } else if (guest.item.status == 'notAttending') {
      var style = styles.notAttending;
    }

    return (
      <Swipeout autoClose={true} right={swipeBtns}>
        <TouchableHighlight onPress={ () => { this.props.navigation.navigate('NewGuest', {guest: guest})}}>
          <View style={[styles.itemContainer, style]}>
            <View>
              <Text style={styles.itemTitle}>{guest.item.name}</Text>
            </View>
              {guest.item.extra > 0 &&
                <View>
                  <Text>+{guest.item.extra}</Text>
                </View>
              }
              {guest.item.kids > 0 &&
                <View>
                  <Text>{guest.item.kids}</Text>
                </View>
              }
            </View>
          </TouchableHighlight>
      </Swipeout>
    )
  } // End renderItem

  render() {
    return (
      <View>
        <SegmentedControlTab
          values={['Alla','Tackat ja','Tackat nej', 'Ej svarat']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />
        <Text>Antal gäster: {this.state.totalGuests}</Text>
        <FlatList
          data={this.state.filteredGuests}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._renderEmptyList()}
        />
      </View>
    );
  }
}

export default GuestList;

const styles = EStyleSheet.create({
  itemContainer: {
    backgroundColor: "#F5F5F5",
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E3E3",
    flex: 1,
    flexDirection: "row",
    height: 55,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(255,255,255,0)'
  },
  itemTitle: {
    fontSize: 18,
  },
  attending: {
    borderLeftWidth: 5,
    borderLeftColor: "#6FCF97",
  },
  notAttending: {
    borderLeftWidth: 5,
    borderLeftColor: "#EB5757",
  }
});
