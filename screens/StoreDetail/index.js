import React from 'react';
import { View, Text, FlatList } from 'react-native';
import firebase from 'react-native-firebase';

class StoreDetail extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {title: navigation.state.params.store.store.name}
  }

  constructor() {
    super();
    this.state = {
      reviews: '',
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

  render() {
    var store = this.props.navigation.state.params.store.store;
    return(
      <View>
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
      </View>
    )
  }
}

export default StoreDetail;
