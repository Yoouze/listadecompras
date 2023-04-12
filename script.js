// ****** Select items ******
const alert = document.querySelector ('.alert');
const formulario = document.querySelector ('.lista-compras');
const compras = document.getElementById ('compras');
const inserir = document.querySelector ('.submit-button');
const Lcompras = document.querySelector ('.lista-compras');
const lista = document.querySelector ('.lista-de-itens');
const limpar = document.querySelector ('.limpar');

// opção de editar
let editElement;
let editFlag = false;
let editID = "";

// ****** Event Listeners ******
// formulario de inserção
formulario.addEventListener("submit", addItem);
// Limpar itens
limpar.addEventListener('click', limparItens);
// carregar itens
window.addEventListener("DOMContentLoaded", setupItems);
// ****** Funções ******
function addItem(e) {
    e.preventDefault();
    const value = compras.value;

    const id = new Date(). getTime().toString();
    
    if(value && !editFlag) {
        createListItem(id, value)
    // disparar alerta 
    displayAlert("Item adicionado com sucesso", "sucess");
    // mostrar lista
    Lcompras.classList.add("mostrar-lista");
    // adicionar ao armazenamento local
    addToLocalStorage(id, value);
    // definir de volta a padrão
    setBackToDefault();
    } else if(value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('Item alterado', 'sucess');
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault(); 
    } else {
    displayAlert("Por favor insira um item", "danger");    
    }
}
// disparar alerta
function displayAlert(text, action) {
        alert.textContent = text;
        alert.classList.add(`alert-${action}`);

    //remover alerta
    setTimeout(function() {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}
// limpar itens
function limparItens() {
    const items = document.querySelectorAll('.itens');

    if(items.length > 0) {
        items.forEach(function (item) {
            const elementId = item.getAttribute('data-id');
            lista.removeChild(item);
            removeFromLocalStorage(elementId); // remover dados do armazenamento local
        });
    }
    Lcompras.classList.remove("show-limpar");
    displayAlert("Lista vazia", "danger");
    setBackToDefault();
    //localStorage.removeItem("lista");
}
// função deletar
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    lista.removeChild(element);
    if(lista.children.length === 0) {
        Lcompras.classList.remove("mostrar-lista")
    }
    displayAlert('item removido', 'danger');
    setBackToDefault();
    // remover do armazenamento local
    removeFromLocalStorage(id);
}

// função editar
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    compras.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    inserir.textContent = "editar";
}

// voltar ao padrão
function setBackToDefault() {
    compras.value = "";
    editFlag = false;
    editID = "";
    inserir.textContent = "Inserir";

}

// ****** Armazenamento Local ******
function addToLocalStorage(id, value) {
    const iCompra = {id, value};
    let itenS = getLocalStorage();
    
itenS.push(iCompra);
localStorage.setItem("lista", JSON.stringify(itenS));
//console.log("adicionado ao armazenamento local");
}
function removeFromLocalStorage(id){
    let itenS = getLocalStorage();

    itenS = itenS.filter(function(item){
        if(item.id !==id){
            return item;
        }
    });
    localStorage.setItem("lista", JSON.stringify(itenS));
}
    
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("lista", JSON.stringify(items));
}
function getLocalStorage(){
   return localStorage.getItem('lista')
    ? JSON.parse(localStorage.getItem('lista')): [];
}
// localStorage API
// setItem
// getItem
// removeItem
// save as strings
//localStorage.setItem('item', JSON.stringify(['item', 'item 2']));
//const oranges =  JSON.parse(localStorage.getItem('item'));
//console.log(oranges);
//localStorage.removeItem('item');

// ****** Setup Items ******
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
    items.forEach(function(item){
        createListItem(item.id,item.value)   
    })
    Lcompras.classList.add('show-Lcompras')
    }
}

function createListItem(id, value){
    const element = document.createElement('article');
        // adicionar classe
        element.classList.add('itens');
        // adicionar ID
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="titulo">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-button">
                <i class="fa-solid fa-pen-to-square" style="color: #36dd68;"></i>
            </button>
            <button type="button" class="delete-button">
                <i class="fa solid fa-trash" style="color: #e51506"></i>
            </button>
        </div>`;
        const deletar = element.querySelector(".delete-button");
        const editar = element.querySelector(".edit-button");
        deletar.addEventListener("click", deleteItem);
        editar.addEventListener("click", editItem);
    // append child
    lista.appendChild(element);
}
