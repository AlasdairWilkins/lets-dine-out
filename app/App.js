import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import Expo, { Location, Permissions } from 'expo';


import Listings from './components/Listings'

export default class App extends React.Component {

    getLocationAsync = async() => {
        const { Location, Permissions } = Expo;
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({});
            let url = buildURL(location.coords)
            this.setState({ location: location });
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    this.setState({listings: json})
                })
                .catch(error => console.log(error));
        }
        else {
            let errorMessage = 'Location permission not granted'
            this.setState({ errorMessage: errorMessage })
        }
    }

    state = {
        location: null,
        errorMessage: null,
        listings: null
    }

    componentWillMount() {
        this.getLocationAsync()
    }


    render() {

        if (this.state.location) {
            if (this.state.listings) {
                return (
                    <ScrollView style={styles.container}>
                        <Text style = {styles.text}>Check out nearby places with outdoor seating! {"\n"}{"\n"}
                        <Listings listings={this.state.listings}/></Text>
                    </ScrollView>
                )
            } else {
                return (
                    <View style = {styles.container}>
                        <Text style = {styles.text}>"I consider it morally reprehensible to be inside on a nice day...
                            I don't understand why Yelp's algorithms haven't figured out that
                            from May to October I only want to see restaurants with outdoor seating."
                            {"\n"}{"\n"} -- Summer, OKCupid {"\n"}{"\n"}
                            Location found, discovering fun places to eat outside now!</Text>
                    </View>
                )
            }
        } else {
            return (
                <View style={styles.container}>
                    <Text style= {styles.text}>"I consider it morally reprehensible to be inside on a nice day...
                        I don't understand why Yelp's algorithms haven't figured out that
                        from May to October I only want to see restaurants with outdoor seating."
                        {"\n"}{"\n"} -- Summer, OKCupid</Text>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        flex: 1,
        backgroundColor: 'purple',
    },
    text : {
        color: 'gold',
    }
});

function buildURL(coordinates) {
    return 'http://192.168.0.43:8000/letsdineout?long=' + coordinates.longitude +
        '&lat=' + coordinates.latitude + '&d=1'
}