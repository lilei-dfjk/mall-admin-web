<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="logicsRule"
             :rules="rules"
             ref="logicsRuleFrom"
             label-width="150px"
             size="small">
      <el-form-item label="物流规则代码：" prop="type">
        <el-input v-model="logicsRule.type" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="物流规则名称：" prop="name">
        <el-input v-model="logicsRule.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="品牌类型代码：" prop="brandType">
        <el-input v-model="logicsRule.brandType" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="品牌类型名称：" prop="brandName">
        <el-input v-model="logicsRule.brandName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="数量限制：">
        <el-input v-model="logicsRule.numberLimit" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="重量限制：">
        <el-input v-model="logicsRule.weightLimit" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="价格限制：">
        <el-input v-model="logicsRule.priceLimit" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="是否可混装：">
        <el-select v-model="logicsRule.mixTypeFlag" @change="showMixTypeModel">
          <el-option
            v-for="type in statusOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量限制：" v-if="isMixType">
        <el-input v-model="logicsRule.mixNumberLimit" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="重量限制：" v-if="isMixType">
        <el-input v-model="logicsRule.mixWeightLimit" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="价格限制：" v-if="isMixType">
        <el-input v-model="logicsRule.mixPriceLimit" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="logicsRule.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('logicsRuleFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('logicsRuleFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createLogicsRule, viewLogicsRule, updateLogicsRule} from '@/api/logics'
  const defaultStatusOptions = [
    {
      label: '否',
      value: 0
    },
    {
      label: '是',
      value: 1
    }
  ];
  const defaultLogicsRule = {
    type: '',
    name: '',
    brandType: '',
    brandName: '',
    numberLimit: 0,
    weightLimit: 0.0,
    priceLimit: 0.0,
    mixTypeFlag: '',
    remark: '',
    mixPriceLimit: 0.0,
    mixWeightLimit: 0.0,
    mixNumberLimit: 0
  };
  export default {
    name: 'LogicsRuleDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        logicsRule: null,
        isMixType: false,
        rules: {
          type: [
            {required: true, message: '请输入物流规则代码', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入物流规则名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          brandType: [
            {required: true, message: '请输入品牌代码', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          brandName: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
        },
        statusOptions: Object.assign({}, defaultStatusOptions)
      }
    },
    created(){
      if (this.isEdit) {
          viewLogicsRule(this.$route.query.id).then(response => {
          this.logicsRule = response.data;
          if(this.logicsRule.mixTypeFlag == 1){
            this.isMixType = true;
          }else{
            this.isMixType = false;
          }
        });
      }else{
        this.logicsRule = Object.assign({},defaultLogicsRule);
      }
    },
    methods: {
      showMixTypeModel(value){
        if(value === 1){
          this.isMixType = true;
        }else{
          this.isMixType = false;
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateLogicsRule(this.$route.query.id, this.logicsRule).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createLogicsRule(this.logicsRule).then(response => {
                  this.$refs[formName].resetFields();
                  this.logicsRule = Object.assign({},defaultLogicsRule);
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
        this.logicsRule = Object.assign({},defaultLogicsRule);
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


