<template>
    <div>
        <div class="items-center">
            <button class="bg-blue text-white w-full py-2 px-4 rounded-sm flex justify-center"  @click="popupAddWallet=true" >Add Wallet <span class="ml-2 material-icons">add_box</span></button>
        </div>
        <vs-popup class="holamundo"  title="Add A New Wallet" :active.sync="popupAddWallet">
            <div>
                <div class="flex flex-wrap">
                    <div class="w-full">
                        <label for="name" class="font-light text-base mb-2 text-gray-700">Enter the name of wallet</label>
                        <input v-validate="'required'" data-vv-validate-on="blur" :class="errors.first('name') ? 'border border-red-500' : '' "
                        name="name"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                        id="inline-full-name" type="text" placeholder="Wallet Name" v-model="walletName">
                        <span class="text-red-500 font-thin text-sm mt-4">{{ errors.first('name') }}</span>
                    </div>
                    <div class="mt-2 w-full">
                        <label for="amount" class="font-light text-base mb-2 text-gray-700">Enter the Amount</label>
                        <input v-validate="'required'" data-vv-validate-on="blur" :class="errors.first('amount') ? 'border border-red-500' : '' "
                        name="amount"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                        id="amount" type="number" placeholder="Amount" v-model="walletAmount">
                        <span class="text-red-500 font-thin text-sm mt-4">{{ errors.first('amount') }}</span>
                    </div>
                    <div class="mt-2 w-full">
                        <label for="bank" class="font-light text-base mb-2 text-gray-700">Enter bank</label>
                        <input v-validate="'required'" data-vv-validate-on="blur" :class="errors.first('bank') ? 'border border-red-500' : '' "
                        name="bank"
                        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                        id="bank" type="text" placeholder="Bank" v-model="walletBank">
                        <span class="text-red-500 font-thin text-sm mt-4">{{ errors.first('bank') }}</span>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <vs-button :disabled="!validateForm"
                    class="bg-blue p-2 text-white font-base rounded shadow-lg" @click.prevent="createWallet()">Add Wallet
                    </vs-button>
                </div>  
            </div>
        </vs-popup>
        <div class="bg-green-500">
            <p v-if="this.$store.state.wallets == null">No Wallets Yet.</p>
            <div v-else class="mt-2">
                <p class="text-gray-600">Your Wallets</p>
                <div class="mt-2 bg-gray-900 px-2 py-2 text-white shadow-sm rounded-sm" 
                    v-for="(w, i) in this.$store.state.wallets" :key="i">
                    <div class="flex flex-wrap justify-between" @click="walletView(w)">
                        <div class="flex items-center">
                            <span class="material-icons"> account_balance_wallet</span>
                            {{ w.data.name }}
                        </div>
                        <div class="flex items-center">
                            <span class="bg-gray-700 rounded-lg text-xs px-2 py-1 text-white">
                                &#8377; {{ parseInt(w.data.amount).toLocaleString('en') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const faunadb = require('faunadb')
const client = new faunadb.Client({secret: process.env.GRIDSOME_FAUNA_SECRET})
const q = faunadb.query
export default {
    data(){
        return {
            popupAddWallet: false,
            walletName: '',
            walletAmount: '',
            walletBank: '',
            walletData: {},
            walletObj:{},
        }
    },
    created(){
        
    },
    methods:{
        createWallet(){
            this.$vs.loading()
            this.walletData = {
                "name": this.walletName,
                "amount": parseInt(this.walletAmount),
                "bank": this.walletBank,
                "total": parseInt(this.walletAmount),
                "created_by": this.$store.state.id,
                "created_at": Date.now()
            }
            this.walletObj = {
                data: this.walletData
            }
            client.query(q.Create(q.Collection('wallets'), this.walletObj))
            .then(res => {
                console.log(res)
                this.popupAddWallet = false
                this.$store.commit("ADD_WALLET", res)
                this.$vs.loading.close()
            })
            .catch(err => {
                console.log(err)
                this.popupAddWallet = false
                this.$vs.loading.close()
            })
        },
        walletView(w){
            this.$emit('walletEvent', w)
        }
    },
    computed: {
        validateForm() {
            return !this.errors.any() && this.walletName != "" && this.walletAmount != "" && this.walletBank != "";
        },
        alWallets(){
            return this.$store.state.wallets
        }
    },
}
</script>