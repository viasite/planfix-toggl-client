let apiUrl = 'https://localhost:8097/api/v1';

export const state = () => ({
  planfixAccount: '',
  apiUrl: 'https://localhost:8097/api/v1',
  tabIndex: 0
});

export const mutations = {
  tabIndex: (state, newValue) => {
    state.tabIndex = newValue
  },
  planfixAccount: (state, newValue) => {
    state.planfixAccount = newValue
  },
  apiUrl: (state, newValue) => {
    state.apiUrl = newValue
  }
};

export const actions = {
  async fetchParams ({ commit }) {
    const { data } = await this.$axios.get(apiUrl + '/params');
    commit('planfixAccount', data.planfix_account);
  }
};
