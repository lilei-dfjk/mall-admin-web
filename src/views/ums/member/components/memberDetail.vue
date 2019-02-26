<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="member"
             :rules="rules"
             ref="memberFrom"
             label-width="150px"
             size="small">
      <el-form-item label="会员名称：" prop="username">
        <el-input v-model="member.username" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="会员昵称：">
        <el-input v-model="member.nickname" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input v-model="member.phone" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-select v-model="member.gender">
          <el-option
            v-for="type in genderOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态：">
        <el-select v-model="member.status">
          <el-option
            v-for="type in statusOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员等级：">
        <el-select v-model="member.memberLevelId">
          <el-option
            v-for="type in levelData"
            :key="type.id"
            :label="type.name"
            :value="type.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日：" prop="birthday">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="member.birthday"></el-date-picker>
      </el-form-item>
      <el-form-item label="头像：">
        <single-upload v-model="member.icon"></single-upload>
      </el-form-item>
      <el-form-item label="城市：">
        <el-input v-model="member.city" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="工作：">
        <el-input v-model="member.job" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="个性签名：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="member.personalizedSignature">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('memberFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('memberFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import {createMember, viewMember, updateMember} from '@/api/member'
  import {fetchList} from '@/api/memberLevel'
  const defaultStatusOptions = [
    {
      label: '禁用',
      value: 0
    },
    {
      label: '启用',
      value: 1
    }
  ];
  const defaultGenderOptions = [
    {
      label: '未知',
      value: 0
    },
    {
      label: '男',
      value: 1
    },
    {
      label: '女',
      value: 2
    }
  ];
  const defaultMember = {
    username: null,
    nickname: null,
    password: null,
    phone: null,
    status: 0,
    icon: null,
    gender: 0,
    birthday: null,
    city: null,
    job:null,
    personalizedSignature:null
  };
  export default {
    name: 'MemberDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        member: null,
        levelData:[],
        rules: {
          username: [
            {required: true, message: '请输入会员名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入广告链接', trigger: 'blur'},
            {min: 11, max: 11, message: '长度必须是11个字符', trigger: 'blur'}
          ],
        },
        statusOptions: Object.assign({}, defaultStatusOptions),
        genderOptions: Object.assign({}, defaultGenderOptions)
      }
    },
    created(){
      if (this.isEdit) {
          viewMember(this.$route.query.id).then(response => {
          this.member = response.data;
        });
      }else{
        this.member = Object.assign({},defaultMember);
      }
      this.getLevelData();
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateMember(this.$route.query.id, this.member).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createMember(this.member).then(response => {
                  this.$refs[formName].resetFields();
                  this.member = Object.assign({},defaultMember);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.member = Object.assign({},defaultMember);
      },
      getLevelData(){
        this.listLoading = true;
        fetchList().then(response => {
          this.listLoading = false;
          this.levelData = response.data;
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


