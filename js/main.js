let app = new Vue({
    el: '#app',
    methods: {
        addToCart() {
            this.cart += 1
        },
        decToCart(){
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
        updateProduct(variantImage) {
            this.image = variantImage
        }
    },
    data: {
        product: "Socks",
        image: "./assets/vmSocks-green-onWhite.jpg",
        altText: "A pair of socks",
        inStock: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        cart: 0,


    }
})
