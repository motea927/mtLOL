<template>
  <vue-custom-scrollbar class="scroll-area">
  <v-container>
    <v-card class="mx-3 mt-5">
      <v-card-title>
        關於作者
      </v-card-title>
      <v-card-subtitle class="mt-1">
        以下是關於作者及程式資訊，若您想請作者喝杯咖啡，歡迎使用街口支付掃碼贊助。
      </v-card-subtitle>
      <v-row>
        <v-col>
          <v-card-text>
            巴哈姆特: k888333617 (草泥馬)
          </v-card-text>
          <v-card-text>
            Github: motea927
          </v-card-text>
      <v-card-text>
        Source Code: https://github.com/motea927/mtLOL
      </v-card-text>
        </v-col>
      </v-row>
    </v-card>
      
    <v-card class="mx-3 mt-5">
      <v-card-title>
        街口支付
      </v-card-title>
      <v-img src="static/jko.jpg" width="300" class="mx-auto"></v-img>
      <v-card-text>
        街口帳號: 901917853 (抹綠)
      </v-card-text>
    </v-card>
  </v-container>
  </vue-custom-scrollbar>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
export default {
  components: {
    vueCustomScrollbar
  },
  methods: {
    goTolink (event) {
      console.log(event)
    }
  }
}
</script>
