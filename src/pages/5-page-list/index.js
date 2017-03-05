/**
 * Created by tdzl2003 on 1/20/17.
 */
import React, {
  PropTypes,
  Component
} from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';


import {
  observer
} from 'mobx-react/native';

import PageList from './PageList';

const {
  width,
  height
} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    width: width,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1'
  },
  evenRow: {
    backgroundColor: '#F7F7F7'
  }
});

class SamplePage extends PageList {
  fetchData() {
    return {
      count: 100, // 总数据
      results: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  }
}

@observer
export default class Demo extends Component {

  static title = '5 - Page List';

  ds = new ListView.DataSource({
    rowHasChanged: (v1, v2) => v1 !== v2
  });

  pageList = new SamplePage();

  renderRow = (row, sectionID, rowID) => (
    <View style={[styles.row, rowID % 2 == 0 && styles.evenRow]}>
      <Text>{rowID} - {row}</Text>
    </View>
  );

  render() {
    console.log('ListView render');
    return ( < ListView enableEmptySections dataSource = {
        this.ds.cloneWithRows(this.pageList.data.slice(0))
      }
      renderRow = {
        this.renderRow
      }
      onEndReached = {
        this.pageList.fetchMore
      }
      style = {
        styles.container
      }
      refreshControl = {
        <RefreshControl
            refreshing={this.pageList.isRefreshing}
            title={'刷新中'}
            onRefresh={this.pageList.refresh}
          />
      }
      />
    );
  }
}