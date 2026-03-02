import { categoriaConfig } from "./componentes/config.js"
import { capitalizar } from "./componentes/capitalizar.js"

const item = document.querySelector("#item")
const quantidade = document.querySelector(".quantidade")
const unidadeQuantidade = document.querySelector("#unidade")
const categoria = document.querySelector("#categoria")
const botao = document.querySelector("#btn")
const checkboxes = document.querySelectorAll(".meuCheck")

// Criando a Lista
const itens = []

// Criando ID
let idItens = 1

// Pegando dodos e Adicionando na Lista
const pegarItens = () => {
    botao.addEventListener("click", () => {
        const categoriaTexto = categoria.selectedOptions[0].text
        const unidadeData = unidadeQuantidade.selectedOptions[0].dataset.unidade

        // Verificação
        const campos = document.querySelectorAll("#item , .quantidade, #unidade, #categoria")

        let formularioValido = true

        campos.forEach((campo) => {
            if(!campo.value.trim()){
                Toastify({
                    text: `<span class="material-symbols-outlined iconErro">
error
</span> ${campo.dataset.mensagem}`,
                    duration: 3000,
                    close: true,
                    position: "center",
                    gravity: "top",
                    className: "erro",
                    escapeMarkup: false,
                }).showToast();

                formularioValido = false
            }

            
        })

        if(!formularioValido) return

        const itensObjeto = {
            id: idItens++,
            item: capitalizar(item.value),
            quantidade: quantidade.value,
            unidade: unidadeData,
            categoria: categoriaTexto,
            selecionado: false
        }

        itens.push(itensObjeto)

        salvarNoLocalStorage()

        criarItem(itensObjeto)
        Toastify({
                    text: `<span class="material-symbols-outlined iconSucesso">
check
</span>Adicionado com Sucesso`,
                    duration: 2000,
                    position: "center",
                    gravity: "top",
                    className: "sucesso",
                    escapeMarkup: false,
                }).showToast();


        console.log(itens)
        

        console.log(itensObjeto)

        // Limpando os Campos
        item.value = ""
        quantidade.value = ""
        unidadeQuantidade.selectedIndex = 0
        categoria.selectedIndex = 0
        

    })
        
}


function criarItem(lista) {

    const config = categoriaConfig[lista.categoria]

    const secaoItem = document.createElement('section')
    secaoItem.classList.add("lista", "naoSelecionado")
    secaoItem.dataset.id = lista.id

    const divItem = document.createElement('div')
    divItem.classList.add('itens')

    const inputCheckbox = document.createElement('input')
    inputCheckbox.type = "checkbox"
    inputCheckbox.id = `itemId${lista.id}`

    if(lista.selecionado){
        inputCheckbox.checked = true
        secaoItem.classList.remove("naoSelecionado")
        secaoItem.classList.add("selecionado")
    }

    const divConteudo = document.createElement('div')
    divConteudo.classList.add("column", "conteudo")

    const labelItem = document.createElement('label')
    labelItem.classList.add("nomeItens")
    labelItem.setAttribute("for", `itemId${lista.id}`)
    labelItem.textContent = lista.item

    const paragrafoUnidade = document.createElement('p')
    paragrafoUnidade.id = "quantidadeItens"
    paragrafoUnidade.textContent = `${lista.quantidade} ${lista.unidade}`

    const divCategoriaItem = document.createElement('div')
    divCategoriaItem.classList.add("categoriaItem", "conteudo")
    divCategoriaItem.style.backgroundColor = config.background

    const img = document.createElement('img')
    img.setAttribute("id", "imagemItem")
    img.setAttribute('src', config.imagem)

    const paragrafoCategoria = document.createElement('p')
    paragrafoCategoria.style.color = config.cor
    paragrafoCategoria.textContent = lista.categoria

    const iconePontos = document.createElement('span')
    iconePontos.classList.add("material-symbols-outlined", "btnPonto" )
    iconePontos.textContent = 'more_vert'
    

    // Montagem correta
    divConteudo.appendChild(labelItem)
    divConteudo.appendChild(paragrafoUnidade)

    divCategoriaItem.appendChild(img)
    divCategoriaItem.appendChild(paragrafoCategoria)

    
    divItem.appendChild(inputCheckbox)
    divItem.appendChild(divConteudo)
    divItem.appendChild(divCategoriaItem)

    divItem.appendChild(iconePontos)

    secaoItem.appendChild(divItem)
    document.body.appendChild(secaoItem)

}

// Seção selecionar
const selecionarItem = () => {
        document.addEventListener("change", event => {
            
            if(event.target.type === "checkbox"){

                const checkbox = event.target
                const secao = checkbox.closest(".lista")

                // pegar o id
                const id = parseInt(checkbox.id.replace("itemId", ""))
                // Encontrar o item na Array
                const itemEncontrado = itens.find(item => item.id === id)
                if(itemEncontrado){
                    itemEncontrado.selecionado = checkbox.checked
                    salvarNoLocalStorage()
                }

                const lista = event.target.closest(".lista")
                lista.classList.toggle("selecionado", event.target.checked)
                lista.classList.toggle("naoSelecionado", !event.target.checked)

                console.log(itens)

                
                
            }
        })

    
}

// Seção Modal
const ativarModal = () => {
    const modal = document.querySelector("#modal")

document.addEventListener("click", (event) => {

    const botao = event.target.closest(".btnPonto")
    const btnExcluir = event.target.closest("#btnExcluir")

    if (botao) {
        const item = botao.closest(".lista")

        item.appendChild(modal)

        modal.classList.toggle("ativo")
    } 
    else if (!modal.contains(event.target)) {
        modal.classList.remove("ativo")
    }

    if(btnExcluir){
        const lista = btnExcluir.closest(".lista")

        const id = parseInt(lista.dataset.id)

        const confirmar = confirm("Deseja excluir esse item?")

        if(confirmar){

            excluirItem(id)

            lista.remove()

            Toastify({
                text: `<span class="material-symbols-outlined iconSucesso">
    check
    </span>Item Excluído`,
                duration: 2000,
                position: "center",
                gravity: "top",
                className: "excluido",
                escapeMarkup: false,
            }).showToast()
        }


    }
})
}

// Salvando Itens no LocalStorage
const salvarNoLocalStorage = () => {
    localStorage.setItem("ListaDeItens", JSON.stringify(itens))
}

// Carregando os  dados do localStorage
const carregarDoLocalStorage = () => {
    const dadosSalvos = localStorage.getItem("ListaDeItens")

    if(dadosSalvos){
        const listaSalva = JSON.parse(dadosSalvos)

        listaSalva.forEach(item => {
            itens.push(item)
            criarItem(item)
        })

        idItens = listaSalva.length > 0 ? Math.max(...listaSalva.map(item => item.id)) + 1 : 1
    }
}

// Excluindo o item
const excluirItem = (id) => {
    const index = itens.findIndex(item => item.id === id)
    if(index !== -1){
        itens.splice(index, 1)
    }

    salvarNoLocalStorage()
}

carregarDoLocalStorage()
ativarModal()
selecionarItem()
pegarItens()