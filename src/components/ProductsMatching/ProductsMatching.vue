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
              :src="getLogoUrl(matching_id_info.company_id.concat('.jpg'))"
              aspect-ratio="1"
              height="50"
              width="120"
              style="padding-left: 12px; margin-left: 12px"
            ></v-img>
          </v-flex>
        </v-layout>
        <br>
        <v-layout row wrap>
          <v-flex xs12 v-if="matchingId && matching_id_info">
            <product-card
              :matchingId="matching_id_info.matching_id"
              :product="matching_id_info"
            >
            </product-card>
          </v-flex>
          <div v-else></div>
          <v-flex xs12>
            <v-select
              :items="companies"
              label="Товары какой компании искать"
              v-model="c1"
              outlined
            ></v-select>
            <v-select
              :items="companies"
              label="Компания, В которой искать"
              v-model="c2"
              outlined
            ></v-select>
          </v-flex>
        </v-layout>
      </v-flex>
<!-------------------------------------------------РЕЗУЛЬТАТ ПОИСКА--------------------------------------------------->
      <v-divider vertical></v-divider>
      <v-flex xs9 v-if="!competitor_company_id || similars === null"></v-flex>
      <v-flex xs9 v-else>
        <v-layout row wrap>
          <v-flex xs12>
            <h3 class="grey--text" style="padding-left: 12px">Компания, в которой происходит поиск</h3>
          </v-flex>
          <v-flex xs2 v-if="competitor_company_id">
            <v-img
              :src="getLogoUrl(competitor_company_id.concat('.jpg'))"
              aspect-ratio="1"
              height="50"
              width="120"
            ></v-img>
          </v-flex>
          <v-flex xs2></v-flex>
          <v-flex xs3 v-if="competitor_company_id">
            <v-tooltip left v-if="matchingsToPost.length === 0 & matchingsToDelete.length === 0">
              <template v-slot:activator="{ on }">
                <v-btn
                  flat
                  large
                  outline
                  color="indigo"
                  v-on="on"
                  @click="onDefferProduct(matching_id_info.matching_id, competitor_company_id)"
                >
                  Пропустить
                  <v-icon right>skip_next</v-icon>
                </v-btn>
              </template>
              <span>Отложить, пока не появятся другие варианты</span>
            </v-tooltip>
            <v-tooltip left v-else>
              <template v-slot:activator="{ on }">
                <v-btn
                  large
                  dark
                  color="indigo"
                  v-on="on"
                  @click="onaAcceptChanges(matching_id_info.matching_id, competitor_company_id)"
                >
                  Подтвердить
                  <v-icon right>skip_next</v-icon>
                </v-btn>
              </template>
              <span>Подтвердить изменения и перейти к следующему товару</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <br>
        <v-layout
          row
          wrap
          v-if="matching_id_info"
          style="overflow-y: scroll;overflow-x: scroll; max-height: 80vh"
        >
          <v-flex xs3 v-for="sim in similars.slice(0, 36)" :key="sim.matching_id">
            <product-card
              :matchingId="matching_id_info.matching_id"
              :product="sim"
              :matchingIdBrand="matching_id_info.brand"
            >
            </product-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { mapActions, mapMutations } from 'vuex'
import ProductCard from './ProductCard'

export default {
  name: 'ProductsMatching',
  data: () => ({
    main_photo_n: 0,
    c1: 'petrovich',
    c2: 'obi',
    topN: 9,
    page: 1,
    pages: 5,
    host: process.env.VUE_APP_MATCHING_IMAGE_URL,
    bottom: false
  }),
  components: {
    ProductCard
  },
  methods: {
    ...mapActions({
      getCandidates: 'productCompanyMatchings/getCandidates',
      nextCandidate: 'productCompanyMatchings/nextCandidate',
      hideCandidate: 'productCompanyMatchings/hideCandidate',
      acceptChanges: 'productCompanyMatchings/acceptChanges',
      defferProduct: 'productCompanyMatchings/defferProduct'
    }),
    ...mapMutations({
      getProductCompanyMatchings: 'productCompanyMatchings/getProductCompanyMatchings',
      holdOnCandidates: 'productCompanyMatchings/holdOnCandidates'
    }),
    // for infinite scroll
    bottomVisible () {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
    getLogoUrl (key) {
      return this.s3_logos_bucket.getSignedUrl('getObject', {
        Key: key,
        Expires: 60 * 5
      })
    },
    hideCandidate () {
      this.hideCandidate()
      this.nextCandidate()
    },
    onDefferProduct (matchingId, companyId) {
      this.defferProduct({ matchingId, companyId })
    },
    onaAcceptChanges (matchingId, companyId) {
      this.acceptChanges({ matchingId, companyId })
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
    status () {
      return this.$store.state.productCompanyMatchings.status
    },
    candidates () {
      return this.$store.state.productCompanyMatchings.candidates
    },
    s3_logos_bucket () {
      return this.$store.state.productCompanyMatchings.s3_logos_bucket
    },
    companies () {
      return this.$store.state.productCompanyMatchings.companies
    },
    matchingsToPost () {
      return this.$store.state.productCompanyMatchings.matchingsToPost
    },
    matchingsToDelete () {
      return this.$store.state.productCompanyMatchings.matchingsToDelete
    }
  },
  watch: {
    candidates (val) {
      if (val.length === 0) {
        let c1 = this.c1
        let c2 = this.c2
        this.getCandidates({ c1, c2 })
      }
    },
    page (val) {
      if (val >= 3) {
        this.pages = val + 1
      } else {
        this.pages = 4
      }
    },
    c1 (val) {
      let c1 = val
      let c2 = this.c2
      this.getCandidates({ c1, c2 })
    },
    c2 (val) {
      let c1 = this.c1
      let c2 = val
      this.getCandidates({ c1, c2 })
    }
  },
  created () {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    let c1 = this.c1
    let c2 = this.c2
    this.getCandidates({ c1, c2 })
  }
}
</script>

<style scoped>

</style>
