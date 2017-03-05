/**
 * Created by tdzl2003 on 1/20/17.
 */

import {
  observable,
  computed,
  autorun,
  action,
  useStrict
} from 'mobx';

// 严格模式，规定修改所有 observable 成员的时候，必须放在 action 里修改
// useStrict(true);

class Foo {
  @observable
  selected = 0;

  @observable
  items = [];

  @computed
  get selectedItem() {
    if (this.selected >= this.items.length) {
      return null;
    }
    return this.items[this.selected];
  }

  // @action
  // setSelectedItem(index) {
  //   if (typeof index === 'number') {
  //     this.selected = index;
  //   }
  // }

  @action
  addItem(item) {
    this.items.push(item);
  }

  @action
  removeAt(id) {
    this.items.splice(id, 1);
    if (this.selected >= id) {
      this.selected--;
    }
  }

  @action
  removeSelected() {
    this.items.splice(this.selected, 1);
  }

}

export default function demo5() {
  const foo = new Foo();
  autorun(() => {
    console.log(`Current selected is: ${foo.selectedItem}`);
  });
  foo.addItem(0);
  foo.addItem(1);
  foo.addItem(2);
  foo.addItem(3);

  // foo.setSelectedItem(2);
  foo.selected = 2;

  foo.removeSelected();

  foo.removeAt(0);
}