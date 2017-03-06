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
  ListView,
  Text,
  TouchableOpacity
} from 'react-native';

import {
  observable,
  action,
  computed,
  useStrict
} from 'mobx';
import {
  observer
} from 'mobx-react/native';

useStrict(true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cartList: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 5
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1'
  },
  name: {
    fontSize: 18,
    color: '#333'
  },
  price: {
    color: '#F3F',
    marginLeft: 10,
    flex: 1,
  },
  count: {
    marginRight: 10
  },
  btn: {
    padding: 5,
    marginHorizontal: 2,
    borderWidth: 1,
  },
  active: {
    backgroundColor: '#e1fEfE'
  }
});

class CartItem {

  name = '';
  price = 0;
  cart = null;

  @observable
  count = 0;

  constructor(name, price, cart) {
    this.name = name;
    this.price = price;
    this.cart = cart;
  }

  @computed
  get selected() {
    return this.cart.selectedItem === this;
  }

  @action('商品数量增加')
  inc = () => {
    ++this.count;
  }

  @action('商品数量减少')
  dec = () => {
    if (this.count > 0) {
      --this.count;
    }
  }

  @action('当前项被选中')
  select = () => {
    this.cart.selectedItem = this;
  }

  @action('删除当前项')
  del = () => {
    this.cart.items.remove(this);
    // 如果删除的项刚好是选中的那项
    if (this.selected) {
      this.cart.selectedItem = null;
    }
  }

};

class Cart {

  @observable
  items = [];

  // 选中的项
  @observable
  selectedItem = null;

  constructor() {
    this.initCart();
  }

  @action('初始化数据')
  initCart() {
    for (let i = 0; i < 150; i++) {
      this.items.push(new CartItem(
        `商品${i}`,
        Math.floor(Math.random() * 100000) / 100,
        this
      ));
    }
    this.items.push(new CartItem('附加商品1', 100, this));
    this.items.push(new CartItem('附加商品2', 123.4, this));
    this.items.push(new CartItem('附加商品3', 12345, this));
  }

  @computed
  get itemList() {
    return this.items;
  }

  @computed
  get count() {
    return this.items.reduce((a, b) => a + b.count, 0);
  }

  @computed
  get price() {
    return this.items.reduce((a, b) => a + (b.price * b.count), 0);
  }
}

@observer
class Item extends Component {
  
  static propTypes = {
    data: PropTypes.instanceOf(CartItem),
  };

  render() {
    const {
      data
    } = this.props;
    return (
      <TouchableOpacity style={[styles.item, data.selected && styles.active ]} onPress={data.select}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.price}>${data.price}</Text>
        <Text style={styles.count}>{data.count}</Text>
        <Text style={styles.btn} onPress={data.inc}>+</Text>
        <Text style={styles.btn} onPress={data.dec}>-</Text>
        <Text style={styles.btn} onPress={data.del}>x</Text>
      </TouchableOpacity>
    );
  }
};

const Info = observer(function({
  cart
}) {
  const { count, price, selectedItem } = cart;
  return (
    <Text>
      Count: {count} {'\n'}
      Price: {price.toFixed(2)} {'\n'}
      {selectedItem && <Text>当前选中商品：{selectedItem.name}</Text>}
    </Text>
  );
});


@observer // 此处加入 observer 为了删除功能
export default class Demo extends Component {
  static title = '6 - List & Global Computed';

  cart = new Cart();

  ds = new ListView.DataSource({
    rowHasChanged: (v1, v2) => v1 !== v2,
  });

  renderRow = (data) => {
    return (
      <Item data={data} />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.ds.cloneWithRows(this.cart.itemList.slice())}
          renderRow={this.renderRow}
          style={styles.cartList}
        />
        <Info cart={this.cart} />
      </View>
    );
  }
}