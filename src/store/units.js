import axios from 'axios'

// const host = process.env.VUE_APP_MATCHING_TITLES_API_URL

// initial state
const state = {
  units: null,
  host: process.env.VUE_APP_MATCHING_TITLES_API_URL
}

// getters
const getters = {
}

// actions
const actions = {
  getUnits ({ commit, state }) {
    let host = state.host
    axios.get(host.concat('units/all'), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      const resp = response.data
      let units = resp['units']
      if (units) {
        commit('setUnits', { units })
      }
    })
      .catch(e => {
        console.log(e)
      })
  }
}

// mutations
const mutations = {
  setUnits (state, { units }) {
    state.units = units
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
