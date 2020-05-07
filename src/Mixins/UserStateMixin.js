const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.GRIDSOME_FAUNA_SECRET })
const q = faunadb.query
export const userStateMixin = {
    created() {
        this.check()
            .then(() => {
                this.getWallets()
            })
            .then(() => {
                this.getTransactions()
            })
    },
    methods: {
        check() {
            return new Promise((resolve, reject) => {
                client.query(q.Get(q.Match(q.Index('user_by_token'), localStorage.getItem('token'))))
                    .then(res => {
                        this.$store.commit("setUser", res.data);
                        this.$store.commit("setUserId", res.ref.value.id);
                        resolve(res)
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        },
        getWallets() {
            client.query(q.Paginate(q.Match(q.Index('wallet_by_user_id'), this.$store.state.id)))
                .then(res => {
                    var x = res.data
                    const data = x.map(ref => {
                        return q.Get(ref)
                    })
                    client.query(data).then(res => {
                        this.$store.state.wallets = res
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getTransactions() {
            client.query(q.Paginate(q.Match(q.Index('tx_by_user_id'), this.$store.state.id)))
                .then(res => {
                    var x = res.data
                    const data = x.map(ref => {
                        return q.Get(ref)
                    })
                    client.query(data).then(res => {
                        this.$store.state.transactions = res
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}