<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="memberLevel"
             :rules="rules"
             ref="memberLevelFrom"
             label-width="150px"
             size="small">
      <el-form-item label="会员等级名称：" prop="username">
        <el-input v-model="memberLevel.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="增长值：">
        <el-input v-model="memberLevel.growthPoint" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="免运费标准：">
        <el-input v-model="memberLevel.freeFreightPoint" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="每次评价获取的成长值：">
        <el-input v-model="memberLevel.commentGrowthPoint" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="是否默认等级：">
        <el-select v-model="memberLevel.defaultStatus">
          <el-option
            v-for="type in statusOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有免邮特权：">
        <el-select v-model="memberLevel.priviledgeFreeFreight">
          <el-option
            v-for="type in commonOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有签到特权：">
        <el-select v-model="memberLevel.priviledgeSignIn">
          <el-option
            v-for="type in commonOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有评论获奖励特权：">
        <el-select v-model="memberLevel.priviledgeComment">
          <el-option
            v-for="type in commonOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有专享活动特权：">
        <el-select v-model="memberLevel.priviledgePromotion">
          <el-option
            v-for="type in commonOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有会员价格特权：">
        <el-select v-model="memberLevel.priviledgeMemberPrice">
          <el-option
            v-for="type in commonOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有生日特权：">
        <el-select v-model="memberLevel.priviledgeBirthday">
          <el-option
            v-for="type in commonOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="memberLevel.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('memberLevelFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('memberLevelFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createMemberLevel, viewMemberLevel, updateMemberLevel} from '@/api/memberLevel'
  const defaultStatusOptions = [
    {
      label: '不是',
      value: 0
    },
    {
      label: '是',
      value: 1
    }
  ];
  const defaultOptions = [
    {
      label: '没有',
      value: 0
    },
    {
      label: '有',
      value: 1
    }
  ];
  const defaultMemberLevel = {
    name: null,
    growthPoint: 0,
    defaultStatus: 0,
    freeFreightPoint: 0.0,
    commentGrowthPoint: 0,
    priviledgeFreeFreight: 0,
    priviledgeSignIn: 0,
    priviledgeComment: 0,
    priviledgePromotion: 0,
    priviledgeMemberPrice:0,
    priviledgeBirthday:0,
    note:null
  };
  export default {
    name: 'MemberLevelDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        memberLevel: null,
        rules: {
          name: [
            {required: true, message: '请输入会员等级名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        statusOptions: Object.assign({}, defaultStatusOptions),
        commonOptions: Object.assign({}, defaultOptions)
      }
    },
    created(){
      if (this.isEdit) {
          viewMemberLevel(this.$route.query.id).then(response => {
          this.memberLevel = response.data;
        });
      }else{
        this.memberLevel = Object.assign({},defaultMemberLevel);
      }
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
                updateMemberLevel(this.$route.query.id, this.memberLevel).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createMemberLevel(this.memberLevel).then(response => {
                  this.$refs[formName].resetFields();
                  this.memberLevel = Object.assign({},defaultMemberLevel);
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
        this.memberLevel = Object.assign({},defaultMemberLevel);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


