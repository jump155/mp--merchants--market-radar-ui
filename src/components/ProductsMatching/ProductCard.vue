<template>
<!--  <v-card :style="padding: 5px; margin: margin7px; background-color: #B4EFB4">-->
  <v-card :style="{background: bg, padding: '5px', margin: '7px'}">
    <v-img
      :src="getImageUrl(product.images_info[main_photo_n]['image_path'])"
      aspect-ratio="1"
    >
      <v-card-title v-if="isMatched"
                    class="align-start fill-height"
                    style="color: darkgreen; font-size: larger"
      >MATCHING</v-card-title>
    </v-img>
    <v-btn small flat>
      класс
    </v-btn>
    {{ product.images_info[main_photo_n]['image_path'] }}
    <v-layout row wrap>
      <v-flex v-for="n in product.images_info.slice(0, 12).length" :key="n" xs2>
        <v-img
          :src="getImageUrl(product.images_info[n-1]['image_path'])"
          aspect-ratio="1"
          @mouseenter="main_photo_n = n-1"
        >
        </v-img>
      </v-flex>
      <v-flex xs12>
        <span class="grey--text" style="font-size: smaller">арт: {{ product.company_product_id }}</span>
      </v-flex>
      <v-flex xs12>
        <span>{{ product.title }}</span>
      </v-flex>
      <v-flex xs12>
        <span class="deep-orange--text" style="font-size: larger">{{ product.price }}</span>
        <span class="grey--text" style="font-size: smaller"> руб.</span>
      </v-flex>
      <v-flex xs12 v-if="product.matching_id !== matchingId">
        <span style="font-size: smaller; color: darkgray">совпадение:</span><br>
        <span style="font-size: smaller">
          &nbsp;&nbsp;&nbsp; изображения:
          <span style="font-size: larger; color: green" v-if="product.score_image > 0.95">
            {{ Math.round(product.score_image * 10000) / 100 }}%
          </span>
          <span style="font-size: larger; color: darkolivegreen" v-else-if="product.score_image > 0.5">
            {{ Math.round(product.score_image * 10000) / 100 }}%
          </span>
          <span style="font-size: larger; color: darkgoldenrod" v-else>
            {{ Math.round(product.score_image * 10000) / 100 }}%
          </span>
        </span>
        <br>
        <span style="font-size: smaller">
          &nbsp;&nbsp;&nbsp; названия:
          <span style="font-size: larger; color: green" v-if="product.score_image > 0.95">
            {{ Math.round(product.score_title * 10000) / 100 }}%
          </span>
          <span style="font-size: larger; color: darkolivegreen" v-else-if="product.score_image > 0.5">
            {{ Math.round(product.score_title * 10000) / 100 }}%
          </span>
          <span style="font-size: larger; color: darkgoldenrod" v-else>
            {{ Math.round(product.score_title * 10000) / 100 }}%
          </span>
        </span>
      </v-flex>
      <v-flex xs12>
        <span class="grey--text" style="font-size: smaller">марка: </span>
        <div v-if="product.brand && matchingIdInfo.brand">
          <span
            v-if="product.brand.toLowerCase().trim() === matchingIdInfo.brand.toLowerCase().trim()"
            style="color: darkgreen; font-size: x-large"
          >
            {{ product.brand }}&nbsp;&nbsp;
            <v-icon color="green" large>done_all</v-icon>
          </span>
          <span v-else style="font-size: large">
            {{ product.brand }}
          </span>
        </div>
      </v-flex>
      <v-flex xs12>
        <v-expansion-panel popout>
          <v-expansion-panel-content :style="{background: bg}">
            <template v-slot:header>
              <div>Атрибуты</div>
            </template>
            <table border="1" style="border-collapse: collapse; border-color: darkgrey; font-size: smaller">
              <tr v-for="att in product.attributes" :key="att.attribute">
                <td class="grey--text">{{ att.attribute }}</td>
                <div v-if="att.attribute === 'Описание'"></div>
                <td v-else>{{ att.value }}</td>
              </tr>
            </table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-card-actions v-if="matchingId !== product.matching_id">
      <v-tooltip v-if="!isMatched" bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat color="green" v-on="on" @click="onMatchProduct(matchingId, companyId, product.matching_id)" large>
            совпадение
          </v-btn>
        </template>
        <span>Матчинг с данным товаром</span>
      </v-tooltip>
      <v-tooltip v-else bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat color="orange" v-on="on" @click="onDeleteMatching(matchingId, companyId, product.matching_id)" large>
            Отменить
          </v-btn>
        </template>
        <span>Отменить матчинг с данным товаром</span>
      </v-tooltip>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <v-tooltip v-if="product.url" bottom>
        <template v-slot:activator="{ on }">
          <a :href="product.url" target="_blank" class="grey--text" style="text-decoration: none" v-on="on">
<!--            НА САЙТ-->
            <v-icon>language</v-icon>
          </a>
        </template>
        <span>Перейти в карточку товара на сайте</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  name: 'ProductCard',
  data: () => ({
    main_photo_n: 0,
    golden_category_name: '',
    bg: 'white',
    host: process.env.VUE_APP_MATCHING_IMAGE_URL,
    isMatched: false,
    isOriginallyMatched: false
  }),
  methods: {
    ...mapMutations({
      addMatchingToPost: 'productCompanyMatchings/addMatchingToPost',
      addMatchingToDelete: 'productCompanyMatchings/addMatchingToDelete',
      removeMatchingFromPost: 'productCompanyMatchings/removeMatchingFromPost'
    }),
    getImageUrl (key) {
      return this.s3_images_bucket.getSignedUrl('getObject', {
        Key: key,
        Expires: 60 * 5
      })
    },
    onMatchProduct (matchingId, companyId, companyMatchingId) {
      if (!this.isOriginallyMatched) {
        this.addMatchingToPost(companyMatchingId)
      }
      this.isMatched = true
      this.bg = '#d9ffd6'
    },
    onDeleteMatching (matchingId, companyId, companyMatchingId) {
      if (this.isOriginallyMatched) {
        this.addMatchingToDelete(companyMatchingId)
      }
      this.removeMatchingFromPost(companyMatchingId)
      this.isMatched = false
      this.bg = 'white'
    }
  },
  computed: {
    s3_images_bucket () {
      return this.$store.state.productCompanyMatchings.s3_images_bucket
    },
    companyId () {
      return this.$store.state.productCompanyMatchings.companyId
    },
    matchingIdInfo () {
      return this.$store.state.productCompanyMatchings.matchingIdInfo
    }
  },
  props: ['matchingId', 'product', 'matchingIdBrand']
}
</script>

<style scoped>

</style>
