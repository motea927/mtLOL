<template>
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
            街口帳號: 901917853 (抹綠)
          </v-card-text>
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
        <v-col cols="5" class="mt-n5">
          <v-img src="static/jko.jpg" width="200" class="mx-auto my-5"></v-img>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  methods: {
    goTolink (event) {
      console.log(event)
    }
  }
}
</script>
