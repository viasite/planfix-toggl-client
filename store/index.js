let apiUrl = 'https://localhost:8097/api/v1';

export const state = () => ({
  apiUrl: apiUrl,
  tabIndex: 0,
  tabs: [],
  title: 'planfix-toggl',
  config: {},
});

export const mutations = {
  tabIndex: (state, newValue) => {
    state.tabIndex = newValue
  },
  config: (state, newValue) => {
    state.config = newValue
  },
  tabs: (state, newValue) => {
    state.tabs = newValue
  },
  title: (state, newValue) => {
    state.title = newValue
  },
  apiUrl: (state, newValue) => {
    state.apiUrl = newValue
  }
};

export const actions = {
  async fetchConfig ({ commit }) {
    const { data } = await this.$axios.get(apiUrl + '/config');
    commit('config', data);
  }
};
