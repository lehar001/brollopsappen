import React from 'react';
import { View, FlatList, TouchableHighlight, Text, Image } from 'react-native';
import firebase from 'react-native-firebase';

class StoresList extends React.Component{

  constructor() {
    super();
    this.state = {
      stores: [],
    }
  }

  static navigationOptions = ({navigation}) => {
    return {title: navigation.state.params.category.item.name}
  }

  componentDidMount() {
    const category = this.props.navigation.state.params.category.item.key;
    const db = firebase.firestore();

    db.collection('stores').doc(category).collection('items').onSnapshot((querySnapshot) => {
      var stores = [];
      querySnapshot.forEach(function(doc) {
        const { name, rating } = doc.data();
        stores.push({
          key: doc.id,
          name,
          rating,
        });
      });
      this.setState({
        stores: stores,
      });
    });
  }

  componentWillUnmount(){
    const db = firebase.firestore();
    const category = this.props.navigation.state.params.category.item.key;
    var unsubscribe = db.collection("stores").doc(category).collection('items').onSnapshot(() => {});
    unsubscribe();
  }

  renderItem(store) {
    return(
      <TouchableHighlight onPress={() => this.props.navigation.navigate('StoreDetail', {store: store.item})}>
        <View>
          <Text>{store.item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return(
      <View>
        <FlatList
          data={this.state.stores}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

export default StoresList;
