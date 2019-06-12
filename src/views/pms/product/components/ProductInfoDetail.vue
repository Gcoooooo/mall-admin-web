<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 800px" size="small">
      <!-- <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle"></el-input>
      </el-form-item>
      -->

      <el-form-item label="活动标题：" prop="title">
        <el-input v-model="value.activityBasicInfo.title" placeholder="请输入活动标题"></el-input>
      </el-form-item>

      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker
          v-model="value.activityBasicInfo.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions1"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：" prop="endTime">
        <el-date-picker
          v-model="value.activityBasicInfo.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions1"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="分享时的图片：">
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
          :http-request="upload">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"><i class="el-icon-info"></i> 仅支持png和jpg格式</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="分享标题：">
        <el-input v-model="value.activityBasicInfo.sharedTitle" placeholder="请输入活动标题"></el-input>
      </el-form-item>

      <el-form-item label="分享描述：">
        <el-input
          :autoSize="true"
          v-model="value.activityBasicInfo.sharedDescription"
          type="textarea"
          placeholder="请输入内容">
        </el-input>
      </el-form-item>

      <el-form-item label="第1页模板：" prop="templateInfo">
        <el-select
          v-model="value.templateInfo[0].templateId"
          @change="handleBrandChange"
          placeholder="请选择模板">
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>

      </el-form-item>

      <div class="templateSelection" v-for="(item, index) in templates">
        <el-form-item :label="'第' + (index+2) + '页模板：'">
          <el-select
            v-model="value.templateInfo[index+1].templateId"
            @change="handleBrandChange"
            placeholder="请选择模板">
            <el-option
              v-for="item in brandOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-button style="margin-left: 20px" icon="el-icon-close" @click="deleteRules(item, index)" >删除</el-button>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="text" class="addUser" icon="el-icon-plus" @click="addTemplate">添加更多模板</el-button>
      </el-form-item>

      <!-- <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容">
        </el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input v-model="value.productSn" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input v-model="value.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      -->
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步</el-button>
      </el-form-item>


    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {fetchTemplateList, fetchPreuploadInfo, getActivity} from '@/api/hotlink_resource'
  import {getProduct} from '@/api/product';

  export default {
    name: "ProductInfoDetail",
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
        fileList: [],
        //日期选择器配置
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        oss: {
          accessKeyId: "",
          signature: "=",
          policy: "",
          ossHostname: "",
          objectKey: "",
          url: ""
        },
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        templateConfig: [],
        brandOptions: [],
        templates: [],
        rules: {
          name: [
            {required: false, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          subTitle: [{required: false, message: '请输入商品副标题', trigger: 'blur'}],
          productCategoryId: [{required: false, message: '请选择商品分类', trigger: 'blur'}],
          templateInfo: [{required: false, message: '请选择商品品牌', trigger: 'blur'}],
          description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductCateList();
      this.getBrandList();
    },
    computed:{
      //商品的编号
      productId(){
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName= this.getCateNameById(this.value.productCategoryId);
        } else {
          this.value.productCategoryId = null;
          this.value.productCategoryName=null;
        }
      }
    },
    methods: {
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
      upload(param) {      // 图文上传
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

            this.value.activityBasicInfo.sharedPicUrl = reponse.data.url.replace("content-local","test");

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
        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        }
        if (!isRightSize) {
          this.$message.error('上传图片大小不能超过最大限制！')
        }
        return (isJPG || isPNG) && isRightSize
      },
      initData(){
        this.ruleFrom.moreNotifyObject = []
      },
      addTemplate() {
        this.templates.push({

        });

        this.value.templateInfo.push({
          templateId: '',
          pageNumber: '',
          basicResourceCount: '',
          basicResource:[],
          hasAnimation:'',
          functions:[],
          webarInfo: null,
          animationResource:{modelUrl:'', picUrl:'', brightness:'', duration:'', isSkippable:''}
        });
      },
      deleteRules(item, index) {
        this.index = this.templates.indexOf(item);
        if (index !== -1) {
          this.templates.splice(index, 1);
          this.value.templateInfo.splice(index+1, 1);
        }
        for (let i = 0; i < this.value.templateInfo.length; i++) {
          this.value.templateInfo[i].pageNumber = i+1;
        }
        console.log("删除下拉框后：", this.value.templateInfo);
      },
      //处理编辑逻辑
      handleEditCreated(){
        if(this.value.productCategoryId!=null){
          this.selectProductCateValue.push(this.value.cateParentId);
          this.selectProductCateValue.push(this.value.productCategoryId);
        }
        this.hasEditCreated=true;
      },
      getProductCateList() {
        // fetchListWithChildren().then(response => {
        //   let list = response.data;
        //   this.productCateOptions = [];
        //   for (let i = 0; i < list.length; i++) {
        //     let children = [];
        //     if (list[i].children != null && list[i].children.length > 0) {
        //       for (let j = 0; j < list[i].children.length; j++) {
        //         children.push({label: list[i].children[j].name, value: list[i].children[j].id});
        //       }
        //     }
        //     this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
        //   }
        // });
      },
      // getBrandList() {
      //   fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
      //     this.brandOptions = [];
      //     let brandList = response.data.list;
      //     for (let i = 0; i < brandList.length; i++) {
      //       this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
      //     }
      //   });
      // },
      getBrandList() {
        fetchTemplateList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data.templates;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id, basicResourceCount: brandList[i].resourceCount, disable:false});
          }

          for (let i = 0; i < brandList.length; i++) {
            this.templateConfig.push(
              {
                id: brandList[i].id,
                name: brandList[i].code,
                list: brandList[i].resourceList.split(";"),
                descriptions: brandList[i].resourceDescription.split(";"),
                functions: brandList[i].functionList.split(";"),
                picUrl: brandList[i].picUrl,
                basicResourceCount: brandList[i].resourceCount,
                hasAnimation: brandList[i].hasAnimation
              });
          }
          console.log("模板配置信息：", this.templateConfig);
        });
      },
      getCateNameById(id){
        let name=null;
        for(let i=0;i<this.productCateOptions.length;i++){
          for(let j=0;i<this.productCateOptions[i].children.length;j++){
            if(this.productCateOptions[i].children[j].value===id){
              name=this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name;
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
          console.log("进入下一个编辑步骤时选择的模板信息：",this.value.templateInfo);
        });
      },
      handleBrandChange(val) {
        for (let i = 0; i < this.value.templateInfo.length; i++) {
          this.value.templateInfo[i].pageNumber = i + 1;
          if (val == this.value.templateInfo[i].templateId) {
            for (let j = 0; j < this.templateConfig.length; j++) {
              if (this.value.templateInfo[i].templateId == this.templateConfig[j].id) {
                this.value.templateInfo[i].basicResourceCount = this.templateConfig[j].basicResourceCount;
                this.value.templateInfo[i].hasAnimation = this.templateConfig[j].hasAnimation;
                this.value.templateInfo[i].functions = this.templateConfig[j].functions;
                this.value.templateInfo[i].templateName = this.templateConfig[j].name;

                for (let k = 0; k < this.value.templateInfo[i].functions.length; k++) {
                  if (this.value.templateInfo[i].functions[k] == 'webar') {
                    this.value.templateInfo[i].webarInfo = [];
                  }
                }

                if (this.templateConfig[j].hasAnimation == 'N') {
                  this.value.templateInfo[i].animationResource = null;
                } else {
                  this.value.templateInfo[i].animationResource = {modelUrl:'', picUrl:'', brightness:'', duration:'', isSkippable:'N'};
                }
              }
            }

            this.value.templateInfo[i].basicResource = [];

            for (let j = 0; j < this.value.templateInfo[i].basicResourceCount; j++) {
              this.value.templateInfo[i].basicResource.push({
                type: '', order: '', detil: ''
              });
            }
          }
        }

        console.log("修改选择后模板信息：", this.value.templateInfo);
      }
    }
  }
</script>

<style scoped>

</style>
