import React, { Component } from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            description
            largeImage
        }
    }
`

 class SingleItem extends Component {
  render() {
    return (
      <Query query ={SINGLE_ITEM_QUERY}
      variables={{
          id:this.props.id,
      }}>
      {({error,loading,data})=> {
          if(error) return <p> Error </p>
          if(loading) return <p> Loading... </p>
          return <p> Single Item Component </p>
      }}
        <p> Single Item </p>
      </Query>
    )
  }
}


export default SingleItem;