export interface ServiceInterface<T>{
    
    findAll(): Promise<T[]>; //retorna uma promise com o array do tipo generico
    find(id:number): Promise<T>;
    create(object: T): Promise<T>;
    update(object: T): Promise<T>;
    delete(object: T): Promise<T>;
}