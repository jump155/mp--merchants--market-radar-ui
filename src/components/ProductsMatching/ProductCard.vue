<template>
  <v-card style="padding: 5px; margin: 7px">
    <v-img
      :src="getImageUrl(product.images_info[main_photo_n]['image_path'])"
      aspect-ratio="1"
    >
    </v-img>
    <v-layout row wrap>
      <v-flex v-for="n in product.images_info.length" :key="n" xs2>
        <v-img
          :src="getImageUrl(product.images_info[n-1]['image_path'])"
          aspect-ratio="1"
          @mouseenter="main_photo_n = n-1"
          @mouseleave="main_photo_n = 0"
        >
        </v-img>
      </v-flex>
      <v-flex xs12>
        <span class="grey--text" style="font-size: smaller">{{ product.company_product_id }}</span>
      </v-flex>
      <v-flex xs12>
        <span>{{ product.title }}</span>
      </v-flex>
      <v-flex xs12>
        <span class="deep-orange--text" style="font-size: larger">{{ product.price }}</span>
        <span class="grey--text" style="font-size: smaller"> руб.</span>
      </v-flex>
      <v-flex xs12>
        <span class="grey--text" style="font-size: smaller">марка: </span>
        <span
          v-if="matchingIdBrand && (product.brand.toLowerCase() === matchingIdBrand.toLowerCase())"
          style="color: darkgreen; font-size: x-large"
        >
          {{ product.brand }}&nbsp;&nbsp;
          <v-icon color="green" large>done_all</v-icon>
        </span>
        <span v-else style="font-size: large">{{ product.brand }}</span>
      </v-flex>
      <v-flex xs12>
        <v-expansion-panel popout>
          <v-expansion-panel-content>
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
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat color="green" v-on="on" large>
            Matching
          </v-btn>
        </template>
        <span>Матчинг с данным товаром</span>
      </v-tooltip>
      <v-tooltip v-if="product.url" bottom>
        <template v-slot:activator="{ on }">
          <a :href="product.url" target="_blank" class="grey--text" style="text-decoration: none" v-on="on">
            НА САЙТ
            <v-icon>language</v-icon>
          </a>
        </template>
        <span>Перейти в карточку товара на сайте</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: 'ProductCard',
  data: () => ({
    main_photo_n: 0,
    host: process.env.VUE_APP_MATCHING_IMAGE_URL
  }),
  methods: {
    getImageUrl (key) {
      return this.s3_images_bucket.getSignedUrl('getObject', {
        Key: key,
        Expires: 60 * 5
      })
    }
  },
  computed: {
    s3_images_bucket () {
      return this.$store.state.productCompanyMatchings.s3_images_bucket
    }
  },
  props: ['matchingId', 'product', 'matchingIdBrand']
}
</script>

<style scoped>

</style>
