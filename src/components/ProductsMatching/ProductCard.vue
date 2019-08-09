<template>
  <v-card style="padding: 5px; margin: 7px">
    <v-img
      :src="host.concat('image_path/image?matching_id=', product.matching_id, '&n=', main_photo_n)"
      aspect-ratio="1"
    >
    </v-img>
    <v-layout row wrap>
      <v-flex v-for="n in product.images_info.length" :key="n" xs2>
        <v-img
          :src="host.concat('image_path/image?matching_id=', product.matching_id, '&n=', n-1)"
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
        <span style="font-size: large">{{ product.brand }}</span>
      </v-flex>
      <v-flex xs12>
        <v-layout row wrap class="grey--text" style="font-size: small">
          <v-flex xs3>
            qty: {{ product.qty }}
          </v-flex>
          <v-flex xs3>
            pos: {{ product.pos }}
          </v-flex>
          <v-flex xs6>
            dist: {{ Math.round(product.dist * 1000) / 1000 }}
          </v-flex>
        </v-layout>
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
          <v-btn flat color="green" v-on="on">
            Match
          </v-btn>
        </template>
        <span>Матчинг с данным товаром</span>
      </v-tooltip>
      <v-tooltip bottom>
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
  props: ['matchingId', 'product']
}
</script>

<style scoped>

</style>
