import { Component, OnInit } from "@angular/core";

import { Contato } from "./contato.model";
import { ContatoService } from "./contato.service";
import { DialogService } from "../dialog.service";

@Component({
    moduleId: module.id, //para achar a referencia do template
    selector: 'contatos-lista',
    templateUrl: './contatos-lista.component.html'
    //styleUrl: 'contatos-lista.components.scss'
})

export class ContatosListaComponent implements OnInit{
    contatos: Contato[];
    mensagem:{};
    classesCss: {};

    constructor(
        private contatoService: ContatoService,
        private dialogService: DialogService
    ){
        //não fazer nenhuma lógica mais complexa no construtor e sim no ciclo de vida do component
    }

    ngOnInit(): void{
        this.contatoService.getContatos()
            .then((contatos: Contato[]) => {
                this.contatos = contatos;
            }).catch(err => {
                console.log(err);
                this.mostrarMensagem({
                    tipo: 'danger',
                    mensagem: 'Ocorreu um erro ao carregar os contatos'
                })

            });
    }

    onDelete(contato: Contato): void{
        this.dialogService.confirm("Deseja deletar o contato " + contato.nome + "?")
            .then((canDelete: boolean) => {
                if(canDelete){
                    this.contatoService.delete(contato)
                        .then(() => {
                            this.contatos = this.contatos.filter(c => c.id != contato.id);
                            // se o id do contato da lista for diferente do contato.id ele permanece na lista
                            // se não ele é removido

                            this.mostrarMensagem({
                                tipo: 'success',
                                mensagem: 'Contato deletado!'
                            })
                        }).catch(err => {
                            console.log(err);
                            this.mostrarMensagem({
                                tipo: 'danger',
                                mensagem: 'Ocorreu um erro ao deletar o contato ' + contato.nome
                            })
                        });
                }else{

                }
            });
    }

    private mostrarMensagem(mensagem: {tipo: string, mensagem: string}): void{
        this.mensagem = mensagem;
        this.montarClasses(mensagem.tipo);
        setTimeout(() =>{
            this.mensagem = undefined;
        }, 3000)
    }

    private montarClasses(tipo: string): void{
        this.classesCss = {
            'alert': true
        }

        this.classesCss['alert-'+tipo] = true;
    }
}