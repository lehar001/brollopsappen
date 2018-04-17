import React from 'react';
import { View, Text, FlatList, Button, Modal, TouchableHighlight } from 'react-native';
import firebase from 'react-native-firebase';
import ReviewModal from './ReviewModal';

class StoreDetail extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {title: navigation.state.params.store.store.name}
  }

  constructor() {
    super();
    this.state = {
      reviews: '',
      modalVisible: false,
    }
  }

  componentDidMount() {
     const storeKey = this.props.navigation.state.params.store.key;
     const category = this.props.navigation.state.params.store.category;
     const db = firebase.firestore().collection("stores").doc(category).collection("items").doc(storeKey).collection("reviews");
     db.onSnapshot((querySnapshot) => {
       var reviews = [];
       querySnapshot.forEach(function(doc) {
         const { review, rating} = doc.data();
         reviews.push({
           review,
           rating
         });
       });
       this.setState({
         reviews: reviews,
       });
     });
  }

  renderReview(review) {
    console.log(review);
    return(
      <View>
        <Text>Rating: {review.item.rating}</Text>
        <Text>{review.item.review}</Text>
      </View>
    );
  }

  _renderEmptyReviewList() {
    return(
      <View>
        <Text>Oj, inga recensioner än</Text>
      </View>
    );
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  render() {
    var store = this.props.navigation.state.params.store.store;
    return(
      <View>
        <ReviewModal
          store={store}
          setModalVisible={() => {this.setModalVisible(!this.state.modalVisible);}}
          visible={this.state.modalVisible}
        />
        <View>
          <Text>This store has a rating of {store.rating}</Text>
        </View>
        <Text>Recensioner</Text>
        <FlatList
          data={this.state.reviews}
          renderItem={this.renderReview.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._renderEmptyReviewList()}
        />
        <Button
          title="Skriv en recension"
          onPress={() => {this.setModalVisible(!this.state.modalVisible);}}/>
      </View>
    )
  }
}

export default StoreDetail;
