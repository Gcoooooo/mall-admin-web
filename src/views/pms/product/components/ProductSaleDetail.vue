<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 800px;" size="small">
      <!--<el-form-item label="赠送积分：">
        <el-input v-model="value.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="赠送成长值：">
        <el-input v-model="value.giftGrowth"></el-input>
      </el-form-item>
      <el-form-item label="积分购买限制：">
        <el-input v-model="value.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="预告商品：">
        <el-switch
          v-model="value.previewStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.publishStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="value.newStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="value.recommandStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详细页标题：">
        <el-input v-model="value.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="value.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="商品关键字：">
        <el-input v-model="value.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="value.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      -->

      <el-collapse v-model="activeNames">
        <div class="selectedTemplate" v-for="(item, index) in value.templateInfo" :key="index" >
          <el-collapse-item :title="'第' + item.pageNumber + '页'">
            <el-tabs type="card" >
              <el-tab-pane>
                <span slot="label"><i class="el-icon-picture-outline"></i> 静态资源定制</span>

                <div class="selectedTemplateConfigInfo" v-for="(item2, index2) in templateConfig" :key="index2">

                  <el-form-item v-if="item2.id === item.templateId" label="模板示意图：">
                    <img :src="item2.picUrl" style="height:400px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
                  </el-form-item>

                  <el-card class="box-card" v-if="item2.id === item.templateId">
                    <div slot="header" class="layout-title" style="font-size:large;">
                      <span><i class="el-icon-edit-outline"></i> 普通资源配置</span>
                    </div>
                    <div class="resourceInSelectedTemplate" v-for="(item3, index3) in item2.list" :key="index3" >
                      <el-form-item v-if="item2.id === item.templateId && item3 != '' && item3 != 2 && item3 != 4" :label="(index3 + 1) + '号资源：'">
                        <el-upload
                          class="upload-demo"
                          :action="oss.ossHostname"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :before-remove="beforeRemove"
                          :on-success="handleSuccess"
                          multiple
                          :limit="1"
                          :before-upload="beforeUpload"
                          :on-exceed="handleExceed"
                          :file-list="fileList"
                          :http-request="((file) => {upload(file, item2.basicResourceCount, item, index3, item3)})">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip"><i class="el-icon-info"></i> {{item2.descriptions[index3]}}</div>
                        </el-upload>
                      </el-form-item>

                      <el-form-item v-if="item2.id === item.templateId && item3 != '' && item3 == 2" :label="(index3 + 1) + '号资源：'">
                        <el-input
                          v-model="value.templateInfo[item.pageNumber - 1].basicResource[index3].detil"
                          :placeholder="item2.descriptions[index3]"
                          @change="((val) => {handleInputChange(val, item2.basicResourceCount, item, index3, item3)})">
                        </el-input>
                      </el-form-item>

                      <el-form-item v-if="item2.id === item.templateId && item3 != '' && item3 == 4" :label="(index3 + 1) + '号资源：'">
                        <el-input
                          :autoSize="true"
                          type="textarea"
                          v-model="value.templateInfo[item.pageNumber - 1].basicResource[index3].detil"
                          :placeholder="item2.descriptions[index3]"
                          @change="((val) => {handleInputChange(val, item2.basicResourceCount, item, index3, item3)})">
                        </el-input>
                      </el-form-item>
                    </div>
                  </el-card>

                  <el-card class="box-card" v-if="item2.id === item.templateId && item2.hasAnimation == 'Y'" style="margin-top: 15px">
                    <div slot="header" class="layout-title" style="font-size:large;">
                      <span><i class="el-icon-edit-outline"></i> 动画资源配置</span>
                    </div>
                    <el-form-item label="动画模型文件：">
                      <el-upload
                        class="upload-demo"
                        :action="oss.ossHostname"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :on-success="handleSuccess"
                        multiple
                        :limit="1"
                        :before-upload="beforeUpload"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        :http-request="((file) => {uploadAnimationModel(file, item.animationResource)})">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip"><i class="el-icon-info"></i> 仅支持fbx和dae格式</div>
                      </el-upload>
                    </el-form-item>

                    <el-form-item label="动画皮肤图片：">
                      <el-upload
                        class="upload-demo"
                        :action="oss.ossHostname"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :on-success="handleSuccess"
                        multiple
                        :limit="1"
                        :before-upload="beforeUpload"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        :http-request="((file) => {uploadAnimationPicUrl(file, item.animationResource)})">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip"><i class="el-icon-info"></i> 仅支持jpg和png格式</div>
                      </el-upload>
                    </el-form-item>

                    <el-form-item label="动画亮度：">
                      <el-slider
                        v-model="item.animationResource.brightness"
                        :step="10"
                        :max="50"
                        show-stops>
                      </el-slider>
                    </el-form-item>

                    <el-form-item  label="动画播放时长：">
                      <el-input v-model="item.animationResource.duration"></el-input>
                    </el-form-item>

                    <el-form-item label="是否可跳过：">
                      <el-radio v-model="item.animationResource.isSkippable" label="Y">是</el-radio>
                      <el-radio v-model="item.animationResource.isSkippable" label="N">否</el-radio>
                    </el-form-item>
                  </el-card>
                </div>
              </el-tab-pane>

              <el-tab-pane>
                <span slot="label"><i class="el-icon-edit"></i> 业务功能定制</span>
                <div v-for="(item2, index2) in templateConfig" :key="index2">
                  <div class="functions" v-for="(item3, index3) in item2.functions" :key="index3">
                    <div class="functions-lottery" v-if="item2.id === item.templateId && item3 != '' && item3 == 'lottery'">
                      <el-card>
                        <div slot="header" class="layout-title" style="font-size:large;">
                          <span><i class="el-icon-edit-outline"></i> 抽奖功能配置</span>
                        </div>

                        <el-form-item label="奖品设置：">
                          <el-table :data="value.lotteryInfo.lotteryPrizeInfos" border>
                            <el-table-column
                              label="名称"
                              align="center"
                              width="120">
                              <template slot-scope="scope">
                                <el-input v-model="scope.row.name"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="数量"
                              align="center"
                              width="120">
                              <template slot-scope="scope">
                                <el-input v-model="scope.row.amount"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="价值"
                              align="center"
                              width="120">
                              <template slot-scope="scope">
                                <el-input v-model="scope.row.value"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="显示位置"
                              align="center"
                              width="120">
                              <template slot-scope="scope">
                                <el-input v-model="scope.row.order"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              label="上传奖品图片"
                              align="center"
                              width="120">
                              <template slot-scope="scope">
                                <el-upload
                                  class="upload-demo"
                                  :action="oss.ossHostname"
                                  :on-preview="handlePreview"
                                  :on-remove="handleRemove"
                                  :before-remove="beforeRemove"
                                  :on-success="handleSuccess"
                                  multiple
                                  :limit="1"
                                  :before-upload="beforeUpload"
                                  :on-exceed="handleExceed"
                                  :file-list="fileList"
                                  :http-request="((file) => {uploadPrizePic(file, scope.row)})">
                                  <el-button size="small" type="primary">上传奖品图片</el-button>
                                </el-upload>
                              </template>
                            </el-table-column>
                            <el-table-column
                              align="center"
                              label="操作">
                              <template slot-scope="scope">
                                <el-button type="text" @click="handleAddPrize(scope.$index, scope.row)">添加</el-button>
                                <el-button type="text" @click="handleRemovePrize(scope.$index, scope.row)">删除</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-form-item>

                        <el-form-item label="抽奖次数：">
                          <el-input-number v-model="value.lotteryInfo.userChance" :min="0" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="中奖次数：">
                          <el-input-number v-model="value.lotteryInfo.winChance" :min="0" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="有效分享次数：">
                          <el-input-number v-model="value.lotteryInfo.shareChance" :min="0" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="分享增加次数：">
                          <el-input-number v-model="value.lotteryInfo.shareAddCount" :min="0" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="抽奖规则：">
                          <el-input
                            :autoSize="true"
                            v-model="value.lotteryInfo.lotteryRule"
                            type="textarea"
                            placeholder="请输入内容">
                          </el-input>
                        </el-form-item>
                      </el-card>
                    </div>

                    <div class="functions-webar" v-if="item2.id === item.templateId && item3 != '' && item3 == 'webar'">
                      <el-card>
                        <div slot="header" class="layout-title" style="font-size:large;">
                          <span><i class="el-icon-edit-outline"></i> Web AR功能配置</span>
                        </div>

                        <div class="functions-webar" v-for="(item4, index4) in item.webarInfo">
                          <el-form-item label="上传原图像">
                            <el-upload
                              class="upload-demo"
                              :action="oss.ossHostname"
                              :on-preview="handlePreview"
                              :on-remove="handleRemove"
                              :before-remove="beforeRemove"
                              :on-success="handleSuccess"
                              multiple
                              :limit="1"
                              :before-upload="beforeUpload"
                              :on-exceed="handleExceed"
                              :file-list="fileList"
                              :http-request="((file) => {uploadOriginalPriceUrl(file, item4, item.pageNumber)})">
                              <el-button size="small" type="primary">点击上传</el-button>
                              <div slot="tip" class="el-upload__tip"><i class="el-icon-info"></i> 上传用于识别和匹配的原图像，仅支持jpg格式</div>
                            </el-upload>
                            <el-button  icon="el-icon-close" @click="deleteOriginalPic(item.webarInfo, index4)" >删除</el-button>
                          </el-form-item>
                        </div>

                        <el-form-item>
                          <el-button type="text" class="addUser" icon="el-icon-plus" @click="addOriginalPic(item.webarInfo)">添加更多原图像</el-button>
                        </el-form-item>

                      </el-card>
                    </div>
                  </div>
                  <div>

                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
        </div>
      </el-collapse>

      <!--<el-form-item label="选择优惠方式：">
       <el-radio-group v-model="value.promotionType" size="small">
         <el-radio-button :label="0">无优惠</el-radio-button>
         <el-radio-button :label="1">特惠促销</el-radio-button>
         <el-radio-button :label="2">会员价格</el-radio-button>
         <el-radio-button :label="3">阶梯价格</el-radio-button>
         <el-radio-button :label="4">满减价格</el-radio-button>
       </el-radio-group>
     </el-form-item>
     <el-form-item v-show="value.promotionType===1">
       <div>
         开始时间：
         <el-date-picker
           v-model="value.promotionStartTime"
           value-format="timestamp"
           type="datetime"
           :picker-options="pickerOptions1"
           placeholder="选择开始时间">
         </el-date-picker>
       </div>
       <div class="littleMargin">
         结束时间：
         <el-date-picker
           v-model="value.promotionEndTime"
           value-format="timestamp"
           type="datetime"
           :picker-options="pickerOptions1"
           placeholder="选择结束时间">
         </el-date-picker>
       </div>
       <div class="littleMargin">
         促销价格：
         <el-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格"></el-input>
       </div>

     </el-form-item>
     <el-form-item v-show="value.promotionType===2">
       <div v-for="(item, index) in value.memberPriceList" :class="{littleMargin:index!==0}">
         {{item.memberLevelName}}：
         <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
       </div>
     </el-form-item>
     <el-form-item v-show="value.promotionType===3">
       <el-table :data="value.productLadderList"
                 style="width: 80%" border>
         <el-table-column
           label="数量"
           align="center"
           width="120">
           <template slot-scope="scope">
             <el-input v-model="scope.row.count"></el-input>
           </template>
         </el-table-column>
         <el-table-column
           label="折扣"
           align="center"
           width="120">
           <template slot-scope="scope">
             <el-input v-model="scope.row.discount"></el-input>
           </template>
         </el-table-column>
         <el-table-column
           align="center"
           label="操作">
           <template slot-scope="scope">
             <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
             <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-form-item>
     <el-form-item v-show="value.promotionType===4">
       <el-table :data="value.productFullReductionList"
                 style="width: 80%" border>
         <el-table-column
           label="满"
           align="center"
           width="120">
           <template slot-scope="scope">
             <el-input v-model="scope.row.fullPrice"></el-input>
           </template>
         </el-table-column>
         <el-table-column
           label="立减"
           align="center"
           width="120">
           <template slot-scope="scope">
             <el-input v-model="scope.row.reducePrice"></el-input>
           </template>
         </el-table-column>
         <el-table-column
           align="center"
           label="操作">
           <template slot-scope="scope">
             <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
             <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-form-item>-->

      <el-form-item style="text-align: center;margin: 10px;">
        <el-button size="medium" @click="handlePrev">上一步</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import {fetchList as fetchMemberLevelList} from '@/api/memberLevel'
  import {fetchTemplateList, fetchPreuploadInfo, uploadToOss} from '@/api/hotlink_resource'

  export default {
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      },
      maxsize: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        activeNames: ['1'],
        fileList: [],
        templateConfig: [],
        oss: {
          accessKeyId: "",
          signature: "=",
          policy: "",
          ossHostname: "",
          objectKey: "",
          url: ""
        },
        //日期选择器配置
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        }
      }
    },
    created() {
      // if (this.isEdit) {
      //   // this.handleEditCreated();
      // } else {
      //   fetchMemberLevelList({defaultStatus: 0}).then(response => {
      //     let memberPriceList = [];
      //     for (let i = 0; i < response.data.length; i++) {
      //       let item = response.data[i];
      //       memberPriceList.push({memberLevelId: item.id, memberLevelName: item.name})
      //     }
      //     this.value.memberPriceList = memberPriceList;
      //   });
      // }
      this.getRecourceList();
      console.log(this.templateConfig);
    },
    computed: {
      //选中的服务保证
      selectServiceList: {
        get() {
          let list = [];
          if (this.value.serviceIds === undefined || this.value.serviceIds == null || this.value.serviceIds === '') return list;
          let ids = this.value.serviceIds.split(',');
          for (let i = 0; i < ids.length; i++) {
            list.push(Number(ids[i]));
          }
          return list;
        },
        set(newValue) {
          let serviceIds = '';
          if (newValue != null && newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
              serviceIds += newValue[i] + ',';
            }
            if (serviceIds.endsWith(',')) {
              serviceIds = serviceIds.substr(0, serviceIds.length - 1)
            }
            this.value.serviceIds = serviceIds;
          } else {
            this.value.serviceIds = null;
          }
        }
      }
    },
    methods: {
      getRecourceList() {
        fetchTemplateList({pageNum: 1, pageSize: 100}).then(response => {
          this.templateConfig = [];
          let templates = response.data.templates;
          for (let i = 0; i < templates.length; i++) {
            this.templateConfig.push(
              {
                id: templates[i].id,
                list: templates[i].resourceList.split(";"),
                descriptions: templates[i].resourceDescription.split(";"),
                functions: templates[i].functionList.split(";"),
                picUrl: templates[i].picUrl,
                hasAnimation: templates[i].hasAnimation,
                basicResourceCount: templates[i].resourceCount
              });
            console.log(this.templateConfig.picUrl);
          }
          console.log(this.templateConfig);
        });
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleSuccess(file) {
        console.log("file！！！！",file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleEditCreated() {
        let ids = this.value.serviceIds.split(',');
        console.log('handleEditCreated', ids);
        for (let i = 0; i < ids.length; i++) {
          this.selectServiceList.push(Number(ids[i]));
        }
      },
      handleRemoveProductLadder(index, row) {
        let productLadderList = this.value.productLadderList;
        if (productLadderList.length === 1) {
          productLadderList.pop();
          productLadderList.push({
            count: 0,
            discount: 0,
            price: 0
          })
        } else {
          productLadderList.splice(index, 1);
        }
      },
      handleAddProductLadder(index, row) {
        let productLadderList = this.value.productLadderList;
        if (productLadderList.length < 3) {
          productLadderList.push({
            count: 0,
            discount: 0,
            price: 0
          })
        } else {
          this.$message({
            message: '最多只能添加三条',
            type: 'warning'
          });
        }
      },
      handleRemovePrize(index, row) {
        let lotteryInfo = this.value.lotteryInfo;
        if (lotteryInfo.prizes.length === 1) {
          lotteryInfo.lotteryPrizeInfos.pop();
          lotteryInfo.lotteryPrizeInfos.push({
            name:'', amount:'', value: '', prizePicUrl: '', order: ''
          })
        } else {
          lotteryInfo.lotteryPrizeInfos.splice(index, 1);
        }
      },
      handleAddPrize(index, row) {
        let lotteryInfo = this.value.lotteryInfo;
        console.log(this.value.lotteryInfo.prizes);
        if (lotteryInfo.lotteryPrizeInfos.length < 7) {
          lotteryInfo.lotteryPrizeInfos.push({
            name:'', amount:0, value: 0, prizePicUrl: '', order: 0
          })
        } else {
          this.$message({
            message: '最多只能添加7个奖品',
            type: 'warning'
          });
        }
      },
      handleRemoveFullReduction(index, row) {
        let fullReductionList = this.value.productFullReductionList;
        if (fullReductionList.length === 1) {
          fullReductionList.pop();
          fullReductionList.push({
            fullPrice: 0,
            reducePrice: 0
          });
        } else {
          fullReductionList.splice(index, 1);
        }
      },
      handleAddFullReduction(index, row) {
        let fullReductionList = this.value.productFullReductionList;
        if (fullReductionList.length < 3) {
          fullReductionList.push({
            fullPrice: 0,
            reducePrice: 0
          });
        } else {
          this.$message({
            message: '最多只能添加三条',
            type: 'warning'
          });
        }
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep')
      },
      upload(param, basicResourceCount, selectedTemplate, order, basicResourceType) {      // 图文上传
        let Base64 = require('js-base64').Base64;
        let axios = require('axios');

        let file = param.file;
        console.log("start upload");

        let sendData = {category:'', suffix: ''};
        let index = file.name.indexOf('.');
        let suffix = file.name.substr(index+1);

        sendData.category = "animation";
        sendData.suffix = suffix;
        console.log("sendData",sendData);

        fetchPreuploadInfo(sendData).then(reponse => {
          console.log("fetchPreuploadInfoResponse", reponse);
          this.oss.ossHostname = reponse.data.ossHostname;

          var ossData = new FormData();
          ossData.append("name", file.name);
          ossData.append("key",reponse.data.objectKey);
          ossData.append("policy", Base64.encode(reponse.data.policy));
          ossData.append("OSSAccessKeyId", reponse.data.accessKeyId);
          //阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
          ossData.append("success_action_status", 201);
          ossData.append("signature", reponse.data.signature);
          ossData.append("file", file);
          console.log("ossData",ossData);

          axios.post(reponse.data.ossHostname, ossData).then(response => {
            this.$message({
              type: 'success',
              message: '上传成功',
              duration:1000
            });
            console.log(response.data);

            selectedTemplate.basicResourceCount = basicResourceCount;
            selectedTemplate.basicResource[order].type = basicResourceType;
            selectedTemplate.basicResource[order].order = order;
            selectedTemplate.basicResource[order].detil = reponse.data.url.replace("content-local","test");

            console.log("已选模板", this.value.templateInfo);
          }).catch(error => {
            this.$message({
              type: 'error',
              message: '上传失败',
              duration:1000
            });
            console.log("uploadToOssError:", error);
          });
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '获取上传配置信息失败',
            duration:1000
          });
          console.log(error, "fetchPreuploadInfo执行错误");
        });
      },
      uploadPrizePic(param, row) {
        let Base64 = require('js-base64').Base64;
        let axios = require('axios');

        let file = param.file;
        console.log("start upload");

        let sendData = {category:'', suffix: ''};
        let index = file.name.indexOf('.');
        let suffix = file.name.substr(index+1);

        sendData.category = "animation";
        sendData.suffix = suffix;
        console.log("sendData",sendData);

        fetchPreuploadInfo(sendData).then(reponse => {
          console.log("fetchPreuploadInfoResponse", reponse);
          this.oss.ossHostname = reponse.data.ossHostname;

          var ossData = new FormData();
          ossData.append("name", file.name);
          ossData.append("key",reponse.data.objectKey);
          ossData.append("policy", Base64.encode(reponse.data.policy));
          ossData.append("OSSAccessKeyId", reponse.data.accessKeyId);
          //阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
          ossData.append("success_action_status", 201);
          ossData.append("signature", reponse.data.signature);
          ossData.append("file", file);
          console.log("ossData",ossData);

          axios.post(reponse.data.ossHostname, ossData).then(response => {
            this.$message({
              type: 'success',
              message: '上传成功',
              duration:1000
            });

            row.prizePicUrl = reponse.data.url.replace("content-local","test");
          }).catch(error => {
            this.$message({
              type: 'error',
              message: '上传失败',
              duration:1000
            });
            console.log("uploadToOssError:", error);
          });
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '获取上传配置信息失败',
            duration:1000
          });
          console.log(error, "fetchPreuploadInfo执行错误");
        });
      },
      uploadAnimationModel(param, animationResource) {
        let Base64 = require('js-base64').Base64;
        let axios = require('axios');

        let file = param.file;
        console.log("start upload");

        let sendData = {category:'', suffix: ''};
        let index = file.name.indexOf('.');
        let suffix = file.name.substr(index+1);

        sendData.category = "animation";
        sendData.suffix = suffix;
        console.log("sendData",sendData);

        fetchPreuploadInfo(sendData).then(reponse => {
          console.log("fetchPreuploadInfoResponse", reponse);
          this.oss.ossHostname = reponse.data.ossHostname;

          var ossData = new FormData();
          ossData.append("name", file.name);
          ossData.append("key",reponse.data.objectKey);
          ossData.append("policy", Base64.encode(reponse.data.policy));
          ossData.append("OSSAccessKeyId", reponse.data.accessKeyId);
          //阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
          ossData.append("success_action_status", 201);
          ossData.append("signature", reponse.data.signature);
          ossData.append("file", file);
          console.log("ossData",ossData);

          axios.post(reponse.data.ossHostname, ossData).then(response => {
            this.$message({
              type: 'success',
              message: '上传成功',
              duration:1000
            });

            animationResource.modelUrl = reponse.data.url.replace("content-local","test");
          }).catch(error => {
            this.$message({
              type: 'error',
              message: '上传失败',
              duration:1000
            });
            console.log("uploadToOssError:", error);
          });
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '获取上传配置信息失败',
            duration:1000
          });
          console.log(error, "fetchPreuploadInfo执行错误");
        });
      },
      uploadOriginalPriceUrl(param, webarInfo, pageNumber) {
        let Base64 = require('js-base64').Base64;
        let axios = require('axios');

        let file = param.file;
        console.log("start upload");

        let sendData = {category:'', suffix: ''};
        let index = file.name.indexOf('.');
        let suffix = file.name.substr(index+1);

        sendData.category = "animation";
        sendData.suffix = suffix;
        console.log("sendData",sendData);

        fetchPreuploadInfo(sendData).then(reponse => {
          console.log("fetchPreuploadInfoResponse", reponse);
          this.oss.ossHostname = reponse.data.ossHostname;

          var ossData = new FormData();
          ossData.append("name", file.name);
          ossData.append("key",reponse.data.objectKey);
          ossData.append("policy", Base64.encode(reponse.data.policy));
          ossData.append("OSSAccessKeyId", reponse.data.accessKeyId);
          //阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
          ossData.append("success_action_status", 201);
          ossData.append("signature", reponse.data.signature);
          ossData.append("file", file);
          console.log("ossData",ossData);

          axios.post(reponse.data.ossHostname, ossData).then(response => {
            this.$message({
              type: 'success',
              message: '上传成功',
              duration:1000
            });

            webarInfo.url = reponse.data.url.replace("content-local","test");
            webarInfo.samplePic = 'Base64.encode(param)';
            webarInfo.pageNumber = pageNumber;

            // var img = new Image();
            // var timestamp = new Date().getTime();
            // img.setAttribute("crossOrigin",'Anonymous')
            // img.src = reponse.data.url + '?' + timestamp;;
            // img.onload = function() {
            //   var canvas = document.createElement("canvas");
            //   canvas.width = img.width;
            //   canvas.height = img.height;
            //   var ctx = canvas.getContext("2d");
            //   ctx.drawImage(img, 0, 0, img.width, img.height);
            //   var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            //   var dataURL = canvas.toDataURL("image/" + ext);
            //
            //   webarInfo.samplePic = dataURL;
            //
            //   console.log("base64", webarInfo.samplePic);
            // }

            console.log("samplePic", webarInfo.samplePic)
          }).catch(error => {
            this.$message({
              type: 'error',
              message: '上传失败',
              duration:1000
            });
            console.log("uploadToOssError:", error);
          });
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '获取上传配置信息失败',
            duration:1000
          });
          console.log(error, "fetchPreuploadInfo执行错误");
        });
      },
      uploadAnimationPicUrl(param, animationResource) {
        let Base64 = require('js-base64').Base64;
        let axios = require('axios');

        let file = param.file;
        console.log("start upload");

        let sendData = {category:'', suffix: ''};
        let index = file.name.indexOf('.');
        let suffix = file.name.substr(index+1);

        sendData.category = "animation";
        sendData.suffix = suffix;
        console.log("sendData",sendData);

        fetchPreuploadInfo(sendData).then(reponse => {
          console.log("fetchPreuploadInfoResponse", reponse);
          this.oss.ossHostname = reponse.data.ossHostname;

          var ossData = new FormData();
          ossData.append("name", file.name);
          ossData.append("key",reponse.data.objectKey);
          ossData.append("policy", Base64.encode(reponse.data.policy));
          ossData.append("OSSAccessKeyId", reponse.data.accessKeyId);
          //阿里云正常返回204，然后返回信息是空的，想看到返回信息强制让它返回201，返回一个xml文件可以提取有用的信息
          ossData.append("success_action_status", 201);
          ossData.append("signature", reponse.data.signature);
          ossData.append("file", file);
          console.log("ossData",ossData);

          axios.post(reponse.data.ossHostname, ossData).then(response => {
            this.$message({
              type: 'success',
              message: '上传成功',
              duration:1000
            });

            animationResource.picUrl = reponse.data.url.replace("content-local","test");
          }).catch(error => {
            this.$message({
              type: 'error',
              message: '上传失败',
              duration:1000
            });
            console.log("uploadToOssError:", error);
          });
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '获取上传配置信息失败',
            duration:1000
          });
          console.log(error, "fetchPreuploadInfo执行错误");
        });
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isRightSize = file.size / 1024 / 1024 < this.maxsize
        // if (!isJPG && !isPNG) {
        //   this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        // }
        // if (!isRightSize) {
        //   this.$message.error('上传图片大小不能超过最大限制！')
        // }
        // return (isJPG || isPNG) && isRightSize
        return true;
      },
      handleInputChange(val, basicResourceCount, selectedTemplate, order, basicResourceType){
        selectedTemplate.basicResourceCount = basicResourceCount;
        selectedTemplate.basicResource[order].type = basicResourceType;
        selectedTemplate.basicResource[order].order = order;
        selectedTemplate.basicResource[order].detil = val;

        console.log("已选模板", this.value.templateInfo);
      },
      addOriginalPic(webarInfo) {
        webarInfo.push({
          samplePic: '',
          url:'',
          pageNumber:''
        });
      },
      deleteOriginalPic(webarInfo, index4) {
        if (index4 !== -1) {
          webarInfo.splice(index4, 1);
        }
        console.log("删除原图像后", webarInfo);
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }

  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }

  .grid-content {
    border-radius: 40px;
    min-height: 3px;
  }

  .bg-purple-light {
    background: #e5e9f2;
    text-align:center;
    font-size:large;
    font-weight: bold;
  }
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }
</style>
