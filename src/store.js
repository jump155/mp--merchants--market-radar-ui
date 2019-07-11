import Vue from 'vue'
import Vuex from 'vuex'
// import authorize from './store/authorize'
import units from './store/units'
// import categories from './store/categories'
// import segmentation from './store/segmentation'
import imageModel from './store/image_model'
import productCompanyMatchings from './store/product_company_matchings'
// import reports from './store/reports'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // authorize,
    units,
    // categories,
    // segmentation,
    imageModel,
    productCompanyMatchings
    // reports
  }
})
