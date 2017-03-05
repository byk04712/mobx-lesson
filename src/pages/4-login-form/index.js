/**
 * Created by tdzl2003 on 1/20/17.
 */

import React, {
  PropTypes,
  Component
} from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';
import validate from 'mobx-form-validate';
import {
  observable,
  toJS,
  useStrict
} from 'mobx';

// 使用严格模式，所有修改 observable 操作，都得在 action 里进行
// useStrict(true);

import {
  FormProvider,
  FormItem,
  Submit
} from './components/form';


class LoginForm {
  @observable
  @validate(/^1\d{10}$/, 'Please input a valid phone number.')
  mobile = '';

  @observable
  @validate(/^.+$/, 'Please input any password.')
  pwd = '';

  submit = async() => {
    // await post('/login', toJS(this));
    alert(JSON.stringify(toJS(this)));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
});

export default class LoginPage extends Component {
  static title = '4 - Login Form';

  form = new LoginForm();

  render() {
    return (
      <FormProvider form={this.form}>
        <View style={styles.container}>
          <FormItem name="mobile" underlineColorAndroid="transparent">Mobile</FormItem>
          <FormItem secureTextEntry name="pwd">Password</FormItem>
          <Submit onSubmit={this.form.submit}>Login</Submit>
        </View>
      </FormProvider>
    );
  }

  // submit = async() => {
  //   try {
  //     await this.form.submit();
  //     this.props.navigator.push({
  //       ...
  //     })
  //   } catch(err) {
  //     console.error(err);
  //   }
  // }
}