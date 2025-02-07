import React, { Component } from 'react'
import { Text, View, Image, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'

const { width } = Dimensions.get('window')

const Slider = props => (
  <View style={styles.container}>
    <Image style={styles.image} source={props.uri}></Image>
  </View>
)

const styles = {
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    image: {
      flex: 1,
      width
    }
}

export default class extends Component {
    constructor(props){
      super(props)
      this.state = {
          imageSlider: [
            require('../../assets/images/sliders/1.jpg'),
            require('../../assets/images/sliders/2.jpg'),
            require('../../assets/images/sliders/3.jpg')
          ]
      }
    }

    render(){
      return (
        <View>
            <Swiper autoplay height={240}>
            {
                this.state.imageSlider.map((item, i) =>
                <Slider uri={item} key={i} />)
            }
            </Swiper>
        </View>
      )
    }
}
