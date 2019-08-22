import axios from 'axios'

// initial state
const state = {
  newCategory: null,
  candidates: null,
  newQty: 0,
  goldenCatalog: [],
  host: process.env.VUE_APP_MARKET_RADAR_BACK_URL
}

// getters
const getters = {
}

// actions
const actions = {
  getNewCategoriesQty ({ commit, state }) {
    let host = state.host
    axios.get(host.concat('categories-matching/get_new_categories_qty'), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      let qty = resp.qty
      state.newQty = qty
    })
      .catch(e => {
        console.log(e)
      })
  },
  getNewCategory ({ commit, state }) {
    let host = state.host
    let params = {
      'max_count': 25
    }
    axios.get(host.concat('categories-matching/get_new_category'), {
      params: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      let newCategory = response.data
      state.newCategory = newCategory
    })
      .catch(e => {
        console.log(e)
      })
  },
  getCandidates  ({ commit, state }, { companyId, categoryId }) {
    let host = state.host
    let params = {
      'company_id': companyId,
      'category_id': categoryId
    }
    axios.get(host.concat('categories-matching/get_candidates'), {
      params: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      let candidates = resp.candidates
      state.candidates = candidates
    })
      .catch(e => {
        console.log(e)
      })
  },
  createGoldenCategory  ({ commit, state }, { name, level, parent }) {
    let host = state.host
    console.log(name, level, parent)
    let params = {
      'name': name,
      'level': level,
      'parent': parent
    }
    console.log(params)
    axios.post(host.concat('categories-matching/golden_category'), {
      params: params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      console.log(resp)
      if (resp.status === 'success') {
        commit.getGoldenCatalog(state)
      }
    })
      .catch(e => {
        console.log(e)
      })
  }
}

// mutations
const mutations = {
  getGoldenCatalog  (state) {
    let host = state.host
    axios.get(host.concat('categories-matching/golden_catalog'), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      state.goldenCatalog = resp.golden_catalog
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
