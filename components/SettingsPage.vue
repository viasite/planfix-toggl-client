<template id="main">
  <v-ons-page>
    <v-ons-list>

      <v-ons-list-item>
        Основные секции имеют кнопку проверки правильности настроек.
        После изменения настроек перезапустите сервер, чтобы всё применилось
      </v-ons-list-item>

      <ConfigEntry
        name=""
        config-name="DryRun"
        type="switch"
        description="Тестовый режим, когда данные в Планфиксе и Toggl не меняются. <br>Включите, пока не заработает. <br>Нажмите 'Проверить', чтобы настройка сохранилась"
      ></ConfigEntry>

      <v-ons-list-header>Toggl</v-ons-list-header>
      <div>
        <ConfigEntry
          name=""
          config-name="TogglAPIToken"
          type="password"
          description="Токен Toggl, в <a target=_blank href=https://toggl.com/app/profile>настройках profile</a>"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="TogglWorkspaceID"
          type="number"
          description="Toggl workspace ID, в URL в <a target=_blank href=https://toggl.com/app/settings>веб-интерфейса Toggl</a>"
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
          description="Название вашего Планфикс аккаунта (mycompany для mycompany.planfix.ru"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixUserName"
          type="text"
          description="Логин вашего пользователя в Планфиксе"
        ></ConfigEntry>

        <ConfigEntry
          name="Пароль"
          config-name="PlanfixUserPassword"
          type="password"
          description="Ваш пароль в Планфиксе"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAPIKey"
          type="password"
          description="Приватный API ключ, <br>попросите у владельца аккаунта, <a target=_blank href=https://planfix.ru/docs/ПланФикс_API:_Авторизация_по_токену>инструкция</a>"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAPIUrl"
          type="text"
          description="URL API Планфикса, <br>для аккаунтов в России он будет <a target=_blank href=https://planfix.ru/docs/Введение>другим</a>"
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
        <!-- <v-ons-list-item>
          <div class="center">
            <span class="list-item__title"></span>
            <span class="list-item__subtitle">Тест селектов</span>
            <v-ons-select style="width:100%" v-model="$store.state.config['planfixAnaliticName']">
              <option
                v-for="item in $store.state.analitics"
                v-bind:key="item.ID"
                :value="item.Name"
              >{{ item.Name }}
              </option>
            </v-ons-select>
          </div>
        </v-ons-list-item> -->
        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticName"
          type="text"
          description="Название аналитики (не забудьте сохранить её перед проверкой), например, 'Выработка'"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticTypeName"
          type="text"
          description="Название поля выбора записи справочника, например, 'Вид работы'"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticTypeValue"
          type="text"
          description="Название записи справочника из предыдущего поля, измеряемой в минутах, например, 'Поминутная работа программиста'"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticCountName"
          type="text"
          description="Название поля количества, сюда будет попадать кол-во минут, например, 'Количество'"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticCommentName"
          type="text"
          description="Название поля комментария, сюда будет попадать название toggl записи"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticDateName"
          type="text"
          description="Название поля даты (день, без времени)"
        ></ConfigEntry>

        <ConfigEntry
          name=""
          config-name="PlanfixAnaliticUsersName"
          type="text"
          description="Название поля сотрудника (мультиполе сотрудников)"
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
      <ons-list-item expandable>
        <div class="expandable-button">Если у вас бесплатный аккаунт</div>
        <div class="expandable-content">
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
      </ons-list-item>


    </v-ons-list>
  </v-ons-page>
</template>

<style>
ons-input:hover {
  background: #eee;
}
ons-list-item[expandable] {
  padding: 0;
}
.expandable-button {
  padding-left: 15px;
}
</style>

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
      async checkPlanfixConnection() {
        let message = '';
        // GET /api/v1/validate/planfix/user
        let {data} = await this.$axios.get(this.$store.state.apiUrl + '/validate/planfix/user');
        let {ok, errors} = data;

        // commit message
        if (ok) {
          message = 'Подключение успешно, ' + data.data.Name + ' ' + data.data.LastName;
        }
        else {
          message = 'Подключение не удалось: ' + errors.join(', ');
        }

        return {ok, message};
      },

      // проверяет подключение к Toggl и правильность workspace id
      async checkTogglConnection() {
        let message = '';
        // GET /api/v1/validate/toggl/user
        let {data} = await this.$axios.get(this.$store.state.apiUrl + '/validate/toggl/user');
        let {ok, errors} = data;

        // commit message
        if (ok) {
          message = 'Подключение успешно';

          // check workspace id
          let {data} = await this.$axios.get(this.$store.state.apiUrl + '/toggl/workspaces');
          let workspaces = data.data.map(w => w.id + ' (' + w.name + ')');
          let workspacesMsg = '<br>Доступные workspaces:<br> ' + workspaces.join(',<br>');
          let w = data.data.filter(workspace => workspace.id == this.$store.state.config.TogglWorkspaceID)
          if (w.length == 0) {
            message = 'Подкючение удалось, но workspace id ' + this.$store.state.config.TogglWorkspaceID + ' не найден';
            ok = false;
          }
          else {
            message = 'Подкючение удалось, иcпользуется ' + w[0].name;
          }
          message += '. ' + workspacesMsg;
        }
        else {
          message = 'Подключение не удалось: ' + errors.join(', ');
        }

        return {ok, message};
      },

      // проверяет правильность аналитики Планфикса
      async checkPlanfixAnalitic() {
        let message = '';
        // GET /api/v1/validate/planfix/analitic
        let {data} = await this.$axios.get(this.$store.state.apiUrl + '/validate/planfix/analitic');
        let {ok, errors} = data;

        // commit message
        if (ok) {
          message = 'Аналитика указана правильно';
        }
        else {
          message = errors.join(', ');
        }

        return {ok, message};
      }
    }
  }
</script>
