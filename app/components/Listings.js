import React from 'react';
import { Text, ScrollView} from 'react-native';
import { Location, Permissions } from 'expo';
import Expo from "expo";

export default class Listings extends React.Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <Text>
                {this.props.listings.length && this.props.listings.map(listing => {
                    return(<Text key={this.props.listings.indexOf(listing)}>
                        {listing.name}{"\n"}
                        {listing.address}{"\n"}
                        {listing.phone}{"\n"}
                        {listing.hours}{"\n"}{"\n"}
                    </Text>)
                })}
            </Text>
        );
    }
}
