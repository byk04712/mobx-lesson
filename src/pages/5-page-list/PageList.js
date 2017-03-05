/**
 * Created by tdzl2003 on 12/18/16.
 */

// Fetch list of data by page.
// Each item should be immutable or observable.

import {
  observable,
  computed,
  runInAction,
  useStrict,
  action
} from 'mobx';

useStrict(true);

export default class PageList {

  constructor() {
    setImmediate(() => {
      this.refresh();
    });
  }

  @observable
  isFetching = true; // defaults to true, waiting first refresh.

  @observable
  isRefreshing = false;

  @observable
  data = [];

  // count is -1 when we don't know the count.
  @observable
  count = -1;

  @computed
  get isOver() {
    return this.count >= 0 && this.data.length >= this.count;
  }

  @action('刷新')
  refresh = () => {
    // 立即刷新
    // this.isRefreshing = true;
    // this.fetch(true);

    // 延时 500 ms 刷新，显示刷新效果
    let that = this;
    that.isRefreshing = true;
    setTimeout(() => {
      return that.fetch(true);
    }, 500);
  }

  fetchMore = () => {
    return this.fetch();
  }

  @action('拉取数据')
  async fetch(refresh = false) {
    if ((!refresh && this.isFetching) || this.isOver) {
      return;
    }
    const skip = refresh ? 0 : this.data.length;
    this.isFetching = true;

    const {
      count,
      results
    } = await this.fetchData(skip);

    runInAction(() => {
      this.count = count;
      if (refresh) {
        // 完全刷新
        this.data.replace(results);
        console.log('refresh ', results);
      } else if (skip === this.data.length) {
        // 检查skip防止重入
        this.data.splice(this.data.length, 0, ...results);
        console.log('fetching ', this.data.slice());
      }
      this.isFetching = false;
      this.isRefreshing = false;
    });
  }

  fetchData() {
    console.warn('fetchData() should be overrided!');
    return {
      count: 0,
      results: [],
    };
  }
}