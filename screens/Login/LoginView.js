import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
  KeyboardAvoidingView, Modal
} from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Spinner
} from "native-base";
import styles from "./styles";
import PropTypes from "prop-types";
import Logo from "../../components/Logo";
import LinearGradient from "react-native-linear-gradient";
import { encrypt } from "../../lib/keys";
import Axios from "axios";
import Loading, { setUrl, getUrl } from "../../api/ApiConstants";
let url;

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Identity: "",
      Password: "",
      modalvisible: false,
      nama: '',
      transporter: '',
      email: '',
      hp: '',
      validatedemail: false,
      buttondisabled: false,
      isLoading: false,
      udahLogin: '',
    };
  }

  async componentDidMount(){
    // await getUrl().then(result=>{
    //   url = result;
    //   console.log('===== url dalam login =====');
    //   console.log(result);
    // })
    
    await setUrl();
    await getUrl().then(result=>{
        url =result;
    });
    console.log('======= selesai get url =====');
    console.log(url);
    console.log('=================');
    console.log('Current route name is : '+ this.props.navigation.state.routeName);
    //console.log('Current parent'+this.props.navigation.dangerouslyGetParent().state.index);
  }

  validateemail=(text)=>{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    console.log(reg);
    if(reg.test(text) === false)
    {
      console.log("Email is Not Correct");

      this.setState({email:text, validatedemail: false})
      return false;
      }
    else {
      console.log('email correct');
      this.setState({email:text, validatedemail: true})
    }
  }

  daftar=async ()=>{
    this.setState({buttondisabled: true});
    let title = 'Invalid Input';
    if(this.state.nama === '' ) Alert.alert(title, 'Nama tidak boleh kosong!');
    else if(this.state.transporter === '') Alert.alert(title, 'Nama Transporter tidak boleh kosong!');
    else if(this.state.validatedemail === false) Alert.alert(title, 'Format Email tidak sesuai!');
    else if(this.state.hp === '') Alert.alert(title, 'No HP tidak boleh kosong!');
    else{
      let query = "insert into mt_temp_transporter (nama, nama_perusahaan, email, hp) values('"+ this.state.nama + "', '"+ this.state.transporter +"', '"+ this.state.email +"', '"+ this.state.hp +"')";
      await encrypt(query).then(result=>{
        query = result;
      });

      Axios.post(url.insert,{
        query: query
      }).then(result=>{
        this.setState({buttondisabled: false});
        Alert.alert('Terima kasih telah mendaftar.', 'Admin Mostrans akan segera menghubungi anda.', [
          {text: 'Ok', onPress: ()=>BackHandler.exitApp()}
        ]);
      }).catch(err=>{
        Alert.alert('Error', 'Gagal Mendaftar.');
        this.setState({buttondisabled: true});
        console.log(err);
      })
    }
  }

  closemodal=()=>{
    this.setState({modalvisible: false});
  }

  register=()=>{
    this.setState({modalvisible: true})
  }

  navigate = async () => {
    this.setState({ isLoading: true});
    //window.setInterval(this.setState({isLoading: true}), 10000);
    
    let EncIdentity = "";
    let EncPassword = "";

    await encrypt(this.state.Identity).then(result => {
      EncIdentity = result;
    });

    await encrypt(this.state.Password).then(result => {
      EncPassword = result;
    });

    this.props.onLogin(EncIdentity, EncPassword);
    //window.setTimeout(this.setState({isLoading: false}), 4000);
    //this.setState({ isLoading: false});
    
    //tambahin ini jika waktu loading screen kurang lama
    setTimeout(() => {this.setState({isLoading: false})}, 20000)
  };

  render() {
    const { Identity, Password } = this.state;

    return (
      <View style={styles.container}>
        <View style={{width: '100%', height: 200, position: 'absolute', bottom: 0}}>
          <Image resizeMode='cover' source={require('../../../assets/images/BackgroundFinal.jpg')} style={{flex: 1, width: undefined, height: undefined, opacity: 0.5}}/>
        </View>
        <Logo />
        <View style={styles.loginForm}>
          <Text style={styles.signTitle}>Transporter Login</Text>
          <LinearGradient
            colors={["#ffffff", "#ffffff", "rgba(47, 245, 166, 0.1)"]}
            style={styles.inputBox}
          >
            <View style={styles.SectionStyle}>
              <Image
                source={require("../../../assets/images/people.png")}
                style={styles.ImageStyle}
              />
              <TextInput
                style={{ flex: 1 }}
                underlineColorAndroid="rgba(0,0,0,0)"
                placeholder="Email | No Handphone"
                placeholderTextColor="#1e2427"
                selectionColor="#1e2427"
                keyboardType="email-address"
                value={Identity}
                onChangeText={input => this.setState({ Identity: input })}
                onSubmitEditing={() => this.password.focus()}
              />
            </View>
          </LinearGradient>
          <LinearGradient
            colors={["#ffffff", "#ffffff", "rgba(47, 245, 166, 0.1)"]}
            style={styles.inputBox}
          >
            <View style={styles.SectionStyle}>
              <Image
                source={require("../../../assets/images/lock.png")}
                style={styles.ImageStyle}
              />
              <TextInput
                style={{ flex: 1 }}
                underlineColorAndroid="rgba(0,0,0,0)"
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="#1e2427"
                value={Password}
                onChangeText={input => this.setState({ Password: input })}
                ref={input => (this.password = input)}
              />
            </View>
          </LinearGradient>
          <TouchableOpacity style={styles.button} onPress={this.navigate}>
            <Text style={styles.buttonText}>MASUK</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.button, styles.red]} onPress={this.register}>
            <Text style={styles.buttonText}>DAFTAR</Text>
          </TouchableOpacity> */}
          <View style={{marginBottom: 50}}/>
        </View>
        <Modal
          visible={this.state.modalvisible}
          onRequestClose={this.closemodal}
          transparent={true}          
        >
          <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#00000033'}}>
            <View style={styles.modalcontainer}>
              <View style={styles.row}>
                <Text style={styles.text}>Nama</Text>
                <Input style={styles.textbox} onChangeText={input=>this.setState({nama: input})}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Nama Transporter</Text>
                <Input style={styles.textbox} onChangeText={input=>this.setState({transporter: input})}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.text}>Email</Text>
                <Input style={styles.textbox} onChangeText={(text)=>this.validateemail(text)} keyboardType='email-address' value={this.state.email}/>
              </View>
              {/* {this.state.validatedemail ? false : <Text style={{fontSize: 8, textAlign: 'right', color: 'red'}}>Format Email Salah</Text>} */}
              <View style={styles.row}>
                <Text style={styles.text}>No HP</Text>
                <Input style={styles.textbox} onChangeText={input=>this.setState({hp: input})} keyboardType='phone-pad'/>
              </View>
              <TouchableOpacity style={[styles.button, styles.red]} onPress={this.daftar} disabled={this.state.buttondisabled}>
                <Text style={styles.buttonText}>DAFTAR</Text>
              </TouchableOpacity>
              {this.state.buttondisabled ? <Spinner/> : false}
            </View>
          </View>
        </Modal>
        {/* <View style={styles.signupTextCont}>
          <TouchableOpacity onPress={this.signup}>
            <Text style={styles.signupButton}> *Lupa Password</Text>
          </TouchableOpacity>
        </View> */}
        {this.state.isLoading ? <Loading/> : false}
      </View>
    );
  }
}

LoginView.propTypes = {
  onLogin: PropTypes.func
};

export default LoginView;
