import axios from 'axios'

// initial state
const state = {
  units: null,
  host: process.env.VUE_APP_MATCHING_IMAGE_URL,
  similarities: null,
  time_stat: null,
  matching_id: null
}

// getters
const getters = {
}

// actions
const actions = {
  getSimilarities ({ commit, state }, { productId, companyId, topn, includeSameCompany }) {
    let host = state.host
    console.log(productId, companyId, topn, includeSameCompany, host)
    let params = {
      matching_id: productId,
      company_id: companyId,
      topn: topn,
      include_same_company: includeSameCompany,
      get_time_statistics: true
    }
    axios.get(host.concat('matching-competitors/get_similars'), {
      params: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      let similarities = resp['companies_similarities']
      let timeStat = resp['time_stat']
      let matchingId = resp['request']['matching_id']
      if (similarities) {
        commit('setSimilarities', { similarities })
      }
      if (timeStat) {
        commit('setTimeStat', { timeStat })
      }
      if (matchingId) {
        commit('setMatchingId', { matchingId })
      }
    })
      .catch(e => {
        let f = null
        commit('setSimilarities', { f })
        commit('setTimeStat', { f })
        console.log(e)
      })
  }
}

// mutations
const mutations = {
  setSimilarities (state, { similarities }) {
    state.similarities = similarities
  },
  setTimeStat (state, { timeStat }) {
    state.time_stat = timeStat
  },
  setMatchingId (state, { matchingId }) {
    state.matching_id = matchingId
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
