import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contatos } from 'src/app/models/contatos';
import { ContatosService } from 'src/app/services/contatos.service';
import { AlertController } from '@ionic/angular'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContatoFirebaseService } from 'src/app/service/contato-firebase.service';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
})
export class DetalharPage implements OnInit {
  contato:Contatos;
  data: string;
  edicao: boolean = true;
  form_detalhar: FormGroup;
  isSubmitted: boolean = false;

  constructor(private router: Router,
    private alertController: AlertController,
    private contatoFS: ContatoFirebaseService,
    private contatoService: ContatosService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.data = new Date().toISOString();
    this.contato = nav.extras.state.objeto;
    this.form_detalhar= this.formBuilder.group({
      nome: [this.contato.nome, [Validators.required]],
      telefone:[this.contato.telefone,[Validators.required,Validators.minLength(10)]],//2 validador
      genero:[this.contato.genero,[Validators.required]],
      data_nacimento:[this.contato.data_nacimento,[Validators.required]]
        
  });
}

  get errorControl() {
    return this.form_detalhar.controls;
  }

  submitForm() : boolean {
    this.isSubmitted = true;
    if (!this.form_detalhar.valid) {
      this.presentAlert('Agenda', 'Erro', 'Todos os campos sao obrigatórios');
      return false;
    } else {
      this.editar();
    }
  }

  alterarEdicao() {
    if (this.edicao == true) {
      this.edicao = false;
    } else {
      this.edicao = true;
    }
  }

  editar(){
    this.contatoFS
    .editarContato(this.form_detalhar.value, this.contato.id)
    .then(()=>{
    this.presentAlert("Agenda", "Sucesso", "Edição Realizado");
    this.router.navigate(["/home"]);
    })
    .catch((error)=>{
    this.presentAlert("Agenda", "Sucesso", "Edição Realizado");
    console.log(error);
    })
    }


    excluir(): void{
      this.presentAlertConfirm("Agenda", "Excluir Contato",
      "Você realmente deseja excluir o contato?")
      this.excluirContato();
    }

    excluirContato(){
      this.contatoFS.excluirContato(this.contato)
      .then(()=>{
      this.presentAlert("Agenda", "Sucesso", "Cadastro Excluído!");
      this.router.navigate(["/home"]);
      })
      .catch((error)=>{
      console.log(error);
      this.presentAlert("Agenda", "Erro", "Contato Não Encontrado!");
      })
      }

irParaHome(){
  this.router.navigate(["/home"]);
}




  async presentAlert(cabecalho : string, subcabecalho: string,mensagem : string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: mensagem,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async presentAlertConfirm(cabecalho : string, subcabecalho: string,mensagem : string) {
    const alert = await this.alertController.create({
      header: cabecalho,
      subHeader: subcabecalho,
      message: mensagem,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.excluirContato();
          },
        },
      ],
    });

    await alert.present();
  }
}

 