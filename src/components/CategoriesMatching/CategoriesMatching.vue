<template>
  <v-container flex style="padding: 1px">
    <br>
      <v-toolbar-title>Golden Catalog <span style="color: darkgreen; font-size: smaller">( не привязанных категорий: {{ newQty }} )</span></v-toolbar-title>
    <v-layout>
      <v-flex xs5 >
          <v-treeview
                :items="goldenCatalog"
                :active.sync="active"
                item-key="golden_category_id"
                item-text="golden_category_name"
                return-object
                activatable
                active-class="green lighten-5 green--text"
                selected-color="indigo"
                selectable
                expand-icon="arrow_drop_down"
                on-icon="mdi-bookmark"
                off-icon="mdi-bookmark-outline"
                indeterminate-icon="mdi-bookmark-minus"
              >
              </v-treeview>
      </v-flex>
<!-------------------------------------------------РЕЗУЛЬТАТ ПОИСКА--------------------------------------------------->
      <v-divider vertical></v-divider>
      <v-flex xs7 v-if="active.length > 0" style="padding-left: 10px">
        <h2 style="color: darkgreen">{{ active[0].golden_category_name }}</h2>
        <br>
        <v-layout v-if="active[0].level<3" row wrap>
          <v-flex xs12>
            <span style="color: dimgrey; font-size: larger">Подкатегории:</span>
          </v-flex>
          <br>
          <br>
          <v-flex xs12 v-for="child in active[0].children">
            <v-layout row wrap>
              <v-flex xs6 style="font-size: larger; color: darkgreen">{{ child.golden_category_name }}</v-flex>
              <v-flex xs4>
                <v-btn flat color="warning" small>изменить</v-btn>
              </v-flex>
              <v-flex xs2>
                <v-btn flat color="red" small>удалить</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 style="color: dimgrey">
            <br>
            <br>
            <br>
            Создать новую категорию
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs6 style="font-size: larger; color: darkgreen">
                <v-text-field
                  v-model="new_category_name"
                  label="название"
                  color="green"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  v-if="new_category_name.length > 0"
                  flat color="green darken-4" small
                  @click="onCreateGoldenCategory(new_category_name, active[0].level+1, active[0].golden_category_id)"
                >
                  создать
                </v-btn>
                <v-btn
                  v-else
                  flat color="green darken-4" small
                  disabled
                >
                  создать
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
<!--        <v-layout row wrap>-->
<!--          <v-flex xs12>-->
<!--            <h2>Категория: {{ newCategory.category_name }}</h2>-->
<!--          </v-flex>-->
<!--          <v-flex v-for="company in newCategory.candidates" xs6>-->
<!--            <h3>{{ company.company_id }}</h3>-->
<!--            <p v-for="cand in company.candidates">-->
<!--              <span style="font-size: larger;color: dimgrey">{{ cand.category_name }}</span>-->
<!--              {{ cand.golden_id }}-->
<!--              <span style="color: saddlebrown; font-size: larger">{{ Math.round(cand.count * 1000) / 10 }} %</span>-->
<!--            </p>-->
<!--          </v-flex>-->
<!--        </v-layout>-->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'CategoriesMatching',
  data: () => ({
    active: [],
    new_category_name: ''
  }),
  // components: {
  //   ProductCard
  // },
  methods: {
    ...mapActions({
      getNewCategoriesQty: 'categoriesMatchings/getNewCategoriesQty',
      getNewCategory: 'categoriesMatchings/getNewCategory',
      createGoldenCategory: 'categoriesMatchings/createGoldenCategory'
    }),
    ...mapMutations({
      getGoldenCatalog: 'categoriesMatchings/getGoldenCatalog'
    }),
    onCreateGoldenCategory (name, level, parent) {
      if (name.length > 0) {
        this.new_category_name = ''
        this.createGoldenCategory({ name, level, parent })
      } else {
        console.log('error')
      }
    }
  },
  computed: {
    newQty () {
      return this.$store.state.categoriesMatchings.newQty
    },
    newCategory () {
      return this.$store.state.categoriesMatchings.newCategory
    },
    getCandidates () {
      return this.$store.state.categoriesMatchings.getCandidates
    },
    goldenCatalog () {
      return this.$store.state.categoriesMatchings.goldenCatalog
    }
  },
  watch: {
    active (val) {
      if (val.length > 0) {
        console.log(val[0].level)
        console.log(val[0].golden_category_id)
      }
    }
  },
  created () {
    this.getNewCategoriesQty()
    this.getNewCategory()
    this.getGoldenCatalog()
  }
}
</script>

<style scoped>

</style>
