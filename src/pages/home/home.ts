import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public storage: Storage) {

  }

  ionViewCanEnter(){
    this.storage.get('user')
    .then((resolve) => {
      console.log("teste", resolve);
      if(resolve && resolve.email!='' && resolve.uid != '') {
        this.navCtrl.setRoot('start-page');
      } else {
        return true;
      }
    })
    .catch((error) => {
      return true;
    })
  }

}
