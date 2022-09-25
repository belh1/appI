import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContatoFirebaseService } from 'src/app/service/contato-firebase.service';
import { Contatos } from '../../models/contatos';
import { ContatosService } from '../../services/contatos.service';
//controle da pagina , base para o html funcionar

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
   contatos: Contatos[];

   //get em contatos
  constructor(private router: Router,
    private contatoFirebaseService: ContatoFirebaseService) {
    this.carregarContatos();
    }
   
    carregarContatos(){
      this.contatoFirebaseService.getContatos()
      .subscribe(res => {
      this.contatos = res.map(e => {
      return{
      id: e.payload.doc.id,
      ...e.payload.doc.data() as Contatos
      }as Contatos;
      });
    });
    }

  irParaCadastrar(){
    this.router.navigate(["/cadastrar"]);
  }

  irParaDetalhar(contato:Contatos){
    //passa o estado do objeto inteiro de contato,
    this.router.navigateByUrl("/detalhar",{state:{objeto:contato}});
  }

}
