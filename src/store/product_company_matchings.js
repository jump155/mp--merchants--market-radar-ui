import axios from 'axios'
import AWS from 'aws-sdk'

// initial state
const state = {
  units: null,
  host: process.env.VUE_APP_MARKET_RADAR_BACK_URL,
  similars: null,
  matchingIdInfo: null,
  companyId: null,
  matchingId: null,
  candidates: null,
  status: null,
  matchingsToPost: [],
  matchingsToDelete: [],
  s3_images_bucket: new AWS.S3({
    accessKeyId: 'reZerictERS',
    secretAccessKey: 'wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY',
    endpoint: 'http://10.80.72.14:9000',
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4',
    params: { Bucket: 'market-radar-images' }
  }),
  s3_logos_bucket: new AWS.S3({
    accessKeyId: 'reZerictERS',
    secretAccessKey: 'wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY',
    endpoint: 'http://10.80.72.14:9000',
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4',
    params: { Bucket: 'market-radar-logos' }
  }),
  companies: ['lmmarket', 'lm', 'obi', 'petrovich']
}

// getters
const getters = {
}

// actions
const actions = {
  nextCandidate ({ commit, state, dispatch }) {
    state.matchingsToPost = []
    state.matchingsToDelete = []
    dispatch('shiftCandidates')
  },
  defferProduct ({ commit, state, dispatch }, { matchingId, companyId }) {
    state.matchingsToPost = []
    state.matchingsToDelete = []
    let host = state.host
    state.has_matching = false
    let params = {
      'matching_id': matchingId,
      'company_id': companyId,
      'status': 'deferred',
      'review_period': 30
    }
    axios.post(host.concat('products-matching/set_status'), params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      if (resp.status === 'success') {
        dispatch('shiftCandidates')
      }
    })
      .catch(e => {
        console.log(e)
      })
  },
  acceptChanges ({ commit, state, dispatch }, { matchingId, companyId }) {
    let matchingsToPost = state.matchingsToPost
    if (matchingsToPost.length > 0) {
      state.matchingsToPost = []
      for (let i = 0; i < matchingsToPost.length; i++) {
        let companyMatchingId = matchingsToPost[i]
        commit('matchProduct', { matchingId, companyId, companyMatchingId })
      }
    }

    let matchingsToDelete = state.matchingsToDelete
    if (matchingsToDelete.length > 0) {
      state.matchingsToDelete = []
      for (let i = 0; i < matchingsToDelete.length; i++) {
        console.log(matchingsToDelete[i])
      }
    }
    dispatch('shiftCandidates')
  },
  shiftCandidates ({ commit, state }) {
    state.candidates.shift()
    if (state.candidates.length > 0) {
      let matchingId = state.candidates[0].matching_id
      state.matchingId = matchingId

      let companyId = state.candidates[0].company_id
      state.companyId = companyId

      let topN = 15
      console.log(matchingId, companyId, topN)
      commit('getProductCompanyMatchings', { matchingId, companyId, topN })
    } else {
      this.getCandidates()
    }
  },
  getCandidates ({ commit, state }, { c1, c2 }) {
    console.log(c1, c2)
    let host = state.host
    state.candidates = null
    let params = {
      'company_id': c1,
      'company_to_search': c2
    }
    axios.get(host.concat('products-matching/get_candidates'), {
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
      if (candidates.length > 0) {
        let matchingId = candidates[0].matching_id
        state.matchingId = matchingId

        let companyId = candidates[0].company_id
        state.companyId = companyId

        let topN = 15
        console.log(matchingId, companyId, topN)
        commit('getProductCompanyMatchings', { matchingId, companyId, topN })
      }
    })
      .catch(e => {
        console.log(e)
      })
  }
}

// mutations
const mutations = {
  holdOnCandidates () {
    let host = state.host
    let params = {
      matching_id: state.matchingId,
      company_id: state.companyId,
      seconds: 30
    }
    axios.post(host.concat('products-matching/hold_on_candidates'), {
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
    // state.companyId = null
    state.matchingIdInfo = null
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
  },
  addMatchingToPost (state, matchingId) {
    state.matchingsToPost.push(matchingId)
  },
  addMatchingToDelete (state, matchingId) {
    state.matchingsToDelete.push(matchingId)
  },
  removeMatchingFromPost (state, matchingId) {
    state.matchingsToPost = state.matchingsToPost.filter(function (value, index, arr) {
      return value !== matchingId
    })
  },
  matchProduct (state, { matchingId, companyId, companyMatchingId }) {
    console.log(matchingId, companyId, companyMatchingId)
    let host = state.host
    let params = {
      'matching_id': matchingId,
      'company_id': companyId,
      'company_matching_id': companyMatchingId
    }
    axios.post(host.concat('products-matching/matching'), params, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }).then(response => {
      const resp = response.data
      console.log(matchingId, companyMatchingId, resp)
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
