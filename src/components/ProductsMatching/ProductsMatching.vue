<template>
  <v-container flex style="padding: 1px">
    <v-toolbar-title>Валидация матчинга</v-toolbar-title>
    <v-layout style="padding-top: 0px">
      <v-flex xs3 >
        <v-layout row wrap>
          <v-flex xs12 >
            <h3 class="grey--text" style="padding-left: 12px">Искомый товар</h3>
          </v-flex>
          <v-flex xs12 v-if="matching_id_info">
            <v-img
              :src="host.concat('image_path/logo?competitor=', matching_id_info.company_id)"
              aspect-ratio="1"
              height="50"
              width="120"
              style="padding-left: 12px; margin-left: 12px"
            ></v-img>
          </v-flex>
        </v-layout>
          <v-layout row wrap>
            <v-flex xs12 v-if="matchingId && matching_id_info">
              <product-card
                :matchingId="matching_id_info.matching_id"
                :product="matching_id_info"
              >
              </product-card>
            </v-flex>
            <div v-else></div>
          </v-layout>
      </v-flex>
<!-------------------------------------------------РЕЗУЛЬТАТ ПОИСКА--------------------------------------------------->
      <v-divider vertical></v-divider>
      <v-flex xs9>
        <v-layout row wrap>
          <v-flex xs12 >
            <h3 class="grey--text" style="padding-left: 12px">Компания, в которой происходит поиск</h3>
          </v-flex>
          <v-flex xs3 v-if="competitor_company_id">
            <v-img
              :src="host.concat('image_path/logo?competitor=', competitor_company_id)"
              aspect-ratio="1"
              height="50"
              width="120"
            ></v-img>
          </v-flex>
          <v-flex xs3 v-if="competitor_company_id">
            Отложить на: 14 дней, 30 дней, навсегда
          </v-flex>
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
<!--    </v-card>-->
  </v-container>
</template>

<script>

import { mapActions, mapMutations } from 'vuex'
import ProductCard from './ProductCard'

export default {
  name: 'ProductsMatching',
  data: () => ({
    main_photo_n: 0,
    topN: 9,
    page: 1,
    pages: 5,
    companies: ['lm', 'lmmarket', 'petrovich', 'obi'],
    host: process.env.VUE_APP_MATCHING_IMAGE_URL,
    bottom: false
  }),
  components: {
    ProductCard
  },
  methods: {
    ...mapActions({
      getCandidate: 'productCompanyMatchings/getCandidate'
    }),
    ...mapMutations({
      getProductCompanyMatchings: 'productCompanyMatchings/getProductCompanyMatchings',
      holdOnCandidate: 'productCompanyMatchings/holdOnCandidate'
    }),
    onOverMainImage (n) {
      this.main_photo_n = n
    },
    // for infinite scroll
    bottomVisible () {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
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
    },
    matchingId () {
      return this.$store.state.productCompanyMatchings.matchingId
    },
    companyId () {
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
  },
  created () {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    console.log('Component has been created!')
    this.getCandidate()
  }
}
</script>

<style scoped>

</style>
