var productContainer = document.querySelector('.product-container');
var slideContainer = document.querySelector('.slide-container');
var calculateButton = document.getElementById('calculate');
var resetButton = document.getElementById('reset');
var productCountSelect = document.getElementById('productCount');
var botao = document.getElementById('meuBotao');
var alerta = document.getElementById('meuAlerta');
var fecharAlerta = document.getElementById('fecharAlerta');




calculateButton.addEventListener('click', calculateCheapestProduct);
resetButton.addEventListener('click', resetInputs);
productCountSelect.addEventListener('change', updateProductCount);



// Forma automatica de inicializacao de componentes, associo com UseEffect.

document.addEventListener('DOMContentLoaded', updateFocusButton);

document.addEventListener('DOMContentLoaded', function () {
    var count = document.getElementById('productCount').value;

    for (var i = 1; i <= count; i++) {
        var valueInput = document.querySelector(`#product${i} .value`);
        var weightInput = document.querySelector(`#product${i} .weight`);
        valueInput.value = 'R$ 0,00';
        weightInput.value = '0';
    }

    if (count === '2') {
        slideContainer.style.display = 'none';
    } else {
        slideContainer.style.display = 'flex';
    }
});
function addProduct(id) {
    var product = document.createElement('div');
    product.className = 'product';
    product.id = 'product' + id;
    product.innerHTML = `
        <h2 class="title_product" tabindex="-1">Produto ${id}</h2>
        <p class="title_value">Valor :<input type="text" oninput="formatarMoeda(this)" class="value" value="R$ 0,00"></p>
        <p class="title_weight">Peso :<input type="number"class="weight" value="0"></p>
    `;
    slideContainer.appendChild(product);
    slideContainer.style.display = 'flex';

    // Focar o elemento com a classe 'button_panel' após o produto 3 ser adicionado

    if (id == 3) {
        document.querySelector('.button_panel').focus();
    }
}


// Função do seletor para acionar o slide-container, o container com o Produto 3 e 4.

productCountSelect.addEventListener('change', function () {
    var count = this.value;
    if (count === '2') {
        slideContainer.style.display = 'none';
    } else {
        slideContainer.style.display = 'flex';
    }
});






function removeProduct(id) {
    var product = document.getElementById('product' + id);
    slideContainer.removeChild(product);
}

// Cálculo  da relação Peso x Valor com as tratativas de erros para usuarios. 

function calculateCheapestProduct() {
    var products = document.querySelectorAll('.product');
    var cheapestProduct = null;
    var cheapestValuePerWeight = Infinity;
    var resultElement = document.getElementById('result');
    var resultAlertElement = document.getElementById('resultAlert');

    for (var i = 0; i < products.length; i++) {
        var valueInput = products[i].querySelector('.value');
        var weightInput = products[i].querySelector('.weight');

        var value = parseFloat(valueInput.value.replace('R$ ', '').replace(',', '.'));
        var weight = parseInt(weightInput.value, 10);

        if (Number.isNaN(value) || Number.isNaN(weight) || value === 0 || weight === 0 || weight < 0) {
            if (resultElement && productCountSelect.value == '2') {
                resultElement.innerHTML = `
                <p class="alert">Por favor, preencha os campos de valor e peso com números válidos e diferentes de zero para o Produto ` + (i + 1) + `</p>`;
            }
            // Verifique se o valor selecionado é '3' ou '4'
            if (productCountSelect.value == '3' || productCountSelect.value == '4') {
                // Mostre o alerta personalizado
                document.getElementById('meuAlerta').style.display = 'block';

                // Atualize o conteúdo do alerta personalizado
                resultAlertElement.textContent = `Por favor, preencha os campos de valor e peso com números válidos e diferentes de zero para o Produto ` + (i + 1);
            }
            return;
        }

        if (value && weight) { 
            var valuePerWeight = value / weight;

            if (valuePerWeight < cheapestValuePerWeight) {
                cheapestValuePerWeight = valuePerWeight;
                cheapestProduct = products[i];
            }
        }
    }

    if (cheapestProduct) {
        if (resultElement && productCountSelect.value == '2') {
            resultElement.textContent = 'O produto mais barato é: ' + cheapestProduct.querySelector('h2').textContent;
        }

        if ((productCountSelect.value == '3' || productCountSelect.value == '4') && resultElement) {

            alerta.style.display = 'block';


            resultAlertElement.textContent = 'O produto mais barato é: ' + cheapestProduct.querySelector('h2').textContent;
        }
    }
}


// Função indicadora da quantidade de produtos que estao sendo calculados.

function showModeSelector(count) {
    var container = document.querySelector('.container_spam');
    if (container) {
        container.textContent = 'Você está comparando no modo de ' + count + ' produtos';
    }
}



productCountSelect.addEventListener('change', function () {
    showModeSelector(this.value);
});

document.addEventListener('DOMContentLoaded', function () {
    showModeSelector(productCountSelect.value);
});

// Filtro para restringir teclado.
var filtroTeclas = function (event) {
    return (event.charCode >= 48 && event.charCode <= 57)
}

// Filtro para input financeiro.
function formatarMoeda(input) {
    var valor = input.value.replace(/\D/g, '');
    valor = (parseFloat(valor) / 100).toFixed(2);
    valor = valor.replace('.', ',');
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    input.value = 'R$ ' + valor;
}

// Resetar os inputs
function resetInputs() {
    var resultElement = document.getElementById('result');
    resultElement.textContent = "";

    var valueInputs = document.querySelectorAll('.product .value');
    var weightInputs = document.querySelectorAll('.product .weight');

    for (var i = 0; i < valueInputs.length; i++) {
        valueInputs[i].value = 'R$ 0,00';
    }

    for (var i = 0; i < weightInputs.length; i++) {
        weightInputs[i].value = '0';
    }
}

// Seletor
function updateProductCount() {

    var count = parseInt(productCountSelect.value);
    var currentCount = document.querySelectorAll('.product').length;


    for (var i = currentCount + 1; i <= count; i++) {
        addProduct(i);
        var resultElement = document.getElementById('result');
        resultElement.textContent = "";

    }

    for (var i = count + 1; i <= currentCount; i++) {
        removeProduct(i);
        var resultElement = document.getElementById('result');
        resultElement.textContent = "";

    }

    document.getElementById('productCount').addEventListener('change', function () {
        if (this.value == '3') {
            document.getElementById('product3').focus();

        }

    });



}

// Alerta
fecharAlerta.onclick = function () {
    alerta.style.display = 'none';
}

// Comportamento Scroll dos botoes de focus, exclusivo para mobiles e tablets.

var bottomButton = document.getElementById('focusButton');
bottomButton.addEventListener('click', function () {
    document.body.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
});


var topButton = document.getElementById('topButton');
topButton.addEventListener('click', function () {
    setTimeout(function () {
        document.body.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }, 100);
});




// Condicional para o botao de foco no mobile funcione a partir do Produto 3.

function updateFocusButton() {
    var count = productCountSelect.value;
    var topFocus = document.getElementById('topButton');
    var bottomFocus = document.getElementById('focusButton');

    if (count === '3' || count === '4') {
        topFocus.style.display = 'block';
        bottomFocus.style.display = 'block';
    } else {
        topFocus.style.display = 'none';
        bottomFocus.style.display = 'none';
    }




}

// Listener de eventos para o evento de mudança do productCountSelect
productCountSelect.addEventListener('change', updateFocusButton);


