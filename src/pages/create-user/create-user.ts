import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidateConfirmPassword } from '../../validators/confirmPassword';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';


@IonicPage({
  name:'create-user',
})
@Component({
  selector: 'page-create-user',
  templateUrl: 'create-user.html',
})
export class CreateUserPage {

  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
    this.registerForm = this.formbuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6), ValidateConfirmPassword]]
    })
  }

  submitForm () {
    console.log("deu certo");
    console.log(this.registerForm);
    this.afAuth.auth.createUserWithEmailAndPassword(
      this.registerForm.value.email, this.registerForm.value.password)
      .then((response) => {
        console.log(response);
        let user = {
          email: this.registerForm.value.email,
          nome: this.registerForm.value.name,
          uid: response.uid
        };
        this.storage.set('user',user).then(data =>{
          
          this.showAlert('Usuário cadastrado','Usuário cadastrado com sucesso.');
          this.navCtrl.setRoot('start-page');
        })

      })
      .catch((error) => {
        console.log("erro", error);
        if(error.code == 'auth/email-already-in-use'){
          this.showAlert('Erro','E-mail já cadastrado');
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

  login() {
    this.navCtrl.push('login')
  }

}