const productsList = document.querySelector('#products')

const shoppingCart = []
let buttons
let products

const productComponent = ({ imageURL, name, description, price }) => `
    <article class="w-full h-fit flex flex-col gap-2">
        <img src="${imageURL}" alt="${name} image" />
        <h2 class="text-2xl font-medium">${name}</h2>
        <p class="h-10 text-sm font-medium text-gray-700">${description}</p>
        <p class="text-3xl font-bold text-red-600">${price} kr</p>
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
        <li class="flex w-full p-2 items-center border-t border-gray-300">
            <p class="ml-auto">Total: ${cartTotal}kr</p>
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

/*
[
    {
        "id": 1,
        "name": "Soffa",
        "price": 6995,
        "description": "En soffa som är skön att sitta i.",
        "imageURL": "https://www.ikea.com/se/sv/images/products/vimle-3-sitssoffa-gunnared-beige__0514366_pe639439_s5.jpg?f=xl"
    },
    {
        "id": 2,
        "name": "Bord",
        "price": 4950,
        "description": "Ett bord som är bra att ha.",
        "imageURL": "https://www.ikea.com/se/sv/images/products/moerbylanga-bord-ekfaner-brunlaserad__0737110_pe740888_s5.jpg?f=xl"
    },
    {
        "id": 3,
        "name": "Stol",
        "price": 999,
        "description": "En stol som är skön att sitta på.",
        "imageURL": "https://www.ikea.com/se/sv/images/products/skruvsta-skrivbordsstol-ysane-vit__0724712_pe734595_s5.jpg?f=xl"
    },
    {
        "id": 4,
        "name": "Lampa",
        "price": 499,
        "description": "En lampa som lyser upp rummet.",
        "imageURL": "https://www.ikea.com/se/sv/images/products/tvaerhand-bordslampa-svart-bambu__1027181_pe834780_s5.jpg?f=xl"
    }
]

*/
