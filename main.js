const productsList = document.querySelector('#products')

const shoppingCart = []
let buttons
let products

const productComponent = (product) => `
    <article class="w-full h-fit flex flex-col gap-2">
        <img src="${product.imageURL}" alt="product image" />
        <h2 class="text-2xl font-medium">${product.name}</h2>
        <p class="h-10 text-sm font-medium text-gray-700">${product.description}</p>
        <p class="text-3xl font-bold text-red-600">${product.price} kr</p>
        <button id="product-button" class="bg-gray-900 hover:bg-gray-800 text-white text-sm w-fit py-2 px-5 rounded-full">
            Lägg till
        </button>
    </article>
`

const shoppingCartComponent = (cartItem) => `
    <li class="flex w-full p-3 items-center border-t border-gray-300">
        <img
            class="h-12"
            src="${cartItem.imageURL}"
            alt="product image"
        />
        <div class="flex flex-col justify-between ml-4">
            <p class="text-lg">${cartItem.name}</p>
            <p class="text-sm">${cartItem.quantity}</p>
        </div>
        <p class="font-medium ml-auto">${cartItem.price}kr</p>
    </li>
`

const displayCart = () => {
    const shoppingCartList = document.querySelector('#cart-list')
    shoppingCartList.innerHTML = ''

    for (const cartItem of shoppingCart) {
        shoppingCartList.innerHTML += shoppingCartComponent(cartItem)
    }

    const cartTotal = shoppingCart.reduce((acc, item) => acc + item.price * item.quantity, 0)

    shoppingCartList.innerHTML += `
        <li class="flex w-full p-4 items-center border-t border-gray-300">
            <p class="font-medium ml-auto">Total: ${cartTotal}kr</p>
        </li>
    `
}

const fetchProducts = async () => {
    const response = await fetch('./products.json')
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    const json = await response.json()
    products = json
    displayProducts(json)
}

const displayProducts = async (products) => {
    productsList.innerHTML = ''
    for (const product of products) {
        productsList.innerHTML += productComponent(product)
    }

    buttons = document.querySelectorAll('#product-button')

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const cartItem = shoppingCart.find((item) => item.id === products[index].id)

            if (cartItem) {
                cartItem.quantity++
            } else {
                shoppingCart.push({ ...products[index], quantity: 1 })
            }

            displayCart()
        })
    })

    displayCart()
}

document.addEventListener('DOMContentLoaded', async () => fetchProducts())

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
})

document.querySelector('#search').addEventListener('input', (event) => {
    const input = event.target.value.toLowerCase()

    const filteredProducts = products.filter((product) => {
        if (product.name.toLowerCase().includes(input)) {
            return product
        } else if (product.description.toLowerCase().includes(input)) {
            return product
        } else {
            return null
        }
    })

    displayProducts(filteredProducts)
})
