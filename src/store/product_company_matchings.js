import axios from 'axios'

// initial state
const state = {
  units: null,
  host: process.env.VUE_APP_MARKET_RADAR_BACK_URL,
  similars: null,
  matchingIdInfo: null,
  companyId: null,
  matchingId: null
}

// getters
const getters = {
}

// actions
const actions = {
  getCandidate ({ commit, state }) {
    let host = state.host
    state.matchingIdInfo = null
    state.matchings = null
    state.companyId = null
    axios.get(host.concat('products-matching/get_candidate'), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      let matchingId = resp.matching_id
      state.matchingId = matchingId

      let companyId = resp.company_id
      state.companyId = companyId

      let topN = 12
      commit('getProductCompanyMatchings', { matchingId, companyId, topN })
    })
      .catch(e => {
        console.log(e)
      })
  }
}

// mutations
const mutations = {
  holdOnCandidate () {
    let host = state.host
    let params = {
      matching_id: state.matchingId,
      company_id: state.companyId,
      seconds: 30
    }
    axios.post(host.concat('products-matching/hold_on_candidate'), {
      params: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      let status = resp.status
      console.log(status)
    })
      .catch(e => {
        console.log(e)
      })
  },
  getProductCompanyMatchings (state, { matchingId, companyId, topN }) {
    console.log(matchingId, companyId, topN)
    let host = state.host
    let params = {
      matching_id: matchingId,
      company_id: companyId,
      top_n: topN
    }
    state.similars = null
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
      state.similars = resp.similars
    })
      .catch(e => {
        console.log(e)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
