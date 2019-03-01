<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="类型代码：">
            <el-input v-model="listQuery.typeCode" class="input-width" placeholder="类型代码"></el-input>
          </el-form-item>
          <el-form-item label="类型中文名称：">
            <el-input v-model="listQuery.typeCName" class="input-width" placeholder="类型中文名称"></el-input>
          </el-form-item>
          <el-form-item label="是否有效：">
            <el-select v-model="listQuery.validStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddType()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="类型代码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.typeCode}}</template>
        </el-table-column>
        <el-table-column label="类型中文名称" align="center">
          <template slot-scope="scope">{{scope.row.typeCName}}</template>
        </el-table-column>
        <el-table-column label="类型英文名称" width="120" align="center">
          <template slot-scope="scope">{{scope.row.typeEName}}</template>
        </el-table-column>
        <el-table-column label="代码明细" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getCodeList(scope.$index, scope.row)">详细列表
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否有效" width="120" align="center">
          <template slot-scope="scope">{{scope.row.validStatus | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,20,30]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="umsTypeForm" :model="typeData" :rules="rules" label-width="120px">
        <el-form-item label="类型代码" prop="typeCode">
          <el-input v-model="typeData.typeCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型中文名称" prop="typeCName">
          <el-input v-model="typeData.typeCName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型英文名称">
          <el-input v-model="typeData.typeEName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-select v-model="typeData.validStatus">
            <el-option
              v-for="type in statusOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            class="input-width"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="typeData.remark" auto-complete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('umsTypeForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  import {fetchList,deleteType,createType,updateType} from '@/api/code'

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    typeCode: null,
    validStatus: null,
    typeCName: null
  };
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
  export default {
    name: "TypeList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        statusOptions: Object.assign({}, defaultStatusOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        typeData:{
          typeCode: '',
          typeCName: '',
          typeEName: '',
          validStatus: 1,
          remark: '',
          id: null
        },
        dialogVisible: false,
        dialogTitle: '',
        rules: {
          typeCode: [
            {required: true, message: '请输入类型代码', trigger: 'blur' },
            {min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur'}
          ],
          typeCName: [
            {required: true, message: '请输入类型中文名称', trigger: 'blur' },
            {min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatStatus(value) {
        if (value === 1) {
          return '是';
        } else {
          return '否';
        }
      }
    },
    methods: {
      //初始化查询列表信息
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      //条件查询
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //增加
      handleAddType() {
        this.dialogVisible = true;
        this.dialogTitle = "添加类型配置";
      },
      //增加-确认按钮
      handleConfirm(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = _this.typeData;
            if(_this.dialogTitle==="添加类型配置"){
              createType(data).then(response=>{
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration:1000
                });
                _this.dialogVisible = false;
                _this.getList();
              });
            }else{
              updateType(this.typeData.id,data).then(response=>{
                _this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration:1000
                });
                _this.dialogVisible = false;
                _this.getList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleUpdate(index,row){
        this.dialogVisible = true;
        this.dialogTitle = "编辑类型配置";
        this.typeData.typeCode = row.typeCode;
        this.typeData.typeCName = row.typeCName;
        this.typeData.typeCName = row.typeCName;
        this.typeData.validStatus = row.validStatus;
        this.typeData.remark = row.remark;
        this.typeData.id = row.id;
      },
      //删除按钮
      handleDelete(index, row){
        this.deleteTypes(row.id);
      },
      //删除操作
      deleteTypes(ids){
        this.$confirm('是否要删除该代码类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
          deleteType(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      },
      //详细信息
      getCodeList(index, row){
        sessionStorage.setItem('typeCode',row.typeCode);
        this.$router.push({path: '/ums/codeList',query:{typeCode:row.typeCode}})
      }
    }
  }
</script>
<style></style>


