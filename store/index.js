let apiUrl = 'https://localhost:8097/api/v1';
// let apiUrl = 'http://localhost:8096/api/v1';

export const state = () => ({
  apiUrl: apiUrl,
  tabIndex: 0,
  tabs: [],
  title: 'planfix-toggl',
  config: {},
  temp: {},
  openSide: false,
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
  },
};

export const actions = {
  async fetchConfig ({ commit }) {
    const { data } = await this.$axios.get(apiUrl + '/config');
    commit('config', data);
  },

  async storeConfig (context, options) {
    ['SendInterval', 'TogglWorkspaceID', 'SMTPPort'].forEach(name => {
      this.state.config[name] = parseInt(this.state.config[name]);
    });
    let data = await this.$axios.post(apiUrl + '/config', this.state.config);
  }
};

export const strict = false;