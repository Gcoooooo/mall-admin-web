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
          查询
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>

      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="120px">
          <el-form-item label="活动ID：">
            <el-input style="width: 192px" v-model="listQuery.activityId" placeholder="活动ID"></el-input>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input style="width: 192px" v-model="listQuery.activityTitle" placeholder="活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select v-model="listQuery.activityStatusCode" placeholder="全部" clearable>
              <el-option
                v-for="item in activityStatusCode"
                :key="item.value"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </div>
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>活动列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        新建
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="50" align="center">
          <template slot-scope="scope">{{scope.row.activityId}}</template>
        </el-table-column>
        <el-table-column label="状态" width="70" align="center">
          <template slot-scope="scope">{{scope.row.activityStatusDescription}}</template>
        </el-table-column>
        <el-table-column label="活动标题" width="200" align="center">
          <template slot-scope="scope">{{scope.row.activityTitle}}</template>
        </el-table-column>
        <el-table-column label="活动时间" width="230" align="center">
          <template slot-scope="scope">
          <p>开始时间：{{scope.row.startTime}}</p>
          <p>结束时间：{{scope.row.endTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="网页页数" width="50" align="center">
          <template slot-scope="scope">{{scope.row.pageCount}}</template>
        </el-table-column>
        <el-table-column label="模板列表" width="200" align="center">
          <template slot-scope="scope">{{scope.row.templateList}}</template>
        </el-table-column>
        <el-table-column label="活动链接" width="290" align="center">
          <template slot-scope="scope">https://test.wechatvr.org/zuul/hotlink-user/activity?activityId={{scope.row.activityId}}</template>
        </el-table-column>

        <el-table-column label="操作" width="115" align="center">
          <template slot-scope="scope">
            <p>

              <el-form :inline="true" :model="statisticByDayslistQuery" size="small" label-width="100px">
                <el-form-item>
                  <el-button
                    size="mini"
                    @click="handleShowProduct(scope.$index, scope.row)">编辑
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">取消
                  </el-button>
                </el-form-item>
              </el-form>

              <!--<el-button-->
                <!--size="mini"-->
                <!--@click="handleShowProduct(scope.$index, scope.row)">编辑-->
              <!--</el-button>-->
              <!--<el-button-->
                <!--size="mini"-->
                <!--type="danger"-->
                <!--@click="handleDelete(scope.$index, scope.row)">取消-->
              <!--</el-button>-->
            </p>
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNumber"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {
    fetchList,
    updateDeleteStatus,
    updateNewStatus,
    updateRecommendStatus,
    updatePublishStatus
  } from '@/api/product'
  import {fetchList as fetchSkuStockList,update as updateSkuStockList} from '@/api/skuStock'
  import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchActivityList,cancleActivity} from '@/api/hotlink_resource'

  const defaultListQuery = {
    keyword: null,
    activityId: null,
    activityTitle: null,
    pageNumber: 1,
    pageSize: 10,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo:{
          dialogVisible:false,
          productId:null,
          productSn:'',
          productAttributeCategoryId:null,
          stockList:[],
          productAttr:[],
          keyword:null
        },
        operates: [
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        activityStatusCode: [{
          value: 1,
          code: "PREPARING",
          label: '测试中'
        }, {
          value: 2,
          code: "ONGOING",
          label: '活动中'
        }, {
          value: 3,
          code: "FINISHED",
          label: '已结束'
        }, {
          value: 4,
          code: "CANCELLED",
          label: '已取消'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }]
      }
    },
    created() {
      // this.getList();
      this.getActivityList();
      //this.getBrandList();
      //this.getProductCateList();
    },
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }

      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      }
    },
    methods: {
      getProductSkuSp(row, index) {
        if (index === 0) {
          return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }
      },
      // getList() {
      //   this.listLoading = true;
      //   fetchList(this.listQuery).then(response => {
      //     this.listLoading = false;
      //     this.list = response.data.list;
      //     this.total = response.data.total;
      //   });
      // },
      getActivityList() {
        this.listLoading = true;
        fetchActivityList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.activityRecords;
          this.total = response.recordNumber;
        });
      },
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({label: list[i].children[j].name, value: list[i].children[j].id});
              }
            }
            this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
          }
        });
      },
      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible=true;
        this.editSkuInfo.productId=row.id;
        this.editSkuInfo.productSn=row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword=null;
        fetchSkuStockList(row.id,{keyword:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data;
        });
        fetchProductAttrList(row.productAttributeCategoryId,{type:0}).then(response=>{
          this.editSkuInfo.productAttr=response.data.list;
        });
      },
      handleSearchEditSku(){
        fetchSkuStockList(this.editSkuInfo.productId,{keyword:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data;
        });
      },
      handleEditSkuConfirm(){
        if(this.editSkuInfo.stockList==null||this.editSkuInfo.stockList.length<=0){
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          updateSkuStockList(this.editSkuInfo.productId,this.editSkuInfo.stockList).then(response=>{
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible=false;
          });
        });
      },
      handleSearchList() {
        this.listQuery.pageNumber = 1;
        this.getActivityList();
      },
      handleAddProduct() {
        this.$router.push({path:'/pms/addProduct'});
      },
      handleBatchOperate() {
        if(this.operateType==null){
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的商品',
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
          switch (this.operateType) {
            case this.operates[0].value:
              this.updatePublishStatus(1,ids);
              break;
            case this.operates[1].value:
              this.updatePublishStatus(0,ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1,ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0,ids);
              break;
            case this.operates[4].value:
              this.updateNewStatus(1,ids);
              break;
            case this.operates[5].value:
              this.updateNewStatus(0,ids);
              break;
            case this.operates[6].value:
              break;
            case this.operates[7].value:
              this.updateDeleteStatus(1,ids);
              break;
            default:
              break;
          }
          this.getList();
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNumber = 1;
        this.listQuery.pageSize = val;
        this.getActivityList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNumber = val;
        this.getActivityList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updatePublishStatus(row.publishStatus, ids);
      },
      handleNewStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateNewStatus(row.newStatus, ids);
      },
      handleRecommendStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateRecommendStatus(row.recommandStatus, ids);
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row){
        this.$confirm('是否要取消该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log("activityStatusDescription:", row.activityStatusDescription)
          if(row.activityStatusDescription == '测试中') {
            cancleActivity(row.activityId).then(response => {
              this.$message({
                type: 'success',
                message: '取消成功'
              });
            });
            //location.reload();
          } else {
            this.$alert('仅可取消测试中的活动','取消失败', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: '取消失败'
                });
              }
            });
          }
          // let ids = [];
          // ids.push(row.id);
          // this.updateDeleteStatus(1,ids);
        });
      },
      handleUpdateProduct(index,row){
        console.log("传入的活动ID", row.activityId);
        this.$router.push({path:'/pms/updateProduct',query:{id:row.activityId}});
      },
      handleShowProduct(index,row){
        console.log("handleShowProduct",row);
      },
      handleShowVerifyDetail(index,row){
        console.log("handleShowVerifyDetail",row);
      },
      handleShowLog(index,row){
        console.log("handleShowLog",row);
      },
      updatePublishStatus(publishStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('publishStatus', publishStatus);
        updatePublishStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateNewStatus(newStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('newStatus', newStatus);
        updateNewStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateRecommendStatus(recommendStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', recommendStatus);
        updateRecommendStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }
    }
  }
</script>
<style></style>


