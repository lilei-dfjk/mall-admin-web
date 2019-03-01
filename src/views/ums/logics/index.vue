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
          <el-form-item label="物流分类名称：">
            <el-input v-model="listQuery.type" class="input-width" placeholder="物流分类名称"></el-input>
          </el-form-item>
          <el-form-item label="品牌分类名称：">
            <el-input v-model="listQuery.brand" class="input-width" placeholder="品牌分类名称"></el-input>
          </el-form-item>
          <el-form-item label="是否可混装：">
            <el-select v-model="listQuery.mixStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in typeOptions"
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
        @click="handleAdd()"
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
        <el-table-column label="物流分类名称" width="120" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="商品分类" align="center">
          <template slot-scope="scope">{{scope.row.brandName}}</template>
        </el-table-column>
        <el-table-column label="数量限制" width="120" align="center">
          <template slot-scope="scope">{{scope.row.numberLimit}}</template>
        </el-table-column>
        <el-table-column label="重量限制" width="120" align="center">
          <template slot-scope="scope">{{scope.row.weightLimit}}</template>
        </el-table-column>
        <el-table-column label="价格限制" width="120" align="center">
          <template slot-scope="scope">{{scope.row.priceLimit}}</template>
        </el-table-column>
        <el-table-column label="是否可混装" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mixTypeFlag | formatMixType}}</template>
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
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作" clearable>
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
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
  </div>
</template>
<script>

  import {fetchList,deleteLogicsRule} from '@/api/logics'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 10,
    type: null,
    mixStatus: null,
    brand: null
  };
  const defaultTypeOptions = [
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
    name: "logicsList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "删除",
            value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatMixType(value) {
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
      //增加
      handleAdd() {
        this.$router.push({path:'/ums/addLogicsRule'});
      },
      handleUpdate(index,row){
        this.$router.push({path: '/ums/updateLogicsRule', query: {id: row.id}})
      },
      //批量操作
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id);
          }
          if(this.operateType===0){
            this.deleteLogicsRules(ids);
          }else{
            this.$message({
              message: '请选择操作类型',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          this.getList();
        });
      },
      //删除按钮
      handleDelete(index, row){
        this.deleteLogicsRules(row.id);
      },
      //删除操作
      deleteLogicsRules(ids){
        this.$confirm('是否要删除该物流规则?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=new URLSearchParams();
          params.append("ids",ids);
          deleteLogicsRule(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      }
    }
  }
</script>
<style></style>


