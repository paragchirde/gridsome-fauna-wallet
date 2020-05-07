<template>
    <div>
        <div class="flex justify-between">
            <div class="flex items-center">
                <p class="text-3xl">
                    {{ wallet.data.name }} |
                    <span class="bg-blue rounded-lg text-base px-2 py-2 text-white">
                        &#8377; {{ parseInt(wallet.data.total).toLocaleString('en') }}
                    </span>
                </p>
            </div>
            <div>
                <button class="bg-blue p-2 text-white font-base rounded shadow-lg"  @click="popupAddTransaction=true">Add New Transction</button>
                <!-- <button class="bg-red-500 p-2 text-white font-base rounded shadow-lg ml-2" @click="removeWallet()">Remove</button> -->
                <vs-popup class="holamundo"  title="Add A New Transaction" :active.sync="popupAddTransaction">
                    <div>
                        <div class="flex flex-wrap">
                            <div class="mt-2 w-full">
                                <label for="amount" class="font-light text-base mb-2 text-gray-700">Enter the Amount</label>
                                <input v-validate="'required'" data-vv-validate-on="blur" :class="errors.first('amount') ? 'border border-red-500' : '' "
                                name="amount"
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="amount" type="number" placeholder="Amount" v-model="transactionAmount">
                                <span class="text-red-500 font-thin text-sm mt-4">{{ errors.first('amount') }}</span>
                            </div>
                            <div class="w-full">
                                <label for="note" class="font-light text-base mb-2 text-gray-700">Enter the Note/Description</label>
                                <input v-validate="'required'" data-vv-validate-on="blur" :class="errors.first('note') ? 'border border-red-500' : '' "
                                name="note"
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                                id="inline-full-name" type="text" placeholder="Wallet Name" v-model="transactionNote">
                                <span class="text-red-500 font-thin text-sm mt-4">{{ errors.first('note') }}</span>
                            </div>
                            <div class="w-full">
                                <label for="type" class="font-light text-base mb-2 text-gray-700">Transaction Type</label>
                                <vs-select
                                class=" w-full bg-gray-200 text-gray-800"
                                name="type"
                                v-model="transactionType"
                                icon="arrow_downward"
                                >
                                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in types" />
                                </vs-select>
                            </div>  
                            <div class="w-full">
                                <label for="category" class="font-light text-base mb-2 text-gray-700">Transaction Category</label>
                                <vs-select
                                class=" w-full bg-gray-200 text-gray-800"
                                name="category"
                                v-model="transactionCategory"
                                icon="arrow_downward"
                                >
                                <vs-select-item :key="index" :value="item.value" :text="item.text" v-for="(item,index) in category" />
                                </vs-select>
                            </div>  
                        </div>
                        <div class="flex justify-end mt-4">
                            <vs-button :disabled="!validateForm"
                            class="bg-blue p-2 text-white font-base rounded shadow-lg" @click.prevent="addTransaction()">Submit
                            </vs-button>
                        </div>  
                    </div>
                </vs-popup>
            </div>
        </div>
        <div class="mt-2">
            <p class="text-xs text-gray-600">Created At: {{ moment(wallet.data.created_at).format('MMMM Do YYYY, h:mm:ss a') }} </p>
            <p class="text-base text-gray-900">Bank: {{ wallet.data.bank }} </p>
            <p class="text-base text-gray-900">Initial Amount: {{ wallet.data.amount }} </p>
            <!-- <p>Your Tx: {{ walletTrasnactions }}</p> -->
            <div class="flex flex-wrap">
                <div class="w-1/2 md:w-1/4 p-2" v-for="(tx, i) in walletTrasnactions.reverse()" :key="i">
                    <div class="bg-white shadow-lg rounded-md px-2 py-2">
                        <div class="flex justify-between">
                        <p class="font-mono text-gray-700">Amount: {{ tx.data.amount }}</p>
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1f74ff" d="M22 4h-20c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm-19 5.78c0-.431.349-.78.78-.78h.428v1.125h-1.208v-.345zm0 .764h1.208v.968h-1.208v-.968zm0 1.388h1.208v1.068h-.428c-.431 0-.78-.349-.78-.78v-.288zm3 5.068h-3v-1h3v1zm1-4.78c0 .431-.349.78-.78.78h-.429v-1.068h1.209v.288zm0-.708h-1.209v-.968h1.209v.968zm0-1.387h-1.629v2.875h-.743v-4h1.592c.431 0 .78.349.78.78v.345zm4 6.875h-3v-1h3v1zm1-6.5c0-1.381 1.119-2.5 2.5-2.5.484 0 .937.138 1.32.377-.531.552-.857 1.3-.857 2.123 0 .824.327 1.571.857 2.123-.383.239-.836.377-1.32.377-1.381 0-2.5-1.119-2.5-2.5zm4 6.5h-3v-1h3v1zm5 0h-3v-1h3v1zm-2.5-4c-1.38 0-2.5-1.119-2.5-2.5s1.12-2.5 2.5-2.5c1.381 0 2.5 1.119 2.5 2.5s-1.119 2.5-2.5 2.5z"/></svg>
                        </p>
                        </div>
                        <p v-if="tx.data.type === 'expenditure'" class="bg-red-500 text-white inline-block text-sm px-2" style="text-transform: capitalize"> {{ tx.data.type }}</p>
                        <p v-if="tx.data.type === 'transfer'" class="bg-orange-500 text-white inline-block text-sm px-2" style="text-transform: capitalize"> {{ tx.data.type }}</p>
                        <p v-if="tx.data.type === 'credit'" class="bg-green text-white inline-block text-sm px-2" style="text-transform: capitalize"> {{ tx.data.type }}</p>
                        <p class="text-sm text-gray-700">Desc: {{ tx.data.note }}</p>
                        <p class="text-xs text-gray-600 px-1 mt-1 bg-gray-300 inline-block">Time: {{ moment(tx.data.created_at).format('MMMM Do YYYY, h:mm:ss a') }}</p>
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

var moment = require('moment');
export default {
    props:['wallet'],
    data(){
        return{
            moment: moment,
            popupAddTransaction: false,
            transactionAmount: '',
            transactionNote: '',
            transactionType: '',
            transactionCategory: '',
            transactionData: {},
            transactionObj: {},
            types:[
                {text:'Expenditure',value:"expenditure"},
                {text:'Credit',value:"credit"},
                {text:'Transfer',value:"transfer"},
            ],
            category:[
                {text:'Shoping',value:"shoping"},
                {text:'Food',value:"food"},
                {text:'Bills',value:"bills"},
            ],
            tx: [],
            temp: '',
            allTransactions: []
        }
    },
    methods:{
        addTransaction(){
            this.$vs.loading()
            this.transactionData = {
                "amount": this.transactionAmount,
                "note": this.transactionNote,
                "type": this.transactionType,
                "category": this.transactionCategory,
                "created_by": this.$store.state.id,
                "wallet_id": this.wallet.ref.id,
                "created_at": Date.now()
            }
            this.transactionObj = {
                data: this.transactionData
            }
            console.log(this.transactionObj)
            client.query(q.Create(q.Collection('transactions'), this.transactionObj))
            .then(res => {
                console.log(res)
                this.popupAddTransaction = false,
                this.$store.commit('ADD_TRANSACTION', res)
            })
            .then(() => {
                this.updateWallet()
                this.$vs.loading.close()
            })
            .catch(err => {
                console.log(err)
                this.popupAddTransaction = false,
                this.$vs.loading.close()
            })
        },
        updateWallet(){
            if(this.transactionType == 'expenditure' || this.transactionType == 'transfer') {
                console.log(1)
                console.log(this.wallet.data.total)
                console.log(this.transactionAmount)
                this.temp = this.wallet.data.total - this.transactionAmount
                console.log(this.temp)
            } else {
                console.log(2)
                this.temp = parseInt(this.wallet.data.total) + parseInt(this.transactionAmount)
            }
            console.log(this.temp)
            console.log(parseInt(this.temp))
            client.query(
                    q.Update(
                        q.Ref(q.Collection('wallets'), this.wallet.ref.id),
                        {
                            data: {
                                total: parseInt(this.temp),
                            }
                        }
                        )
            )
            .then(res => {
                console.log(res)
                const data = {
                    amount: this.temp,
                    id: this.wallet.ref.id
                }
                this.$store.commit('UPDATE_WALLET', data)
            })
            .catch(err => {
                console.log(err)
            })
        },
        removeWallet(){

        }
    },
    computed: {
        validateForm() {
            return !this.errors.any() && this.transactionAmount != "" && this.transactionNote != "";
        },
        walletTrasnactions(){
             return this.$store.state.transactions.filter(t => {
                 return t.data.wallet_id == this.wallet.ref.id
             })
        },
        totalUpdated(){
             return this.$store.state.wallets.filter(w => {
                 if(w.ref.value.id == this.wallet.ref.id){
                     console.log(w.data.total)
                 }
             })
        },
    },
}
</script>