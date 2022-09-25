import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ContatoFirebaseService } from 'src/app/service/contato-firebase.service';


@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
})
export class CadastrarPage implements OnInit {
  data: string;
  form_cadastrar: FormGroup;
  isSubmitted: boolean = false;
  event: any;
  imagem: any;
  
  constructor(
    private alertController: AlertController,
    private loadingCtrl: LoadingController, 
    private router:Router, 
    private contatoFS:ContatoFirebaseService,
    private FormBuilder: FormBuilder) { }

//metodo chamado toda vez que inicia a pagina
  ngOnInit() {
    this.data = new Date().toISOString();
    //inicializar o form/campo de array,primeira parte inicializacao,2 validador
    this.form_cadastrar = this.FormBuilder.group({
      nome:["",[Validators.required]],
      telefone:["",[Validators.required,Validators.minLength(10)]],//2 validador
      genero:["",[Validators.required]],
      data_nacimento:["",[Validators.required]],
      imagem:["",[Validators.required]]
    });
  }

  uploadFile(iagem:any){
    this.imagem = imagem.files;
  }
  get errorControl(){
    return this.form_cadastrar.controls;//retornar os erros
  }

  submitForm(): boolean{
    this.isSubmitted = true;
    if(!this.form_cadastrar.valid){//se nega se é valido, conteudo nao conrrespondido
      this.presentAlert("Agenda","Erro","Todos os campos são obrigatorios");
      return false;
    }else{//caso deu certo
      this.cadastrar();
    }
  }


  //cadastra contatos
  private cadastrar(): void{
    this.showLoading("Aguarde...", 10000);
    this.contatoFS.
    enviarImagem(this.imagem,this.form_cadastrar.value).then(() => {
    this.loadingCtrl.dismiss();
    this.presentAlert("Agenda", "Sucesso", "Cadastro Realizado");
    this.router.navigate(["/home"]);
    })
    .catch((error) => {
    this.loadingCtrl.dismiss();
    this.presentAlert("Agenda", "Erro", "Erro ao realizar Cadastro!");
    console.log(error);
    })
  }
  


 
  //vai executar ate que seja exibido a mensagem,(diparar o await)
  //funcao generica 
  async presentAlert(header : string,  subHeader: string,message : string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader:  subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showLoading(mensagem: string, duracao: number) {
    const loading = await this.loadingCtrl.create({
    message: mensagem,
    duration: duracao,
    });
    loading.present();
  }

  irParaHome(){
    this.router.navigate(["/home"]);
  }
  

}
