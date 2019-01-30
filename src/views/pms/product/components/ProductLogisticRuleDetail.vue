<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productRuleForm" label-width="120px" style="width: 600px" size="small">

      <el-form-item>
        <el-table :data="value.productLogisticRuleParamList"
                  style="width: 100%" border>
          <el-table-column
            label="物流"
            align="center"
            width="100">
            <template slot-scope="scope">
              中环
              <el-input v-show="false" v-model="value.logisticType"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物流规则"
            align="center"
            width="400">
            <template slot-scope="scope">
              <el-cascader v-model="selectProductLogicRuleValue"
                           :options="zhRuleList"
                           @change="handleBrandRuleChange">

              </el-cascader>
            </template>
            <el-input v-show="false" v-model="value.logisticType"></el-input>
          </el-table-column>
          <!--<el-table-column
            label="物流小类规则"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-cascader v-model="scope.row.ruleBrandType"
                  :options="zhRuleList"
                  expand-trigger="hover"
                   :show-all-levels="false">

              </el-cascader>
            </template>
          </el-table-column>-->
          <!--<el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>-->
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品属性</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import {fetchList as fetchRuleList} from '@/api/logisticRule'

  export default {
    name: "ProductLogisticRuleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var _this = this;
      return {
        zhRuleList: [],
        hasEditCreated: false,
        selectProductLogicRuleValue: [],
        productLogisticRuleParamList: []
      };
    },
    created() {
      this.getProductRuleLadderList();
      this.getZhRuleList();
    },
    watch: {
      productId: function (newValue) {
        if (!this.isEdit) return;
        if (this.hasEditCreated) return;
        if (newValue === undefined || newValue == null || newValue === 0) return;
        if (this.value.productLogisticRuleParamList.length >= 0) {
          let values = this.value.productLogisticRuleParamList;
          this.selectProductLogicRuleValue.push(values[0].ruleType, values[0].ruleBrandType);
        }
      }
    },
    computed: {
      productId: function () {
        return this.value.id;
      }
    },
    methods: {
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      getZhRuleList() {
        fetchRuleList({"logisticType": 1}).then(response => {
          let list = response.data.list;
          for (let i = 0; i < list.length; i++) {
            var childs = [];
            var lists = list[i].brands;
            lists.forEach(element => {
              childs.push({
                label: element.ruleName,
                value: element.ruleType
              });
            });
            this.zhRuleList.push({
              label: list[i].ruleName,
              value: list[i].ruleType,
              children: childs
            });
          }
        });
      },
      getProductRuleLadderList() {
        let rules = [];
        if (this.isEdit) {
        } else {
          rules.push({logisticType: '1'})
          this.value.productLogisticRuleParamList = rules;
        }
      },
      handleBrandRuleChange(value) {
        // console.log(value)
        this.value.productLogisticRuleParamList = []
        this.value.productLogisticRuleParamList.push({logisticType: '1', ruleType: value[0], ruleBrandType: value[1]})
        /*this.zhBrandRuleList=[];
        var list = [];
        var zhL = this.zhRuleList;
        for (let i = 0; i < zhL.length; i++) {
          if (zhL[i].value===value) {
            list = zhL[i].brands;
            break;
          }
        }
        for (let i = 0; i < list.length; i++) {
          this.zhBrandRuleList.push({
              label: list[i].ruleName,
              value: list[i].ruleType
            });
        }*/
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleFinishCommit() {
        this.$emit('finishCommit', this.isEdit);
      }
    }
  }
</script>

<style scoped>

</style>
