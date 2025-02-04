
let eventBus = new Vue();

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
                <button @click="showColors = false; showDetails = true">Show details</button>
            </div>
            <div v-if="showColors" class="color-box-container">
                <div class="color-box"
                     v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     :style="{ backgroundColor:variant.variantColor }"
                     @mouseover="updateProduct(index)">
                </div>
            </div>
            <div v-if="showDetails">
                <product-details :details="details"></product-details>
            </div>
            <div class="divSizes">
                <p class="sizeConf" v-for="size in sizes">{{ size }}</p>
            </div>
            <div class="contWithButton">
                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
                <button @click="decToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Decrement to cart</button>
            </div>
        </div>
        <product-tabs :reviews="reviews"></product-tabs>
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
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        decToCart() {
            this.$emit('dec-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
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
});

Vue.component('product-details', {
    template: `<ul><li v-for="detail in details">{{ detail }}</li></ul>`,
    props: {
        details: {
            type: Array,
            required: true,
        }
    }

})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">
                    {{ error }}
                </li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
           <label for="rating">Rating:</label>
           <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
           </select>
        </p>
        <p>
            <label>Would you recommend this product?</label><br>
            <label>
                <input type="radio" v-model="like" value="Yes" checked> Yes
            </label>
            <label>
                <input type="radio" v-model="like" value="No"> No
            </label>
        </p>
        <p>
            <input type="submit" value="Submit"> 
        </p>
    </form>
        `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            like: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    like: this.like,
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null
                this.review = null
                this.rating = null
                this.like = null
            }
            else {
                if(!this.name) this.errors.push("Name is required");
                if(!this.review) this.errors.push("Review is required");
                if(!this.rating) this.errors.push("Rating is required");
            }
        },
    }

})

Vue.component('product-tabs', {
    template: `
    <div>
        <ul>
            <span class="tab" 
                  v-for="(tab, index) in tabs"
                  :key="index"
                  :class="{ activeTab: selectedTab === tab }"
                  @click="selectedTab = tab">{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="(review, index) in reviews" :key="index">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    <p>Recommend: {{ review.like }}</p>
                </li>
            </ul> 
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    },
    props: {
        reviews: {
            type: Array,
            required: true,
        }
    }
});

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
                this.cart.pop();
            }
        }
    }
})
