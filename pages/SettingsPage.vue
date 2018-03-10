<template id="main">
  <v-ons-page>
    <v-ons-list>

      <v-ons-list-header>Toggl</v-ons-list-header>
      <div>
        <ConfigEntry
          name=""
          config-name="TogglAPIToken"
          type="password"
          description="Токен Toggl, в настройках profile"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="TogglWorkspaceID"
          type="number"
          description="Toggl workspace ID, посмотрите в URL в веб-интерфейсе Toggl"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          type="check"
          button-name="Проверить"
          :action="checkTogglConnection"
        ></ConfigEntry>
      </div>


      <v-ons-list-header>Планфикс</v-ons-list-header>
      <div>
        <ConfigEntry
          name=""
          config-name="PlanfixAccount"
          type="text"
          description="Поддомен вашего Планфикс аккаунта"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixUserName"
          type="text"
          description="Логин"
        ></ConfigEntry>

        <ConfigEntry
          name="Пароль"
          config-name="PlanfixUserPassword"
          type="password"
          description=""
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAPIKey"
          type="password"
          description="Приватный API ключ, попросите у владельца аккаунта"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAPIUrl"
          type="text"
          description="URL API Планфикса, для аккаунтов в России он будет другим"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          type="check"
          button-name="Проверить"
          :action="checkPlanfixConnection"
        ></ConfigEntry>
      </div>


      <v-ons-list-header>Аналитика Планфикса: названия полей</v-ons-list-header>
      <div>
        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticName"
          type="text"
          description="выработка"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticTypeName"
          type="text"
          description="вид работы (справочник работ)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticTypeValue"
          type="text"
          description="поминутная работа программиста (вид работы)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticCountName"
          type="text"
          description="кол-во (минут)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticCommentName"
          type="text"
          description="комментарий / ссылка (текст, описание аналитики)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticDateName"
          type="text"
          description="дата (день, без времени)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticUsersName"
          type="text"
          description="сотрудник (мультиполе сотрудников)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          type="check"
          button-name="Проверить"
          :action="checkPlanfixAnalitic"
        ></ConfigEntry>
      </div>


      <v-ons-list-header>Прочие настройки</v-ons-list-header>
      <div>
        <ConfigEntry
          name=""
          config-name="SendInterval"
          type="slider" min="0" max="240"
          :description="'Интервал отправки данных в Планфикс, мин: ' + $store.state.config.SendInterval"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="Debug"
          type="switch"
          description="Подробный вывод ошибок (debug)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="DryRun"
          type="switch"
          description="Тестовый режим, когда данные в Планфиксе и Toggl не меняются"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="TogglSentTag"
          type="text"
          description="тег, который ставится отправленным toggl-записям"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="LogFile"
          type="text"
          description="путь к логу (относительно рабочей папки)"
        ></ConfigEntry>
      </div>


      <v-ons-list-header>Старые настройки подключения через SMTP</v-ons-list-header>
      <div>
        <ConfigEntry
          name="Host"
          config-name="SMTPHost"
          type="text"
          description=""
        ></ConfigEntry>

        <ConfigEntry
          name="Port"
          config-name="SMTPPort"
          type="number"
          description=""
        ></ConfigEntry>

        <ConfigEntry
          name="Логин"
          config-name="SMTPLogin"
          type="text"
          description=""
        ></ConfigEntry>

        <ConfigEntry
          name="Пароль"
          config-name="SMTPPassword"
          type="password"
          description=""
        ></ConfigEntry>

        <ConfigEntry
          name="From"
          config-name="SMTPEmailFrom"
          type="text"
          description="обычно совпадает с логином"
        ></ConfigEntry>

        <ConfigEntry
          name="From"
          config-name="PlanfixAuthorName"
          type="text"
          description="Имя Фамилия автора, будет приходить в письме для связи"
        ></ConfigEntry>
      </div>


    </v-ons-list>
  </v-ons-page>
</template>

<script type="text/javascript">
  import PageToolbar from '~/components/PageToolbar'
  import ConfigEntry from '../components/ConfigEntry'

  export default {
    components: {
      PageToolbar,
      ConfigEntry,
    },
    props: [],
    // кажется, тут вообще не нужно поле config, т.к. он берется из state
    data() {
      return {
        config: () => this.$store.state.config,
      };
    },
    watch: {
      config(config, oldConfig) {
        console.log('config changed', config, oldConfig);
      }
    },
    methods: {
      // проверяет подключение к Планфиксу
      async checkPlanfixConnection(event) {
        let message = '';
        // GET /api/v1/planfix/user
        let {data} = await this.$axios.get(this.$store.state.apiUrl + '/planfix/user');
        let success = data.data && data.data.ID && !data.errors;

        // commit message
        if (success) {
          message = 'Подключение успешно, ' + data.data.Name + ' ' + data.data.LastName;
        }
        else {
          message = 'Подключение не удалось: ' + data.errors.join(', ');
        }

        return { success, message };
      },

      // проверяет подключение к Toggl и правильность workspace id
      async checkTogglConnection(event) {
        let message = '';
        // GET /api/v1/planfix/user
        let {data} = await this.$axios.get(this.$store.state.apiUrl + '/toggl/user');
        let success = data.data && data.data.id && !data.errors;

        // commit message
        if (success) {
          message = 'Подключение успешно';

          // check workspace id
          let {data} = await this.$axios.get(this.$store.state.apiUrl + '/toggl/workspaces');
          let workspaces = data.data.map(w => w.id + ' (' + w.name + ')');
          let workspacesMsg = 'Доступные workspaces: ' + workspaces.join(', ');
          let w = data.data.filter(workspace => workspace.id == this.$store.state.config.TogglWorkspaceID)
          if (w.length == 0) {
            message = 'Подкючение удалось, но workspace id ' + this.$store.state.config.TogglWorkspaceID + ' не найден';
            success = false;
          }
          else {
            message = 'Подкючение удалось, иcпользуется ' + w[0].name;
          }
          message += '. ' + workspacesMsg;
        }
        else {
          message = 'Подключение не удалось: ' + data.errors.join(', ');
        }

        return { success, message };
      },

      // проверяет правильность аналитики Планфикса
      async checkPlanfixAnalitic(event) {
        let message = '';
        // GET /api/v1/planfix/user
        let {data} = await this.$axios.get(this.$store.state.apiUrl + '/planfix/analitic-ids');
        let success = data.data && data.data.ID && !data.errors;

        // commit message
        if (success) {
          message = 'Аналитика указана правильно';
        }
        else {
          message = data.errors.join(', ');
        }

        return { success, message };
      }
    }
  }
</script>