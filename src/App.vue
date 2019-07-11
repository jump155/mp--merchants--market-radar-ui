<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            :prepend-icon="item.icon"
            v-model="item.active"
            value="true"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>{{item.text}}</v-list-tile-title>
              </v-list-tile>
            </template>
            <!--            :prepend-icon="item.model ? item.icon : item['icon-alt']"-->
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              :href="child.href"
            >
              <v-list-tile-title v-text="child.text"></v-list-tile-title>
              <v-list-tile-action v-if="child.icon">
                <v-icon color="green lighten-1 green--text">{{ child.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else @click="" :key="item.text" :href="item.href">
            <v-list-tile-action>
              <v-icon color="green lighten-1 green--text">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      app
    >
      <v-toolbar-title class="headline text-uppercase" >
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="font-weight-bold">MATCHING</span>
        <span class="font-weight-light">MANAGEMENT</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
// ...

import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  data: () => ({
    tab: 'segmentation-master',
    dialog: false,
    drawer: null,
    items: [
      // {
      //   icon: 'cloud_download',
      //   text: 'Загружаемые отчеты',
      //   href: '/#/reports'
      // },
      {
        icon: 'collections',
        text: 'Products matching',
        model: false,
        active: true,
        children: [
          {
            icon: 'image_search',
            text: 'Матчинг товаров по категориям',
            href: '/#/products-matching'
          },
          {
            icon: 'image_search',
            text: 'Тест',
            href: '/#/products-matching-test'
          }
        ]
      },
      {
        icon: 'collections',
        text: 'Image matching',
        model: false,
        active: false,
        children: [
          {
            icon: 'image_search',
            text: 'Поиск по фото',
            href: '/#/image-matching'
          }
        ]
      },
      {
        icon: 'text_fields',
        text: 'Title matching',
        model: false,
        children: [
          {
            icon: 'timer_3',
            text: 'units',
            href: '/#/units'
          }
        ]
      }
      // {
      //   icon: 'pie_chart',
      //   text: 'Сегментация товаров',
      //   children: [
      //     {
      //       text: 'Мастер-каталог',
      //       href: '/#/segmentation-master'
      //     },
      //     {
      //       text: 'Кастомный каталог',
      //       href: '/#/segmentation-custom'
      //     }
      //   ]
      //   // href: '/segmentation'
      // },
      // {
      //   icon: 'vertical_split',
      //   text: 'Categories matching',
      //   // href: '/analogs',
      //   model: false,
      //   children: [
      //     {
      //       icon: 'format_indent_increase',
      //       text: 'Categories Market',
      //       href: '/#/categories-market'
      //     },
      //     {
      //       icon: 'format_indent_decrease',
      //       text: 'Categories LM',
      //       href: '/#/categories-lm'
      //     }
      //   ]
      // },
      // {
      //   icon: 'wallpaper',
      //   text: 'Image matching',
      //   model: false
      // },
      // { icon: 'help', text: 'Помощь' }
    ]
  }),
  methods: {
    // ...mapActions({
    //   checkToken: 'authorize/checkToken' // map `this.login()` to `this.$store.dispatch('login')`
    // })
  },
  computed: {
    ...mapState({
      // status: state => state.authorize.status,
      // ldap: state => state.authorize.ldap
    })
  }
  // beforeMount () {
  //   this.checkToken()
  // }
}
</script>
