import { Component, OnInit, OnChanges, Input, Output, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Router } from "@angular/router";

import { Contato } from "./contato.model";
import { ContatoService } from "./contato.service";

@Component({
    moduleId: module.id,
    selector: 'contato-busca',
    templateUrl: 'contato-busca.component.html',
    styles: [`
       .cursor-pointer:hover{
           cursor: pointer;
       }
    `]
})

export class ContatoBuscaComponent implements OnInit, OnChanges {
    @Input() busca: string;
    @Output() buscaChange: EventEmitter<string> = new EventEmitter<string>();
    contatos: Observable<Contato[]>;
    private termosDaBusca: Subject<string> = new Subject<string>();
    constructor(
        private contatoService: ContatoService,
        private router: Router
    ) { }

    ngOnInit() { 
        this.contatos = this.termosDaBusca
            .debounceTime(500) //aguarda x milisegundos até emitir novos eventos
            .distinctUntilChanged() //verifica a ultima busca realizada. Ignore se o proximo termo de busca for igual ao anterior
            .switchMap(term => {
                return term ? this.contatoService.search(term) : Observable.of<Contato[]>([]);
            }) //retorna o observable da ultima requisição
            .catch(err => {
                console.log(err);
                return Observable.of<Contato[]>([]);
            }); 
    }

    ngOnChanges(changes: SimpleChanges){
        let busca: SimpleChange = changes['busca'];
        this.search(busca.currentValue);
    }

    search(term: string): void{
        console.log(term);
        this.termosDaBusca.next(term);
        this.buscaChange.emit(term);
    }

    verDetalhe(contato: Contato): void{
        let link = ['contato/save', contato.id];
        this.router.navigate(link);
        this.buscaChange.emit("");
    }
}