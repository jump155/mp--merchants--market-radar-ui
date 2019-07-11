<template>
  <v-container flex style="padding: 1px">
    <v-card flat>
      <v-toolbar
        card
        color="gray lighten-4"

      >
        <v-toolbar-title>Тестирование матчинга изображений</v-toolbar-title>
      </v-toolbar>
        <v-layout style="padding-top: 0px">
          <v-flex xs3 >
              <v-card-text style="padding-top: 1px; padding-bottom: 3px; overflow-y: scroll;overflow-x: scroll; max-height: 90vh" >
                <br>
                <h2 class="grey--text">Искомый товар</h2>
                <v-layout row wrap>
                  <v-flex xs12 v-if="matching_id">
                    <v-img
                    :src="host.concat('image_path/logo?competitor=', company_id)"
                    aspect-ratio="1"
                    height="100"
                    width="240"
                    ></v-img>
                    <br>
                    <br>
                    <v-img
                      :src="host.concat('image_path/image?matching_id=', matching_id, '&n=', 0)"
                      aspect-ratio="1"
                    >
                    </v-img>
                  </v-flex>
                  <div v-else></div>
                  <v-flex xs12>
                    <v-subheader>1) Выберите товар</v-subheader>
                    <v-text-field
                      color="green green--text"
                      label="Артикул"
                      placeholder="Введите код товара с сайта"
                      v-model="product_id"
                      outline
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-subheader>2) Выберите, чей это артикул</v-subheader>
                    <v-select
                      color="green green--text"
                      :items="companies"
                      v-model="company_id"
                      label="Компания"
                      outline
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-subheader>3) добавить {{ company_id }} в результат</v-subheader>
                    <v-switch
                      color="green green--text"
                      v-model="include_same_company"
                      label="добавить компанию"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs12>
                    <v-subheader>4) топ результатов: {{ topn }}</v-subheader>
                    <v-slider
                      color="green green--text"
                      v-model="topn"
                    ></v-slider>
                  </v-flex>
                  <v-flex xs12>
                    <v-btn
                      color="green green--text"
                      outline
                      flat
                      @click="getSimilaritiesMethod(product_id, company_id, topn, include_same_company)"
                    >
                      найти
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
          </v-flex>
<!--------------------------------------------------РЕЗУЛЬТАТ ПОИСКА--------------------------------------------------->
          <v-divider vertical></v-divider>
          <div v-if="!similarities"></div>
          <v-flex xs9 v-else>
            <v-flex>
              <h2 class="grey--text">Результат</h2>
              Время выполнения: <br>
              - Извлечение данных по товару из MongoDB: <span style="bold">{{ Math.round(time_stat['Getting feature vectors from MongoDB'] * 1000) / 1000 }} сек</span> <br>
              --- Поиск похожих: {{ Math.round(time_stat['Prediction of close indexes'] * 1000) / 1000 }} сек <br>
              ----- Агрегация результатов: {{ Math.round(time_stat['Aggregation'] * 1000) / 1000 }} сек <br>
              Общее время: {{ Math.round(time_stat['Total'] * 1000) / 1000 }} сек <br>
            </v-flex>
            <v-card-text style="padding-top: 0px; padding-bottom: 3px; overflow-y: scroll;overflow-x: scroll; max-height: 85vh" >
              <div v-for="(company, name) in similarities">
                <v-img
                  :src="host.concat('image_path/logo?competitor=', name)"
                  aspect-ratio="1"
                  height="50"
                  width="120"
                >
                </v-img>
                <v-layout row wrap>
                  <v-flex
                    v-for="img in company.slice(0,16)"
                    xs3
                    d-flex
                  >
                    <v-card flat tile class="d-flex">
                      <v-card-text>
                        <v-img
                          :src="host.concat('image_path/image?matching_id=', img.matching_id, '&n=', 0)"
                          aspect-ratio="1"
                        >
                        </v-img>&nbsp;&nbsp;
                        <span style="font-size: small">{{ img.matching_id }}</span>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
                <br>
                <br>
                <v-divider></v-divider>
              </div>
              </v-card-text>
          </v-flex>
        </v-layout>
    </v-card>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'ImageMatching',
  data: () => ({
    product_id: null,
    company_id: 'lm',
    topn: 7,
    companies: ['lm', 'lmmarket', 'petrovich', 'obi'],
    include_same_company: false,
    host: process.env.VUE_APP_MATCHING_IMAGE_URL
  }),
  methods: {
    ...mapActions({
      getSimilarities: 'imageModel/getSimilarities'
    }),
    getSimilaritiesMethod (productId, companyId, topn, includeSameCompany) {
      this.getSimilarities({ productId, companyId, topn, includeSameCompany })
    }
  },
  computed: {
    similarities () {
      return this.$store.state.imageModel.similarities
    },
    time_stat () {
      return this.$store.state.imageModel.time_stat
    },
    matching_id () {
      return this.$store.state.imageModel.matching_id
    }
  }
}
</script>

<style scoped>

</style>
