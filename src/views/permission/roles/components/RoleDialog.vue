<template>
  <el-dialog v-model="dialogShow" :title="title" :close-on-click-modal="false">
    <el-form v-loading="loading" ref="formRef" :model="roleForm" :rules="rules" label-width="150px">
      <el-form-item label="RoleName" prop="roleName">
        <el-input v-model="roleForm.roleName" :disabled="isEdit" placeholder="RoleName" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="roleForm.description" placeholder="Description" />
      </el-form-item>
      <el-form-item label="RoleUserList" prop="roleUserList">
        <el-select v-model="roleForm.roleUserList" multiple style="width: 100%">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="RoleMenuList" prop="roleMenuList">
        <el-tree
          v-if="!loading"
          ref="menuTreeRef"
          :data="menuTreeList"
          :props="{ children: 'children', label: 'menuName' }"
          :default-checked-keys="roleForm.roleMenuList"
          node-key="id"
          show-checkbox
          default-expand-all
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">{{ t('btn.cancel') }}</el-button>
        <el-button type="primary" v-button-anti-shake @click="handleSubmit(formRef)">
          {{ t('btn.submit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    name: 'RoleDialog',
  };
</script>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { getRoleAPI, createRoleAPI, updateRoleAPI } from '@/api/role';
  import { getUserListAPI } from '@/api/user';
  import { getMenuTreeListAPI } from '@/api/menu';
  import { ElTree } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import { useLoading } from '@/hooks';

  const { t } = useI18n();
  const { loading, showLoading, hideLoading } = useLoading();

  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Object,
      default: () => {
        return {
          type: 'create',
          id: null,
          data: {},
        };
      },
    },
  });
  const emit = defineEmits(['update:dialogVisible', 'change']);

  const dialogShow = computed({
    get: () => props.dialogVisible,
    set: (val) => emit('update:dialogVisible', val),
  });
  const title = computed(() => {
    if (props.action.type === 'create') {
      return 'Create Role';
    }
    return 'Update Role';
  });
  const isEdit = computed(() => {
    return props.action && props.action.type === 'update';
  });

  const formRef = ref();
  const roleForm = reactive({
    id: null,
    roleName: '',
    description: '',
    roleUserList: [],
    roleMenuList: [],
  });

  const rules = reactive({
    roleName: [{ required: true, message: 'Please input RoleName', trigger: 'blur' }],
  });

  const menuTreeRef = ref();
  const userList = reactive([]);
  const menuTreeList = reactive([]);

  const getRole = () => {
    if (!props.action.id) return;
    getRoleAPI(props.action.id).then((res) => {
      roleForm.roleUserList = res.data.roleUserList;
      roleForm.roleMenuList = res.data.roleMenuList;
    });
  };

  const getUserList = () => {
    getUserListAPI({ pageNumber: 1, pageSize: 9999 }).then((res) => {
      Object.assign(userList, res.data.list);
    });
  };

  const getMenuTreeList = () => {
    getMenuTreeListAPI()
      .then((res) => {
        Object.assign(menuTreeList, res.data);
        hideLoading();
      })
      .catch(() => {
        hideLoading();
      });
  };

  const handleSubmit = async (formInstance) => {
    if (!formInstance) return;

    await formInstance.validate((valid, fields) => {
      if (valid) {
        const menuTreeCheckList = menuTreeRef.value.getCheckedNodes();
        roleForm.roleMenuList = menuTreeCheckList.map((item) => item.id);
        const request = isEdit.value ? updateRoleAPI : createRoleAPI;
        request(roleForm).then(() => {
          emit('change');
          handleCancel();
        });
      } else {
        console.log('error submit!', fields);
      }
    });
  };

  const handleCancel = () => {
    emit('update:dialogVisible', false);
  };

  onBeforeMount(async () => {
    if (isEdit.value) {
      Object.assign(roleForm, props.action.data);
    }
    showLoading();
    await getRole();
    await getUserList();
    await getMenuTreeList();
  });
</script>

<style lang="scss" scoped></style>
