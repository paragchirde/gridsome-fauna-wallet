import Vue from 'vue'
import Vuex from 'vuex'
import Vuesax from 'vuesax'
import VeeValidate from 'vee-validate'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';
require('~/main.css')
Vue.use(Vuesax)
Vue.use(VeeValidate)


// import { userStateMixin } from './Mixins/UserStateMixin.js'
export default function(Vue, { router, head, isClient, appOptions }) {


    const authroutes = ['/'];
    router.beforeEach((to, from, next) => {
        var token = process.isClient ? localStorage.getItem("token") : false
        if (authroutes.includes(to.path)) {
            var token = process.isClient ? localStorage.getItem("token") : false
            if (token == null || token == false) {
                next({
                    path: '/login',
                })
            } else {
                next()
            }
        } else {
            next()
        }
        // if (authroutes.includes(to.path)) {
        //     if (token == null || token == false) {
        //         next({
        //             path: '/login',
        //         })
        //     } else {
        //         next()
        //     }
        // } else {
        //     if (token != null) {
        //         if (to.path == '/login' || to.path == '/register') {
        //             next({
        //                 path: '/'
        //             })
        //         }
        //     } else {
        //         next()
        //     }
        //     next()
        // }
    })

    //Store
    Vue.use(Vuex)
    appOptions.store = new Vuex.Store({
        state: {
            user: [],
            id: '',
            wallets: [],
            transactions: []
        },
        mutations: {
            setUser(state, data) {
                state.user = data
            },
            setUserId(state, user_id) {
                state.id = user_id
            },
            ADD_WALLET(state, data) {
                state.wallets.unshift(data)
            },
            ADD_TRANSACTION(state, data) {
                state.transactions.unshift(data)
            },
            UPDATE_WALLET(state, data) {
                state.wallets.find(w => {
                    if (w.ref.id == data.id) {
                        w.data.total = data.amount
                        console.log('ok')
                    }
                })
            }
        }
    })

    // new Vue({
    //     mixins: [userStateMixin],
    // })

}