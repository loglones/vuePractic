Vue.component('product', {
    template: `
    <div class="product">
        <div class="product-image">
            <img :alt="altText" :src="image"/>
        </div>
        
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ sale }}</p>
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            <b><i><p v-if="inStock">In stock / <del>Out of stock</del></p></i></b>
            <b><i><p v-if="!inStock"><del>In stock</del> / Out of stock</p></i></b>
            <p v-if="premium">Shipping : <del>{{ !shipping }}</del>  {{ shipping }}</p>
            <p v-else>Shipping : {{ shipping }}</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <div class="color-box"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 :style="{ backgroundColor:variant.variantColor }"
                 @mouseover="updateProduct(index)"></div>
            <div class="divSizes">
                <p class="sizeConf" v-for="size in sizes">{{ size }}</p>
            </div>
            <div class="contWithButton">
                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
                <button @click="decToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Decrement to cart</button>
            </div>
        </div>
    </div>`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            onSale: true,
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        decToCart(){
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if(this.onSale) {
                return `${this.brand}'s ${this.product} are on sale`;
            }
            else {
                return `${this.brand}'s ${this.product} are not on sale`;
            }
        },
        shipping() {
            if(this.premium) {
                return "Free";
            }
            else {
                return 2.99;
            }
        },
    },
    props: {
        premium: {
            type:  Boolean,
            required: true,
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,

    }
})
