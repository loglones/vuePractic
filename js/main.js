Vue.component('product', {
    template: `
    <div class="product">
        <div class="product-image">
            <img :alt="altText" :src="image"/>
        </div>
        
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ sale }}</p>
            <b><i><p v-if="inStock">In stock / <del>Out of stock</del></p></i></b>
            <b><i><p v-if="!inStock"><del>In stock</del> / Out of stock</p></i></b>
            <p v-html="shipping"></p>
            <div class="toogle-buttons">
                <button @click="showColors = true; showDetails = false">Show colors</button>
                <button @click="showColors = false; showDetails = true">Show details</button>/
            </div>
            <div v-if="showColors" class="color-box-container">
            <div class="color-box"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 :style="{ backgroundColor:variant.variantColor }"
                 @mouseover="updateProduct(index)"></div>
            </div>
            <div v-if="showDetails">
                <product-details :details="details"></product-details>/
            </div>
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
                    variantQuantity: 4,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            showColors: true,
            showDetails: false,
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        decToCart(){
            this.$emit('dec-to-cart');
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
                return `Shipping : <del>2.99</del> <b>FREE</b>`;
            }
            else {
                return `Shipping : ${2.99}`;
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

Vue.component('product-details', {
    template: `<ul><li v-for="detail in details">{{ detail }}</li></ul>`,
    props: {
        details: {
            type: Array,
            required: true,
        }
    }

})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods:{
        updateCart(id) {
            this.cart.push(id);
        },
        decrementCart() {
            if(this.cart) {
                this.cart.pop()
            }
        }
    }
})
