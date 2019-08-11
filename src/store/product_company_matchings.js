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
  })
}

// getters
const getters = {
}

// actions
const actions = {
  getCandidates ({ commit, state }) {
    let host = state.host
    state.candidates = null
    axios.get(host.concat('products-matching/get_candidates'), {
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
  shiftCandidates (state) {
    state.candidates.shift()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
