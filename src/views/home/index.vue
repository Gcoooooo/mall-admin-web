<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="job-total2" class="total-icon">
            </svg-icon>
            <div class="total-title">活动总数</div>
            <div class="total-value">{{activityStaticData.countActivity}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="job-ing2" class="total-icon">
            </svg-icon>
            <div class="total-title">进行中的活动数</div>
            <div class="total-value">{{activityStaticData.countOngoingActivity}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="job-wait2" class="total-icon">
            </svg-icon>
            <div class="total-title">待开始的活动数</div>
            <div class="total-value">{{activityStaticData.countPreparingActivity}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="job-finish2" class="total-icon">
            </svg-icon>
            <div class="total-title">已完成的活动数</div>
            <div class="total-value">{{activityStaticData.countFinishedActivity}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="normalUser2" class="total-icon">
            </svg-icon>
            <div class="total-title">用户总数</div>
            <div class="total-value">{{basicStaticData.totalUserCount}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="totalVisit2" class="total-icon">
            </svg-icon>
            <div class="total-title">访问量总数</div>
            <div class="total-value">{{basicStaticData.totalVisitCount}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="newUser2" class="total-icon">
            </svg-icon>
            <div class="total-title">今日新用户数</div>
            <div class="total-value">{{basicStaticData.newUserCount}}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <svg-icon icon-class="todayVisit2" class="total-icon">
            </svg-icon>
            <div class="total-title">今日新访问量</div>
            <div class="total-value">{{basicStaticData.newVisitCount}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="out-border" style="margin-top: 15px">
      <div class="layout-title"> <i class="el-icon-search"></i> 日访问量统计</div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="statisticByDayslistQuery" size="small" label-width="100px">
            <el-form-item label="活动ID：" prop="activityId">
              <el-input v-model="statisticByDayslistQuery.activityId" placeholder="活动ID"></el-input>
            </el-form-item>

            <el-form-item label="日期区间：" prop="time">
              <el-date-picker
                style="width: 400px"
                size="small"
                v-model="orderCountDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button
                style="float: right"
                @click="getStatisticByDaysData()"
                type="primary"
                size="small">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </div>

      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">总访问人数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{statisticByDaysData.participantCount}}</div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">总访问量</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{statisticByDaysData.visitCount}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 20px;border-left:1px solid #DCDFE6">
            <ve-line
              :data="chartDataOfStatiscByDays"
              :legend-visible="false"
              :loading="loading"
              :data-empty="dataEmpty"
              :settings="StatiscByDayschartSettings">
            </ve-line>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="out-border" style="margin-top: 15px">
      <div class="layout-title"> <i class="el-icon-search"></i> 时段访问量统计</div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="statisticByHourslistQuery" size="small" label-width="100px">
          <el-form-item label="活动ID：" prop="activityId">
            <el-input v-model="statisticByHourslistQuery.activityId" placeholder="活动ID"></el-input>
          </el-form-item>

          <el-form-item label="日期：" prop="time">
            <el-date-picker
              style="width: 400px"
              v-model="statisticByHourslistQuery.date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择统计时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              style="float: right"
              @click="getStatisticByHoursData()"
              type="primary"
              size="small">
              查询
            </el-button>
          </el-form-item>
        </el-form>

      </div>

      <el-row>
        <el-col :span="4">
          <div style="padding: 20px">
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">总访问人数</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{statisticByHoursData.participantCount}}</div>
            </div>
            <div style="margin-top: 20px;">
              <div style="color: #909399;font-size: 14px">总访问量</div>
              <div style="color: #606266;font-size: 24px;padding: 10px 0">{{statisticByHoursData.visitCount}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="20">
          <div style="padding: 20px;border-left:1px solid #DCDFE6">
            <ve-line
              :data="chartDataOfStatiscByHours"
              :legend-visible="false"
              :loading="loading"
              :data-empty="dataEmpty"
              :settings="StatiscByHourschartSettings">
            </ve-line>
          </div>
        </el-col>
      </el-row>

    </div>

    <div class="statistics-layout">
      <div class="layout-title">其他数据统计</div>
      <el-form :inline="true" :model="statisticOtherslistQuery" size="small" label-width="100px" style="margin-top: 15px">
        <el-form-item label="活动ID：" prop="activityId">
          <el-input v-model="statisticOtherslistQuery.activityId" placeholder="活动ID"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            style="float: right"
            @click="getStatisticOtherData()"
            type="primary"
            size="small">
            查询
          </el-button>
        </el-form-item>
      </el-form>

      <el-row>
        <el-col :span="12">
          <div style="padding: 20px">
            <div style="color: #909399;font-size: 14px;text-align: center;margin-bottom: 10px">操作系统统计</div>
            <ve-ring :data="chartDataOfStatisticOs"></ve-ring>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="padding: 20px;border-left:1px solid #DCDFE6">
            <div style="color: #909399;font-size: 14px;text-align: center;margin-bottom: 10px">浏览器类型统计</div>
            <ve-ring :data="chartDataOfStatisticBrowser"></ve-ring>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {str2Date} from '@/utils/date';
  import {getActivityStaticData,getStatisticByDays,getStatisticByHours,getOtherStatistic,getBasicStatistic} from '@/api/hotlink_resource';

  const defaultListQueryStatisticByHours = {
    date:null,
    activityId: null,
  };
  const defaultListQueryStatisticByDays = {
    createTimeStart:null,
    createTimeEnd:null,
    activityId: null,
  };
  const defaultListQueryStatisticOther = {
    activityId: null
  };
  export default {
    name: 'home',
    data() {
      return {
        statisticByHourslistQuery: Object.assign({}, defaultListQueryStatisticByHours),
        statisticByDayslistQuery: Object.assign({}, defaultListQueryStatisticByDays),
        statisticOtherslistQuery: Object.assign({}, defaultListQueryStatisticOther),
        statisticByHoursData:{visitCount: 0, participantCount: 0},
        statisticByDaysData:{visitCount: 0, participantCount: 0},
        basicStaticData: {
          totalUserCount:0,
          totalVisitCount:0,
          newUserCount:0,
          newVisitCount:0
        },
        activityStaticData: {
          countActivity:0,
          countPreparingActivity:0,
          countOngoingActivity:0,
          countFinishedActivity:0,
          countCancelledActivity:0
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',

        StatiscByHourschartSettings: {
          xAxisName: ['时间'],
          yAxisName: ['数值'],
          xAxisType: 'category',
          area:false,
          labelMap: {'visitCount': 'PV', 'participantCount': 'UV'}
        },
        StatiscByDayschartSettings: {
          xAxisName: ['日期'],
          yAxisName: ['数值'],
          xAxisType: 'category',
          area:false,
          labelMap: {'visitCount': 'PV', 'participantCount': 'UV'}
        },
        chartDataOfStatiscByHours: {
          columns: ['hour', 'visitCount','participantCount'],
          rows: [
            {hour: "1", visitCount: 0, participantCount: 0},
            {hour: "2", visitCount: 0, participantCount: 0},
            {hour: "3", visitCount: 0, participantCount: 0},
            {hour: "4", visitCount: 0, participantCount: 0},
            {hour: "5", visitCount: 0, participantCount: 0},
            {hour: "6", visitCount: 0, participantCount: 0},
            {hour: "7", visitCount: 0, participantCount: 0},
            {hour: "8", visitCount: 0, participantCount: 0},
            {hour: "9", visitCount: 0, participantCount: 0},
            {hour: "10", visitCount: 0, participantCount: 0},
            {hour: "11", visitCount: 0, participantCount: 0},
            {hour: "12", visitCount: 0, participantCount: 0},
            {hour: "13", visitCount: 0, participantCount: 0},
            {hour: "14", visitCount: 0, participantCount: 0},
            {hour: "15", visitCount: 0, participantCount: 0},
            {hour: "16", visitCount: 0, participantCount: 0},
            {hour: "17", visitCount: 0, participantCount: 0},
            {hour: "18", visitCount: 0, participantCount: 0},
            {hour: "19", visitCount: 0, participantCount: 0},
            {hour: "20", visitCount: 0, participantCount: 0},
            {hour: "21", visitCount: 0, participantCount: 0},
            {hour: "22", visitCount: 0, participantCount: 0},
            {hour: "23", visitCount: 0, participantCount: 0},
            {hour: "24", visitCount: 0, participantCount: 0}
          ]
        },
        chartDataOfStatiscByDays: {
          columns: ['date', 'visitCount','participantCount'],
          rows: [
            {date:"2019-05-14",visitCount:0,participantCount:0},
            {date:"2019-05-15",visitCount:0,participantCount:0},
            {date:"2019-05-16",visitCount:0,participantCount:0},
            {date:"2019-05-17",visitCount:0,participantCount:0},
            {date:"2019-05-18",visitCount:0,participantCount:0},
            {date:"2019-05-20",visitCount:0,participantCount:0},
            {date:"2019-05-21",visitCount:0,participantCount:0},
            {date:"2019-05-22",visitCount:0,participantCount:0}
          ]
        },
        chartDataOfStatisticOs: {
          columns: ['type', 'count'],
          rows: [
            {type: "Android", count: 1},
            {type: "iOS", count: 1}
          ]
        },
        chartDataOfStatisticBrowser: {
          columns: ['type', 'count'],
          rows: [
            {type: "Wechat", count: 1},
            {type: "Chorme", count: 1},
            {type: "Firefox", count: 1}
          ]
        },
        loading: false,
        dataEmpty: false
      }
    },
    created() {
      //this.initOrderCountDate();
      //this.getData();
      this.getActivityStaticData();
      this.getStatisticBasic();
    },
    methods:{
      getStatisticBasic(){
        getBasicStatistic().then(response => {
          this.basicStaticData.newUserCount = response.newUserCount;
          this.basicStaticData.newVisitCount = response.newVisitCount;
          this.basicStaticData.totalVisitCount = response.totalVisitCount;
          this.basicStaticData.totalUserCount = response.totalUserCount;
        });
      },
      handleSearchList() {
        this.listQuery.pageNumber = 1;
      },
      getActivityStaticData(){
        getActivityStaticData().then(response => {
          this.activityStaticData.countActivity = response.countActivity;
          this.activityStaticData.countPreparingActivity = response.countPreparingActivity;
          this.activityStaticData.countOngoingActivity = response.countOngoingActivity;
          this.activityStaticData.countFinishedActivity = response.countFinishedActivity;
          this.activityStaticData.countCancelledActivity = response.countCancelledActivity;
        })
      },
      // handleDateChange(){
      //   this.getData();
      // },
      initOrderCountDate(){
        let start = new Date();
        start.setFullYear(2018);
        start.setMonth(10);
        start.setDate(1);
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate=[start,end];
      },
      getStatisticOtherData(){
        this.chartDataOfStatisticBrowser = {
          columns: ['type', 'count'],
          rows: []
        };

        this.chartDataOfStatisticOs = {
          columns: ['type', 'count'],
          rows: []
        };

        setTimeout(() => {
          getOtherStatistic(this.statisticOtherslistQuery).then(response => {
            for(let i=0;i<response.osStatistics.length;i++){
              this.chartDataOfStatisticOs.rows.push({
                type:response.osStatistics[i].type,
                count:response.osStatistics[i].count
              })
            }

            for(let i=0;i<response.browserStatistics.length;i++){
              this.chartDataOfStatisticBrowser.rows.push({
                type:response.browserStatistics[i].type,
                count:response.browserStatistics[i].count
              })
            }
          });

          console.log("时段统计表格数据: ", this.chartDataOfStatiscByHours.rows);
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      },
      getStatisticByHoursData(){
        this.getStatisticBasic();
        this.chartDataOfStatiscByHours = {
          columns: ['hour', 'visitCount','participantCount'],
          rows: []
        };

        setTimeout(() => {
          getStatisticByHours(this.statisticByHourslistQuery).then(response => {
            this.statisticByHoursData.participantCount = response.totalParticipantCount;
            this.statisticByHoursData.visitCount = response.totalVisitCount;
            for(let i=0;i<response.statisticByHours.length;i++){
              this.chartDataOfStatiscByHours.rows.push({
                hour:response.statisticByHours[i].hour,
                visitCount:response.statisticByHours[i].visitCount,
                participantCount:response.statisticByHours[i].participantCount
              })
            }
          });

          console.log("时段统计表格数据: ", this.chartDataOfStatiscByHours.rows);
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      },
      getStatisticByDaysData(){
        this.getStatisticBasic();
        this.statisticByDayslistQuery.createTimeStart = this.orderCountDate[0];
        this.statisticByDayslistQuery.createTimeEnd = this.orderCountDate[1];

        this.chartDataOfStatiscByDays = {
          columns: ['date', 'visitCount','participantCount'],
          rows: []
        };

        setTimeout(() => {
          getStatisticByDays(this.statisticByDayslistQuery).then(response => {
            this.statisticByDaysData.participantCount = response.totalParticipantCount;
            this.statisticByDaysData.visitCount = response.totalVisitCount;
            for(let i=0;i<response.statisticByDays.length;i++){
              this.chartDataOfStatiscByDays.rows.push({
                date:response.statisticByDays[i].date,
                visitCount:response.statisticByDays[i].visitCount,
                participantCount:response.statisticByDays[i].participantCount
              })
            }
          });

          console.log("日统计表格数据: ", this.chartDataOfStatiscByDays.rows);
          this.dataEmpty = false;
          this.loading = false
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 0px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-icon2 {
    color: #409EFF;
    width: 40px;
    height: 40px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
</style>
