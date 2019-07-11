import axios from 'axios'

// initial state
const state = {
  units: null,
  host: process.env.VUE_APP_MATCHING_MANAGEMENT_API_URL,
  similars: null,
  matchingIdInfo: null,
  companyId: null
}

// getters
const getters = {
}

// actions
const actions = {
  getProductCompanyMatchings ({ commit, state }, { matchingId, companyId, topN }) {
    let host = state.host
    let params = {
      matching_id: matchingId,
      company_id: companyId,
      top_n: topN
    }
    state.matchingIdInfo = null
    state.matchings = null
    state.companyId = null
    axios.get(host.concat('products-matching/product_company_matchings'), {
      params: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      state.matchingIdInfo = resp.matching_id_info
      console.log(response.data)
      state.similars = resp.similars
      state.companyId = resp.company_id
    })
      .catch(e => {
        console.log(e)
      })
  }
}

// mutations
const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
