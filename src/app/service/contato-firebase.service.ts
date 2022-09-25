import { Injectable } from '@angular/core';
import { Contatos } from '../models/contatos';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContatoFirebaseService {
  private PATH : string = 'contatos';

  constructor(private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage ) { }

  getContato(id: string){
    return this.angularFirestore
    .collection(this.PATH).doc(id).valueChanges();
  }

  getContatos(){
    return this.angularFirestore
    .collection(this.PATH).snapshotChanges();
  }

  inserirContato(contato: Contatos){
    return this.angularFirestore.collection(this.PATH)
    .add({nome: contato.nome, telefone: contato.telefone,
    genero: contato.genero,
    data_nascimento: contato.data_nacimento,
    dowloandURL: contato.downloadURL})
  }
   
  editarContato(contato: Contatos, id: string){
    return this.angularFirestore
    .collection(this.PATH).doc(id)
    .update({nome: contato.nome, telefone: contato.telefone,
    genero: contato.genero,
    data_nascimento: contato.data_nacimento
  });
  }

  excluirContato(contato: Contatos){
    return this.angularFirestore
    .collection(this.PATH).doc(contato.id)
    .delete();
  }

  enviarImagem(imagem:any, contato:Contatos){
    const file = imagem.item(0);
    if(file.type.split("/")[0]!= 'imagem'){
      console.error('Tipo não suportado');
      return;
    }
    const path = 'imagens/'${new Date().getTime()}_${file.name};
    const fileRef= this.angularFireStorage.ref(path);//arquvo de referencia
    let task= this.angularFireStorage.upload(path,file);
    task.snapshotChanges().pipe(
      finalize(()=>{
        let uploadFile = fileRef.getDownloadURL();
        uploadFile.subscribe(resp=>{
          ContatoFirebaseService.downloadURL= resp;
          this.inserirContato(contato);
        })
      })
    ).subscribe();
    return task;
  }
   
}
