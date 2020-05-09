<template>
  <div>
    <nav>
      <div class="bg-gray-900 w-full h-12 px-4 py-2">
        <div class="flex flex-wrap justify-between items-center">
          <div class="text-white font-mono text-2xl">
            <div class="flex justify-between">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#fff" d="M22 4h-20c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm-12.816 11.214c-.474-1.641-1.155-3.036-2.048-4.18l-.037-.107c0-.092.074-.178.182-.178h2.081c.123 0 .218.05.29.145.988 1.356 1.663 2.796 2.02 4.319h-2.488zm2.6-.279c-.296-1.155-.77-2.26-1.429-3.315.151-.82.229-1.657.246-2.506.787 1.267 1.412 2.472 1.881 3.627-.185.743-.413 1.474-.698 2.194zm1.908 2.065c-.151-2.472-1.183-5.212-3.086-8.214h2.427c1.705 2.346 2.918 5.234 3.175 8.214h-2.516zm2.646-.469c-.251-2.081-.915-4.096-2.003-6.044-.095-1.122-.29-2.204-.591-3.259-.029-.116.054-.228.172-.228h2.003c.156 0 .301.106.34.257.43 1.523.642 3.103.642 4.743 0 1.579-.19 3.086-.563 4.531z"/></svg>
              <p class="ml-2">Wallet</p>
            </div>
          </div>
          <button class="text-white font-light  text-base bg-blue px-2 rounded-sm" @click="logout()">Logout</button>
        </div>
      </div>
    </nav>
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/5">
        <div class="bg-gray-200 h-auto md:h-screen  p-6">
          <Profile />
          <Wallet @walletEvent="test"/>
        </div>
      </div>
      <div class="w-full md:w-4/5 p-6">
        <div>
          <div v-if="this.currentWallet.length == 0" class="flex">
            <div class="flex flex-col text-center mx-auto">
              <div class="mx-auto">
                <g-image src="../assets/images/draw1.svg" id="welcomeImg"></g-image>
              </div>
              <div class="mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path fill="#191919" d="M22 4h-20c-1.104 0-2 .896-2 2v12c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2v-12c0-1.104-.896-2-2-2zm-12.816 11.214c-.474-1.641-1.155-3.036-2.048-4.18l-.037-.107c0-.092.074-.178.182-.178h2.081c.123 0 .218.05.29.145.988 1.356 1.663 2.796 2.02 4.319h-2.488zm2.6-.279c-.296-1.155-.77-2.26-1.429-3.315.151-.82.229-1.657.246-2.506.787 1.267 1.412 2.472 1.881 3.627-.185.743-.413 1.474-.698 2.194zm1.908 2.065c-.151-2.472-1.183-5.212-3.086-8.214h2.427c1.705 2.346 2.918 5.234 3.175 8.214h-2.516zm2.646-.469c-.251-2.081-.915-4.096-2.003-6.044-.095-1.122-.29-2.204-.591-3.259-.029-.116.054-.228.172-.228h2.003c.156 0 .301.106.34.257.43 1.523.642 3.103.642 4.743 0 1.579-.19 3.086-.563 4.531z"/></svg>
              </div>
              <p class="text-4xl font-mono">Welcome to Wallet</p>
              <p class="font-mono bg-blue-light px-2 py-2">A place to manage your money and keep track of your account expenses.</p>
            </div>
          </div>
          <div v-else>
            <MainView :wallet="currentWallet"  />
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


import {userStateMixin} from '../Mixins/UserStateMixin'
import Profile from '../components/Sidebar/Profile'
import Wallet from '../components/Sidebar/Wallet'
import MainView from '../components/MainView'

export default {
  metaInfo: {
    title: 'Dashboard',
    meta: [
      {requiresAuth: true}
    ]
  },
  mixins: [userStateMixin],
  components: {
    Profile, Wallet, MainView
  },
  data(){
    return {
      currentWallet: []
    }
  },
  created(){
    // this.getWallets()
  },
  methods:{
    logout() {
      client.query(q.Logout(true)).then(res => {
        client
          .query(
            q.Update(q.Ref(q.Collection("users"), this.$store.state.id), {
              data: {
                token: null
              }
            })
          )
          .then(res => {
            localStorage.removeItem("token");
            this.$router.push({ path: "/login" });
          });
      });
    },
    test(w){
      console.log(w.data.name)
      this.currentWallet = w
    }
  },
  computed:{
    
  }
}
</script>
<style scoped>
#welcomeImg{
  height: 360px;
  width: 360px;
}
</style>
