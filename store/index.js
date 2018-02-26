let apiUrl = 'http://localhost:8096/api/v1';

export const state = () => ({
  planfixAccount: '',
  tabIndex: 0
})

export const mutations = {
  tabIndex: (state, newValue) => {
    state.tabIndex = newValue
  },
  planfixAccount: (state, newValue) => {
    state.planfixAccount = newValue
  }
}

export const actions = {
  async fetchParams ({ commit }) {
    const { data } = await this.$axios.get(apiUrl + '/params');
    console.log(data);
    commit('planfixAccount', data.planfix_account);
  }
}
