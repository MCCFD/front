<template>
  <n-card size="small">
    <n-page-header :subtitle="mail">
      <n-grid :cols="12" item-responsive>
        <n-gi :span="4">
          <n-statistic label="UID">
            {{ uid }}
          </n-statistic>
        </n-gi>
        <n-gi :span="4">
          <n-statistic label="解析">
            {{ parsing[0] }} / {{ parsing[1] }}
          </n-statistic>
        </n-gi>
        <n-gi :span="4"></n-gi>
        <n-gi :span="4"></n-gi>
      </n-grid>
      <template #title>{{ userName }}</template>
      <template #avatar>
        <n-avatar :src="userHead" />
      </template>
      <template #footer>
        <n-space>
          <!-- <n-button @click="showChangeMail = true" size="small">
            修改邮箱
          </n-button> -->
          <n-button @click="showChangePassword = true" size="small">
            修改密码
          </n-button>
          <n-button size="small" @click="OutButtonClick">退出账号</n-button>
        </n-space>
      </template>
    </n-page-header>
  </n-card>
  <n-card size="small" title="解析列表" style="margin-top: 6px">
    <template #header-extra>
      <n-button
        @click="showAddResolution = true"
        size="small"
        type="primary"
        ghost
      >
        新增解析
      </n-button>
    </template>
  </n-card>
  <n-card
    v-for="(item, index) in data"
    :key="index"
    size="small"
    :title="item.note"
    style="margin-top: 6px"
  >
    <template #header-extra>#{{ item.id }}</template>
    <p>域名: {{ item.domain }}</p>
    <p>服务器: {{ item.serve }}:{{ item.servePort }}</p>
    <n-space justify="end">
      <n-button
        tertiary
        type="primary"
        size="small"
        @click="showEditButtonClick(item)"
      >
        编辑
      </n-button>
    </n-space>
  </n-card>
  <!-- 编辑解析 -->
  <n-modal
    v-model:show="showEditResolution"
    class="custom-card"
    preset="card"
    size="small"
    :style="{ width: '700px' }"
    title="编辑解析"
    :bordered="false"
  >
    <CPResolutionList :data="editResolutionModalData" />
  </n-modal>
  <n-modal
    v-model:show="showAddResolution"
    class="custom-card"
    preset="card"
    size="small"
    :style="{ width: '700px' }"
    title="新增解析"
    :bordered="false"
  >
    <CPAddResolution />
  </n-modal>
  <n-modal
    v-model:show="showChangeMail"
    class="custom-card"
    preset="card"
    size="small"
    :style="{ width: '700px' }"
    title="修改邮箱"
    :bordered="false"
  >
    <CPChangeMail />
  </n-modal>
  <n-modal
    v-model:show="showChangePassword"
    class="custom-card"
    preset="card"
    size="small"
    :style="{ width: '700px' }"
    title="修改密码"
    :bordered="false"
  >
    <CPChangePassword />
  </n-modal>
</template>

<script>
import { h, ref, defineComponent } from "vue";
import VueCookies from "vue-cookies";
import CPAddResolution from "@/components/CP/CPAddResolution.vue";
import CPResolutionList from "@/components/CP/CPResolutionList.vue";
import CPChangeMail from "@/components/CP/CPChangeMail.vue";
import CPChangePassword from "@/components/CP/CPChangePassword.vue";
import {
  NGi,
  NGrid,
  NCard,
  NSpace,
  NModal,
  NButton,
  NAvatar,
  NStatistic,
  NPageHeader,
} from "naive-ui";
import { useMessage } from "naive-ui";

const Init = (props) => {
  if (props.error == true && props == "") return;

  uid.value = props.uid;
  parsing.value = props.parsing;
  mail.value = props.mail;
  userName.value = props.userName;
  userHead.value = props.userHead;
  createData.value = props.createData;
};

const createData = ref([]);
const uid = ref(0); //UID
const parsing = ref([0, 5]); //解析 0/5
const mail = ref(""); //邮箱
const userName = ref(""); //用户名
const userHead = ref(""); //用户头像
const showAddResolution = ref(false); //新增域名解析面板
const showEditResolution = ref(false); //编辑域名解析面板
const editResolutionModalData = ref(""); //编辑域名解析面板数据
const showChangeMail = ref(false); //修改邮箱面板
const showChangePassword = ref(false); //修改密码面板
export default defineComponent({
  components: {
    CPAddResolution,
    CPResolutionList,
    CPChangeMail,
    CPChangePassword,
    // NaiveUI
    NGi,
    NGrid,
    NCard,
    NSpace,
    NModal,
    NButton,
    NAvatar,
    NStatistic,
    NPageHeader,
  },
  props: {
    propsData: Object,
  },
  setup(props) {
    window.$message = useMessage();
    Init(props.propsData);
    return {
      uid,
      mail,
      parsing,
      userName,
      userHead,
      showAddResolution,
      showEditResolution,
      showChangeMail,
      showChangePassword,
      editResolutionModalData,
      data: createData,
      columns: [
        {
          type: "expand",
          renderExpand: (rowData) => {
            return h(CPResolutionList, {
              data: {
                id: rowData.id,
                note: rowData.note,
                domain: rowData.domain,
                serve: rowData.serve,
                servePort: rowData.servePort,
              },
            });
          },
        },
        {
          title: "ID",
          key: "id",
        },
        {
          title: "备注",
          key: "note",
        },
        {
          title: "域名",
          key: "domain",
        },
        {
          title: "服务器域名/IP",
          key: "serve",
        },
        {
          title: "服务器端口",
          key: "servePort",
        },
      ],
      showEditButtonClick(data) {
        editResolutionModalData.value = data;
        showEditResolution.value = true;
      },
      OutButtonClick(e) {
        e.preventDefault();
        VueCookies.remove("SESSDATA");
        window.$message.success("已退出账号");
        location.reload();
      },
    };
  },
});
</script>
