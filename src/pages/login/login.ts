import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public storage: Storage

    ) {
      this.loginForm = this.formbuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]]
      })
  }

  submitLogin(){
    this.afAuth.auth.signInWithEmailAndPassword(
      this.loginForm.value.email, this.loginForm.value.password)
      .then((response) => {
        console.log(response);
        let user = {
          email: this.loginForm.value.email,
          uid: response.uid
        };
        this.storage.set('user',user)
        .then(() => {
          this.navCtrl.setRoot('start-page');
        })
      })
      .catch((error) => {
        if(error.code == 'auth/wrong-password'){
          this.showAlert('Erro', 'Senha incorreta. Digite  novamente.');
          this.loginForm.controls['password'].setValue(null);
        }
      })
  }

  showAlert(title: string, subtitle: string) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
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

  create() {
    this.navCtrl.push('create-user')
  }

}
