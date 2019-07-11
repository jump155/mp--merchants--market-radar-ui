<template>
  <v-container flex style="padding: 1px">
    <v-card flat>
      <v-toolbar
        card
        color="gray lighten-4"

      >
        <v-toolbar-title>Тестирование матчинга товаров</v-toolbar-title>
      </v-toolbar>
        <v-layout style="padding-top: 0px">
          <v-flex xs3 >
              <v-card-text style="padding-top: 1px; padding-bottom: 3px; overflow-y: scroll;overflow-x: scroll; max-height: 80vh" >
                <h3 class="grey--text">Искомый товар</h3>
                <v-layout row wrap>
                  <v-flex xs12 v-if="matchingId">
                    <v-layout row wrap v-if="matching_id_info">
                      <v-flex xs12>
                        <v-layout row wrap>
                          <v-flex xs6>
                            <v-img
                            :src="host.concat('image_path/logo?competitor=', matching_id_info.company_id)"
                            aspect-ratio="1"
                            height="50"
                            width="120"
                            ></v-img>
                          </v-flex>
                          <v-flex xs6>
                            <span class="grey--text">{{ matching_id_info.category_name }}</span>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12>
                      </v-flex>
                      <v-flex xs12>
                        <v-img
                          :src="host.concat('image_path/image?matching_id=', matching_id_info.matching_id, '&n=', main_photo_n)"
                          aspect-ratio="1"
                        >
                        </v-img>
                      </v-flex>
                      <v-flex v-for="n in matching_id_info.photo_paths.length"
                        :key="n" xs2>
<!--                        {{n}}-->
                        <v-img
                          :src="host.concat('image_path/image?matching_id=', matching_id_info.matching_id, '&n=', n-1)"
                          aspect-ratio="1"
                          @mouseover="main_photo_n = n-1"
                        >
                        </v-img>
                      </v-flex>
                      <v-flex xs12>
                        <span class="grey--text">{{ matching_id_info.company_product_id }}</span>
                      </v-flex>
                      <v-flex xs12>
                        <h3>{{ matching_id_info.title }}</h3>
                      </v-flex>
                      <v-flex xs12>
                        <span class="grey--text">Цена: </span> <span style="font-size: large">{{ matching_id_info.price }}</span> руб.
                      </v-flex>
                      <v-flex xs12>
                        <span class="grey--text">Марка: </span> <span style="font-size: large">{{ matching_id_info.brand }}</span>
                      </v-flex>
                      <v-flex xs12><br></v-flex>
                      <v-flex xs12>
                        <v-expansion-panel>
                          <v-expansion-panel-content>
                            <template v-slot:header>
                              <div>Атрибуты</div>
                            </template>
                            <table border="1" style="border-collapse: collapse; border-color: darkgrey; font-size: smaller">
                              <tr v-for="(value, key) in matching_id_info.attributes" :key="key">
                                <td class="grey--text">{{ key }}</td>
                                <td>{{ value }}</td>
                              </tr>
                            </table>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <div v-else></div>
                  <v-flex xs12>
                    <v-text-field
                      color="green green--text"
                      label="matching_id"
                      placeholder="Введите matching_id"
                      v-model="matchingId"
                      outline
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      color="green green--text"
                      :items="companies"
                      v-model="companyId"
                      label="конкурент"
                      outline
                    ></v-select>
                  </v-flex>
                  <v-flex xs10>
                    <v-slider
                      color="green green--text"
                      v-model="topN"
                      label="топ результатов"
                    ></v-slider>
                  </v-flex>
                  <v-flex xs2>{{ topN }}</v-flex>
                  <v-flex xs12>
                    <v-btn
                      color="green green--text"
                      outline
                      flat
                      @click="onProductCompanyMatchings(matchingId, companyId, topN)"
                    >
                      найти
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
          </v-flex>
<!--------------------------------------------------РЕЗУЛЬТАТ ПОИСКА--------------------------------------------------->
          <v-divider vertical></v-divider>
          <v-flex xs9>
            <v-layout row wrap>
              <v-flex xs3 v-if="competitor_company_id">
                <v-img
                  :src="host.concat('image_path/logo?competitor=', competitor_company_id)"
                  aspect-ratio="1"
                  height="50"
                  width="120"
                ></v-img>
              </v-flex>
<!--              <v-flex xs4>-->
<!--                <v-pagination-->
<!--                  v-model="page"-->
<!--                  :length="pages"-->
<!--                  total-visible=4-->
<!--                ></v-pagination>-->
<!--              </v-flex>-->
<!--              <v-flex xs4></v-flex>-->
            </v-layout>
            <v-layout row wrap v-if="matching_id_info" style="overflow-y: scroll;overflow-x: scroll; max-height: 80vh" >
              <v-flex xs3 v-for="sim in similars" :key="sim.matching_id">
                <product-card
                  :matchingId="matching_id_info.matching_id"
                  :product="sim"
                >
                </product-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
    </v-card>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex'
import ProductCard from './ProductCard'

export default {
  name: 'ProductsMatchingTest',
  data: () => ({
    // matchingId: null,
    matchingId: '18769934_lm',
    companyId: 'petrovich',
    main_photo_n: 0,
    topN: 12,
    page: 1,
    pages: 5,
    companies: ['lm', 'lmmarket', 'petrovich', 'obi'],
    host: process.env.VUE_APP_MATCHING_IMAGE_URL
  }),
  components: {
    ProductCard
  },
  methods: {
    ...mapActions({
      getProductCompanyMatchings: 'productCompanyMatchings/getProductCompanyMatchings'
    }),
    onProductCompanyMatchings (matchingId, companyId, topN) {
      this.main_photo_n = 0
      this.getProductCompanyMatchings({ matchingId, companyId, topN })
    },
    onOverMainImage (n) {
      this.main_photo_n = n
    }
  },
  computed: {
    similars () {
      return this.$store.state.productCompanyMatchings.similars
    },
    matching_id_info () {
      return this.$store.state.productCompanyMatchings.matchingIdInfo
    },
    competitor_company_id () {
      return this.$store.state.productCompanyMatchings.companyId
    }
  },
  watch: {
    page (val) {
      if (val >= 3) {
        this.pages = val + 1
      } else {
        this.pages = 4
      }
    }
  }
}
</script>

<style scoped>

</style>
