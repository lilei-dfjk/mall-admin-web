<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="codeData"
             :rules="rules"
             ref="codeFrom"
             label-width="150px"
             size="small">
      <el-form-item label="类型代码：">
        <el-input v-model="typeCode" class="input-width" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="代码：" prop="codeCode">
        <el-input v-model="codeData.codeCode" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="代码中文名称：" prop="codeCName">
        <el-input v-model="codeData.codeCName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="代码英文名称：">
        <el-input v-model="codeData.codeEName" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="是否有效：">
        <el-select v-model="codeData.validStatus" style="width: 320px;">
          <el-option
            v-for="type in statusOptions"
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
          v-model="codeData.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('codeFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('codeFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCode, viewCode, updateCode} from '@/api/code'
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
  const defaultCodeData = {
    typeCode: '',
    codeCode: '',
    codeCName: '',
    codeEName: '',
    remark: '',
    validStatus: 1,
  };
  export default {
    name: 'CodeDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        codeData: null,
        typeCode: sessionStorage.getItem('typeCode'),
        rules: {
          codeCode: [
            {required: true, message: '请输入代码', trigger: 'blur'},
            {min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur'}
          ],
          codeCName: [
            {required: true, message: '请输入代码中文名称', trigger: 'blur'},
            {min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur'}
          ]
        },
        statusOptions: Object.assign({}, defaultStatusOptions)
      }
    },
    created(){
      if (this.isEdit) {
        viewCode(this.$route.query.id).then(response => {
          this.codeData = response.data;
        });
      }else{
        this.codeData = Object.assign({},defaultCodeData);
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
              this.codeData.typeCode = this.typeCode;
              if (this.isEdit) {
                updateCode(this.$route.query.id, this.codeData).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createCode(this.codeData).then(response => {
                  this.$refs[formName].resetFields();
                  this.codeData = Object.assign({},defaultCodeData);
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
        this.codeData = Object.assign({},defaultCodeData);
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


