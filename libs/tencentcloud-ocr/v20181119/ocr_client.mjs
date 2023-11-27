/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Copyright (c) 2018 THL A29 Limited, a Tencent company. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { AbstractClient } from '../common/abstract_client.mjs';
/**
 * ocr client
 * @class
 */
export class Client extends AbstractClient {
  constructor(clientConfig) {
    super('ocr.tencentcloudapi.com', '2018-11-19', clientConfig);
  }
  /**
       * 本接口支持病案首页、费用清单、结算单、医疗发票四种保险理赔单据的文本识别和结构化输出。
  
  默认接口请求频率限制：1次/秒。
       */
  async InsuranceBillOCR(req, cb) {
    return this.request('InsuranceBillOCR', req, cb);
  }
  /**
       * 文本图像增强是面向文档类图片提供的图像增强处理能力，包括切边增强、图像矫正、阴影去除、摩尔纹去除等；可以有效优化文档类的图片质量，提升文字的清晰度。
  
  默认接口请求频率限制：10次/秒。
       */
  async ImageEnhancement(req, cb) {
    return this.request('ImageEnhancement', req, cb);
  }
  /**
       * 本接口支持智能提取各类证照、票据、表单、合同等结构化场景的key:value字段信息，并支持提取表格信息的key:value组的结构化，灵活高效，适用于各类非标准材料的信息录入场景，点击[立即体验](https://cloud.tencent.com/product/smart-ocr)。
  
  默认接口请求频率限制：5次/秒。
       */
  async SmartStructuralOCRV2(req, cb) {
    return this.request('SmartStructuralOCRV2', req, cb);
  }
  /**
       * 本接口支持智能化识别各类企业登记证书、许可证书、企业执照、三证合一类证书，结构化输出统一社会信用代码、公司名称、法定代表人、公司地址、注册资金、企业类型、经营范围、成立日期、有效期、开办资金、经费来源、举办单位等关键字段。
  
  默认接口请求频率限制：5次/秒。
       */
  async EnterpriseLicenseOCR(req, cb) {
    return this.request('EnterpriseLicenseOCR', req, cb);
  }
  /**
       * 本接口支持中英文名片各字段的自动定位与识别，包含姓名、电话、手机号、邮箱、公司、部门、职位、网址、地址、QQ、微信、MSN等。
  
  默认接口请求频率限制：10次/秒。
       */
  async BusinessCardOCR(req, cb) {
    return this.request('BusinessCardOCR', req, cb);
  }
  /**
       * 本接口支持中国大陆居民二代身份证正反面所有字段的识别，包括姓名、性别、民族、出生日期、住址、公民身份证号、签发机关、有效期限，识别准确度达到99%以上。
  
  另外，本接口还支持多种增值能力，满足不同场景的需求。如身份证照片、人像照片的裁剪功能，同时具备9种告警功能，如下表所示。
  
  <table style="width:650px">
        <thead>
          <tr>
         <th width="150">增值能力</th>
            <th width="500">能力项</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="2">裁剪功能</td>
            <td>身份证照片裁剪（去掉证件外多余的边缘、自动矫正拍摄角度）</td>
          </tr>
          <tr>
            <td>人像照片裁剪（自动抠取身份证头像区域）</td>
          </tr>
          <tr>
            <td rowspan="9">告警功能</td>
            <td>身份证有效日期不合法，即有效日期不符合5年、10年、20年、长期期限
  
  </td>
          </tr>
          <tr>
            <td>身份证边框不完整告警</td>
          </tr>
          <tr>
            <td>身份证复印件告警</td>
          </tr>
          <tr>
            <td>身份证翻拍告警</td>
          </tr>
            <tr>
            <td>身份证框内遮挡告警</td>
          </tr>
           <tr>
            <td>临时身份证告警</td>
          </tr>
           <tr>
            <td>身份证疑似存在PS痕迹告警</td>
          </tr>
            <tr>
            <td>图片模糊告警（可根据图片质量分数判断）</td>
          </tr>
        </tbody>
      </table>
  
  默认接口请求频率限制：20次/秒。
       */
  async IDCardOCR(req, cb) {
    return this.request('IDCardOCR', req, cb);
  }
  /**
       * 本接口支持过路过桥费发票关键字段的识别，包括发票代码、发票号码、日期、金额、入口、出口、时间、发票消费类型、高速标志等。
  
  默认接口请求频率限制：5次/秒。
       */
  async TollInvoiceOCR(req, cb) {
    return this.request('TollInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持马来西亚身份证识别，识别字段包括身份证号、姓名、性别、地址；具备身份证人像照片的裁剪功能和翻拍、复印件告警功能。
  本接口暂未完全对外开放，如需咨询，请[联系商务](https://cloud.tencent.com/about/connect)
  
       */
  async MLIDCardOCR(req, cb) {
    return this.request('MLIDCardOCR', req, cb);
  }
  /**
       * 本接口支持增值税发票的准确性核验，您可以通过输入增值税发票的关键字段提供所需的验证信息，接口返回真实的票面相关信息，包括发票代码、发票号码、开票日期、金额、消费类型、购方名称、购方税号、销方名称、销方税号等多个常用字段。支持多种发票类型核验，包括增值税专用发票、增值税普通发票（含电子普通发票、卷式发票、通行费发票）、全电发票、机动车销售统一发票、货物运输业增值税专用发票、二手车销售统一发票、通用机打电子发票（广东和浙江）。
  
  默认接口请求频率限制：20次/秒。
       */
  async VatInvoiceVerifyNew(req, cb) {
    return this.request('VatInvoiceVerifyNew', req, cb);
  }
  /**
       * 本接口支持条形码和二维码的识别（包括 DataMatrix 和 PDF417）。
  
  默认接口请求频率限制：5次/秒。
       */
  async QrcodeOCR(req, cb) {
    return this.request('QrcodeOCR', req, cb);
  }
  /**
       * 本接口支持图像整体文字的检测和识别。支持中文、英文、中英文、数字和特殊字符号的识别，并返回文字框位置和文字内容。
  
  适用于文字较多、版式复杂、对识别准召率要求较高的场景，如试卷试题、网络图片、街景店招牌、法律卷宗等场景。
  
  产品优势：与通用印刷体识别相比，提供更高精度的文字识别服务，在文字较多、长串数字、小字、模糊字、倾斜文本等困难场景下，高精度版的准确率和召回率更高。
  
  通用印刷体识别不同版本的差异如下：
  <table style="width:715px">
        <thead>
          <tr>
            <th style="width:150px"></th>
            <th >【荐】通用印刷体识别（高精度版）</th>
            <th style="width:200px"><a href="https://cloud.tencent.com/document/product/866/33526">【荐】通用印刷体识别</a></th>
            <th><a href="https://cloud.tencent.com/document/product/866/37831">通用印刷体识别（精简版）</a></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 适用场景</td>
            <td>适用于文字较多、长串数字、小字、模糊字、倾斜文本等困难场景</td>
            <td>适用于所有通用场景的印刷体识别</td>
            <td>适用于快速文本识别场景，准召率有一定损失，价格更优惠</td>
          </tr>
          <tr>
            <td>识别准确率</td>
            <td>99%</td>
            <td>96%</td>
            <td>91%</td>
          </tr>
          <tr>
            <td>价格</td>
            <td>高</td>
            <td>中</td>
            <td>低</td>
          </tr>
          <tr>
            <td>支持的语言</td>
            <td>中文、英文、中英文</td>
            <td>中文、英文、中英文、日语、韩语、西班牙语、法语、德语、葡萄牙语、越南语、马来语、俄语、意大利语、荷兰语、瑞典语、芬兰语、丹麦语、挪威语、匈牙利语、泰语</td>
            <td>中文、英文、中英文</td>
          </tr>
          <tr>
            <td>自动语言检测</td>
            <td>支持</td>
            <td>支持</td>
            <td>支持</td>
          </tr>
          <tr>
            <td>返回文本行坐标</td>
            <td>支持</td>
            <td>支持</td>
            <td>支持</td>
          </tr>
          <tr>
            <td>自动旋转纠正</td>
            <td>支持旋转识别，返回角度信息</td>
            <td>支持旋转识别，返回角度信息</td>
            <td>支持旋转识别，返回角度信息</td>
          </tr>
        </tbody>
      </table>
  
  默认接口请求频率限制：10次/秒。
       */
  async GeneralAccurateOCR(req, cb) {
    return this.request('GeneralAccurateOCR', req, cb);
  }
  /**
       * 本接口支持机票行程单关键字段的识别，包括旅客姓名、有效身份证件号码、电子客票号码、验证码、填开单位、其他税费、燃油附加费、民航发展基金、保险费、销售单位代号、始发地、目的地、航班号、时间、日期、座位等级、承运人、发票消费类型、票价、合计金额、填开日期、国内国际标签、印刷序号、客票级别/类别、客票生效日期、有效期截止日期、免费行李等字段，支持航班信息多行明细输出。
  
  默认接口请求频率限制：5次/秒。
       */
  async FlightInvoiceOCR(req, cb) {
    return this.request('FlightInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持集装箱箱门信息识别，识别字段包括集装箱箱号、类型、总重量、有效承重、容量、自身重量，具备集装箱箱号、类型不完整或者不清晰的告警功能。
  默认接口请求频率限制：5次/秒。
       */
  async RecognizeContainerOCR(req, cb) {
    return this.request('RecognizeContainerOCR', req, cb);
  }
  /**
       * 本接口支持中英文图片/PDF内常规表格、无线表格、多表格的检测和识别，返回每个单元格的文字内容，支持旋转的表格图片识别，且支持将识别结果保存为 Excel 格式。识别效果比表格识别V2更好，覆盖场景更加广泛，对表格难例场景，如无线表格、嵌套表格（有线表格中包含无线表格）的识别效果均优于表格识别V2。点击[立即体验](https://cloud.tencent.com/act/event/ocrdemo)。
  
  默认接口请求频率限制：2次/秒。
       */
  async RecognizeTableAccurateOCR(req, cb) {
    return this.request('RecognizeTableAccurateOCR', req, cb);
  }
  /**
       * 本接口支持多张、多类型票据的混合检测和自动分类，返回对应票据类型。目前已支持增值税发票、增值税发票（卷票）、定额发票、通用机打发票、购车发票、火车票、出租车发票、机票行程单、汽车票、轮船票、过路过桥费发票、酒店账单、客运限额发票、购物小票、完税证明共15种票据。
  默认接口请求频率限制：5次/秒。
       */
  async MixedInvoiceDetect(req, cb) {
    return this.request('MixedInvoiceDetect', req, cb);
  }
  /**
       * 本接口支持识别轮船票的发票代码、发票号码、日期、姓名、票价、始发地、目的地、姓名、时间、发票消费类型、省、市、币种字段。
  
  默认接口请求频率限制：5次/秒。
       */
  async ShipInvoiceOCR(req, cb) {
    return this.request('ShipInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持中国港澳台地区以及其他国家、地区的护照识别。识别字段包括护照ID、姓名、出生日期、性别、有效期、发行国、国籍、国家地区代码，具备护照人像照片的裁剪功能和翻拍、复印件告警功能。
  
  默认接口请求频率限制：5次/秒。
       */
  async MLIDPassportOCR(req, cb) {
    return this.request('MLIDPassportOCR', req, cb);
  }
  /**
       * 本接口支持对增值税发票（卷票）关键字段的识别，包括的发票代码、合计金额(小写)、合计金额(大写)、开票日期、发票号码、购买方识别号、销售方识别号、校验码、销售方名称、购买方名称、发票消费类型、省、市、是否有公司印章、单价、金额、数量、服务类型、品名、种类等。
  
  默认接口请求频率限制：5次/秒。
       */
  async VatRollInvoiceOCR(req, cb) {
    return this.request('VatRollInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持定额发票的发票号码、发票代码、金额(大小写)、发票消费类型、地区及是否有公司印章等关键字段的识别。
  
  默认接口请求频率限制：5次/秒。
       */
  async QuotaInvoiceOCR(req, cb) {
    return this.request('QuotaInvoiceOCR', req, cb);
  }
  /**
   * 菲律宾UMID识别
   */
  async RecognizePhilippinesUMIDOCR(req, cb) {
    return this.request('RecognizePhilippinesUMIDOCR', req, cb);
  }
  /**
       * 本接口支持图片中整体文字的检测和识别，返回文字框位置与文字内容。相比通用印刷体识别接口，识别速度更快。
  
  默认接口请求频率限制：10次/秒。
       */
  async GeneralFastOCR(req, cb) {
    return this.request('GeneralFastOCR', req, cb);
  }
  /**
       * 本接口支持房产证关键字段的识别，包括房地产权利人、共有情况、登记时间、规划用途、房屋性质、房屋坐落等。
  目前接口对合肥、成都、佛山三个城市的房产证版式识别较好。
  
  默认接口请求频率限制：5次/秒。
       */
  async PropOwnerCertOCR(req, cb) {
    return this.request('PropOwnerCertOCR', req, cb);
  }
  /**
       * 本接口支持泰国身份证识别，识别字段包括泰文姓名、英文姓名、地址、出生日期、身份证号码、首次领用日期、签发日期等字段。
  本接口暂未完全对外开放，如需咨询，请[联系商务](https://cloud.tencent.com/about/connect)
  
  默认接口请求频率限制：10次/秒
       */
  async RecognizeThaiIDCardOCR(req, cb) {
    return this.request('RecognizeThaiIDCardOCR', req, cb);
  }
  /**
       * 本接口支持快速精准识别营业执照上的字段，包括统一社会信用代码、公司名称、主体类型、法定代表人、注册资本、组成形式、成立日期、营业期限和经营范围等字段。
  
  默认接口请求频率限制：10次/秒。
       */
  async BizLicenseOCR(req, cb) {
    return this.request('BizLicenseOCR', req, cb);
  }
  /**
       * 本接口支持图片内手写体文字的检测和识别，针对手写字体无规则、字迹潦草、模糊等特点进行了识别能力的增强。
  
  默认接口请求频率限制：10次/秒。
       */
  async GeneralHandwritingOCR(req, cb) {
    return this.request('GeneralHandwritingOCR', req, cb);
  }
  /**
       * 本接口支持市面上主流版式电子运单的识别，包括收件人和寄件人的姓名、电话、地址以及运单号等字段。
  
  默认接口请求频率限制：10次/秒。
       */
  async WaybillOCR(req, cb) {
    return this.request('WaybillOCR', req, cb);
  }
  /**
       * 本接口支持增值税发票的准确性核验，您可以通过输入增值税发票的关键字段提供所需的验证信息，接口返回真实的票面相关信息，包括发票代码、发票号码、开票日期、金额、消费类型、购方名称、购方税号、销方名称、销方税号等多个常用字段。支持多种发票类型核验，包括增值税专用发票、增值税普通发票（含电子普通发票、卷式发票、通行费发票）、全电发票、机动车销售统一发票、货物运输业增值税专用发票、二手车销售统一发票。
  
  默认接口请求频率限制：20次/秒。
       */
  async VatInvoiceVerify(req, cb) {
    return this.request('VatInvoiceVerify', req, cb);
  }
  /**
       * 本接口支持出租车发票关键字段的识别，包括发票号码、发票代码、金额、日期、上下车时间、里程、车牌号、发票类型及所属地区等字段。
  
  默认接口请求频率限制：5次/秒。
       */
  async TaxiInvoiceOCR(req, cb) {
    return this.request('TaxiInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持对通用机打发票的发票代码、发票号码、日期、合计金额(小写)、合计金额(大写)、购买方识别号、销售方识别号、校验码、购买方名称、销售方名称、时间、种类、发票消费类型、省、市、是否有公司印章、发票名称、购买方地址、电话、销售方地址、电话、购买方开户行及账号、销售方开户行及账号、经办人取票用户、经办人支付信息、经办人商户号、经办人订单号、货物或应税劳务、服务名称、数量、单价、税率、税额、金额、单位、规格型号、合计税额、合计金额、备注、收款人、复核、开票人、密码区、行业分类等字段的识别。
  
  默认接口请求频率限制：5次/秒。
       */
  async InvoiceGeneralOCR(req, cb) {
    return this.request('InvoiceGeneralOCR', req, cb);
  }
  /**
   * 支持查询智能表单录入任务的状态。本产品免费公测中，您可以点击demo（超链接：https://ocr.smartform.cloud.tencent.com/）试用，如需购买请与商务团队联系。
   */
  async GetTaskState(req, cb) {
    return this.request('GetTaskState', req, cb);
  }
  /**
       * 本接口支持网约车行程单关键字段的识别，包括行程起止日期、上车时间、起点、终点、里程、金额等字段。
  
  默认接口请求频率限制：20次/秒。
       */
  async RecognizeOnlineTaxiItineraryOCR(req, cb) {
    return this.request('RecognizeOnlineTaxiItineraryOCR', req, cb);
  }
  /**
   * 本接口支持图片内车辆识别代号（VIN）的检测和识别。
   */
  async VinOCR(req, cb) {
    return this.request('VinOCR', req, cb);
  }
  /**
       * 本接口支持中国香港身份证人像面中关键字段的识别，包括中文姓名、英文姓名、姓名电码、出生日期、性别、证件符号、首次签发日期、最近领用日期、身份证号、是否是永久性居民身份证；具备人像照片裁剪等扩展功能。
  
  默认接口请求频率限制：5次/秒。
       */
  async HKIDCardOCR(req, cb) {
    return this.request('HKIDCardOCR', req, cb);
  }
  /**
       * 本接口支持中英文图片/ PDF内常规表格、无线表格、多表格的检测和识别，支持日文有线表格识别，返回每个单元格的文字内容，支持旋转的表格图片识别，且支持将识别结果保存为 Excel 格式。
  
  默认接口请求频率限制：10次/秒。
       */
  async RecognizeTableOCR(req, cb) {
    return this.request('RecognizeTableOCR', req, cb);
  }
  /**
       * 本接口可创建智能表单录入任务，支持多个识别图片和PDF的URL上传，返回含有识别内容的操作页面URL。
  
  智能表单录入产品提供高准确率的表单识别技术和人工核对工具，支持自定义字段，将识别结果自动填入到自定义条目中，并提供人工操作工具，完成整个表单识别过程。适用性强，可对票据、合同、货单等文件的识别，适用于金融、货代、保险、档案等领域。本产品免费公测中，您可以点击demo（超链接：https://ocr.smartform.cloud.tencent.com/）试用，如需购买请与商务团队联系。
       */
  async CreateAIFormTask(req, cb) {
    return this.request('CreateAIFormTask', req, cb);
  }
  /**
       * 本接口支持对完税证明的税号、纳税人识别号、纳税人名称、金额合计大写、金额合计小写、填发日期、税务机关、填票人等关键字段的识别。
  
  默认接口请求频率限制：5次/秒。
       */
  async DutyPaidProofOCR(req, cb) {
    return this.request('DutyPaidProofOCR', req, cb);
  }
  /**
       * 本接口支持图像整体文字的检测和识别。可以识别中文、英文、中英文、日语、韩语、西班牙语、法语、德语、葡萄牙语、越南语、马来语、俄语、意大利语、荷兰语、瑞典语、芬兰语、丹麦语、挪威语、匈牙利语、泰语，阿拉伯语20种语言，且各种语言均支持与英文混合的文字识别。
  
  适用于印刷文档识别、网络图片识别、广告图文字识别、街景店招牌识别、菜单识别、视频标题识别、头像文字识别等场景。
  
  产品优势：支持自动识别语言类型，可返回文本框坐标信息，对于倾斜文本支持自动旋转纠正。
  
  通用印刷体识别不同版本的差异如下：
  <table style="width:715px">
        <thead>
          <tr>
            <th style="width:150px"></th>
            <th style="width:200px">【荐】通用印刷体识别</th>
            <th ><a href="https://cloud.tencent.com/document/product/866/34937">【荐】通用印刷体识别（高精度版）</a></th>
            <th><a href="https://cloud.tencent.com/document/product/866/37831">通用印刷体识别（精简版）</a></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 适用场景</td>
            <td>适用于所有通用场景的印刷体识别</td>
            <td>适用于文字较多、长串数字、小字、模糊字、倾斜文本等困难场景</td>
            <td>适用于快速文本识别场景，准召率有一定损失，价格更优惠</td>
          </tr>
          <tr>
            <td>识别准确率</td>
            <td>96%</td>
            <td>99%</td>
            <td>91%</td>
          </tr>
          <tr>
            <td>价格</td>
            <td>中</td>
            <td>高</td>
            <td>低</td>
          </tr>
          <tr>
            <td>支持的语言</td>
            <td>中文、英文、中英文、日语、韩语、西班牙语、法语、德语、葡萄牙语、越南语、马来语、俄语、意大利语、荷兰语、瑞典语、芬兰语、丹麦语、挪威语、匈牙利语、泰语</td>
            <td>中文、英文、中英文</td>
            <td>中文、英文、中英文</td>
          </tr>
          <tr>
            <td>自动语言检测</td>
            <td>支持</td>
            <td>支持</td>
            <td>支持</td>
          </tr>
          <tr>
            <td>返回文本行坐标</td>
            <td>支持</td>
            <td>支持</td>
            <td>支持</td>
          </tr>
          <tr>
            <td>自动旋转纠正</td>
            <td>支持旋转识别，返回角度信息</td>
            <td>支持旋转识别，返回角度信息</td>
            <td>支持旋转识别，返回角度信息</td>
          </tr>
        </tbody>
      </table>
  
  默认接口请求频率限制：20次/秒。
       */
  async GeneralBasicOCR(req, cb) {
    return this.request('GeneralBasicOCR', req, cb);
  }
  /**
       * 本接口支持对卡式港澳台通行证的识别，包括签发地点、签发机关、有效期限、性别、出生日期、英文姓名、姓名、证件号等字段。
  
  默认接口请求频率限制：10次/秒。
       */
  async PermitOCR(req, cb) {
    return this.request('PermitOCR', req, cb);
  }
  /**
       * 本接口支持组织机构代码证关键字段的识别，包括代码、有效期、地址、机构名称等。
  
  默认接口请求频率限制：5次/秒。
       */
  async OrgCodeCertOCR(req, cb) {
    return this.request('OrgCodeCertOCR', req, cb);
  }
  /**
   * 本接口通过检测图片中的文字信息特征，快速判断图片中有无文字并返回判断结果，帮助用户过滤无文字的图片。
   */
  async TextDetect(req, cb) {
    return this.request('TextDetect', req, cb);
  }
  /**
       * 本接口支持常见银行票据的自动分类和识别。切片识别包括金融行业常见票据的重要切片字段识别，包括金额、账号、日期、凭证号码等。（金融票据切片：金融票据中待识别字段及其周围局部区域的裁剪图像。）
  
  默认接口请求频率限制：5次/秒。
       */
  async FinanBillSliceOCR(req, cb) {
    return this.request('FinanBillSliceOCR', req, cb);
  }
  /**
       * 本接口支持识别公路汽车客票关键字段的识别，包括发票代码、发票号码、日期、票价、始发地、目的地、姓名、时间、发票消费类型、身份证号、省、市、开票日期、乘车地点、检票口、客票类型、车型、座位号、车次等。
  
  默认接口请求频率限制：5次/秒。
       */
  async BusInvoiceOCR(req, cb) {
    return this.request('BusInvoiceOCR', req, cb);
  }
  /**
       * 医疗发票识别目前支持全国统一门诊发票、全国统一住院发票、以及部分地方的门诊和住院发票的识别。
  
  默认接口请求频率限制：5次/秒。
       */
  async RecognizeMedicalInvoiceOCR(req, cb) {
    return this.request('RecognizeMedicalInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持增值税专用发票、增值税普通发票、增值税电子专票、增值税电子普票、电子发票（普通发票）、电子发票（增值税专用发票）全字段的内容检测和识别，包括发票代码、发票号码、打印发票代码、打印发票号码、开票日期、合计金额、校验码、税率、合计税额、价税合计、购买方识别号、复核、销售方识别号、开票人、密码区1、密码区2、密码区3、密码区4、发票名称、购买方名称、销售方名称、服务名称、备注、规格型号、数量、单价、金额、税额、收款人等字段，点击[立即试用](https://cloud.tencent.com/product/ocr)。
  
  默认接口请求频率限制：10次/秒。
       */
  async VatInvoiceOCR(req, cb) {
    return this.request('VatInvoiceOCR', req, cb);
  }
  /**
       * <b>此接口为表格识别的旧版本服务，不再进行服务升级，建议您使用识别能力更强、服务性能更优的<a href="https://cloud.tencent.com/document/product/866/49525">新版表格识别</a>。</b>
  
  本接口支持图片内表格文档的检测和识别，返回每个单元格的文字内容，支持将识别结果保存为 Excel 格式。
  
  默认接口请求频率限制：10次/秒。
       */
  async TableOCR(req, cb) {
    return this.request('TableOCR', req, cb);
  }
  /**
       * 本接口支持网约车驾驶证关键字段的识别，包括姓名、证号、起始日期、截止日期、发证日期。
  
  默认接口请求频率限制：5次/秒。
       */
  async RideHailingDriverLicenseOCR(req, cb) {
    return this.request('RideHailingDriverLicenseOCR', req, cb);
  }
  /**
       * 港澳台居住证OCR支持港澳台居住证正反面全字段内容检测识别功能，包括姓名、性别、出生日期、地址、身份证号、签发机关、有效期限、签发次数、通行证号码关键字段识别。可以应用于港澳台居住证信息识别场景，例如银行开户、用户注册等。
  
  默认接口请求频率限制：20次/秒。
       */
  async HmtResidentPermitOCR(req, cb) {
    return this.request('HmtResidentPermitOCR', req, cb);
  }
  /**
       * 本接口支持识别并提取各类证照、票据、表单、合同等结构化场景的字段信息。无需任何配置，灵活高效。适用于各类结构化信息录入场景。
  
  默认接口请求频率限制：5次/秒。
       */
  async SmartStructuralOCR(req, cb) {
    return this.request('SmartStructuralOCR', req, cb);
  }
  /**
       * 本接口支持作业算式题目的自动识别和判分，目前覆盖 K12 学力范围内的 11 种题型，包括加减乘除四则、加减乘除已知结果求运算因子、判断大小、约等于估算、带余数除法、分数四则运算、单位换算、竖式加减法、竖式乘除法、脱式计算和解方程，平均识别精度达到93%以上。
  
  默认接口请求频率限制：10次/秒。
       */
  async ArithmeticOCR(req, cb) {
    return this.request('ArithmeticOCR', req, cb);
  }
  /**
       * 本接口支持对中国大陆机动车车牌的自动定位和识别，返回地域编号和车牌号码与车牌颜色信息。
  
  默认接口请求频率限制：10次/秒。
       */
  async LicensePlateOCR(req, cb) {
    return this.request('LicensePlateOCR', req, cb);
  }
  /**
       * 本接口支持不动产权证关键字段的识别，包括使用期限、面积、用途、权利性质、权利类型、坐落、共有情况、权利人、权利其他状况等。
  
  默认接口请求频率限制：5次/秒。
  
  
       */
  async EstateCertOCR(req, cb) {
    return this.request('EstateCertOCR', req, cb);
  }
  /**
       * 支持身份证、护照、名片、银行卡、行驶证、驾驶证、港澳台通行证、户口本、港澳台来往内地通行证、港澳台居住证、不动产证、营业执照的智能分类。
  
  默认接口请求频率限制：20次/秒。
       */
  async ClassifyDetectOCR(req, cb) {
    return this.request('ClassifyDetectOCR', req, cb);
  }
  /**
       * 本接口支持各类印章主体内容、印章其他内容及形状识别，支持单图多印章识别，包括发票章、财务章等，适用于公文票据等场景。
  
  默认接口请求频率限制：5次/秒。
       */
  async SealOCR(req, cb) {
    return this.request('SealOCR', req, cb);
  }
  /**
       * 本接口支持菲律宾VoteID识别，识别字段包括姓名、姓氏、出生日期、婚姻状况、国籍、地址、地区、菲律宾VoteID的VIN等。
  
  默认接口请求频率限制：20次/秒。
       */
  async RecognizePhilippinesVoteIDOCR(req, cb) {
    return this.request('RecognizePhilippinesVoteIDOCR', req, cb);
  }
  /**
       * 本接口支持火车票全字段的识别，包括编号、出发站、到达站、出发时间、车次、座位号、姓名、票价、席别、身份证号、发票消费类型、序列号、加收票价、手续费、大写金额、售票站、原票价、发票类型、收据号码、是否仅供报销使用等字段的识别。
  
  默认接口请求频率限制：5次/秒。
       */
  async TrainTicketOCR(req, cb) {
    return this.request('TrainTicketOCR', req, cb);
  }
  /**
       * 本接口支持银行回单全字段的识别，包括付款开户行、收款开户行、付款账号、收款账号、回单类型、回单编号、币种、流水号、凭证号码、交易机构、交易金额、手续费、日期等字段信息。
  
  默认接口请求频率限制：10次/秒。
       */
  async BankSlipOCR(req, cb) {
    return this.request('BankSlipOCR', req, cb);
  }
  /**
       * 本接口支持图像整体文字的检测和识别。支持中文、英文、中英文、数字和特殊字符号的识别，并返回文字框位置和文字内容。
  
  适用于快速文本识别场景。
  
  产品优势：与通用印刷体识别接口相比，精简版虽然在准确率和召回率上有一定损失，但价格更加优惠。
  
  通用印刷体识别不同版本的差异如下：
  <table style="width:715px">
        <thead>
          <tr>
            <th style="width:150px"></th>
            <th >通用印刷体识别（精简版）</th>
            <th style="width:200px"><a href="https://cloud.tencent.com/document/product/866/33526">【荐】通用印刷体识别</a></th>
            <th><a href="https://cloud.tencent.com/document/product/866/34937">【荐】通用印刷体识别（高精度版）</a></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 适用场景</td>
            <td>适用于快速文本识别场景，准召率有一定损失，价格更优惠</td>
            <td>适用于所有通用场景的印刷体识别</td>
            <td>适用于文字较多、长串数字、小字、模糊字、倾斜文本等困难场景</td>
          </tr>
          <tr>
            <td>识别准确率</td>
            <td>91%</td>
            <td>96%</td>
            <td>99%</td>
          </tr>
          <tr>
            <td>价格</td>
            <td>低</td>
            <td>中</td>
            <td>高</td>
          </tr>
          <tr>
            <td>支持的语言</td>
            <td>中文、英文、中英文</td>
            <td>中文、英文、中英文、日语、韩语、西班牙语、法语、德语、葡萄牙语、越南语、马来语、俄语、意大利语、荷兰语、瑞典语、芬兰语、丹麦语、挪威语、匈牙利语、泰语</td>
            <td>中文、英文、中英文</td>
          </tr>
          <tr>
            <td>自动语言检测</td>
            <td>支持</td>
            <td>支持</td>
            <td>支持</td>
          </tr>
          <tr>
            <td>返回文本行坐标</td>
            <td>支持</td>
            <td>支持</td>
            <td>支持</td>
          </tr>
          <tr>
            <td>自动旋转纠正</td>
            <td>支持旋转识别，返回角度信息</td>
            <td>支持旋转识别，返回角度信息</td>
            <td>支持旋转识别，返回角度信息</td>
          </tr>
        </tbody>
      </table>
  
  默认接口请求频率限制：10次/秒。
       */
  async GeneralEfficientOCR(req, cb) {
    return this.request('GeneralEfficientOCR', req, cb);
  }
  /**
       * 本接口支持广告商品图片内文字的检测和识别，返回文本框位置与文字内容。
  
  产品优势：针对广告商品图片普遍存在较多繁体字、艺术字的特点，进行了识别能力的增强。支持中英文、横排、竖排以及倾斜场景文字识别。文字识别的召回率和准确率能达到96%以上。
       */
  async AdvertiseOCR(req, cb) {
    return this.request('AdvertiseOCR', req, cb);
  }
  /**
       * 本接口支持国内机动车登记证书主要字段的结构化识别，包括机动车所有人、身份证明名称、号码、车辆型号、车辆识别代号、发动机号、制造厂名称等。
  
  默认接口请求频率限制：5次/秒。
       */
  async VehicleRegCertOCR(req, cb) {
    return this.request('VehicleRegCertOCR', req, cb);
  }
  /**
       * 本接口支持通信大数据行程卡识别，包括行程卡颜色、更新时间、途经地、存在中高风险地区的城市、电话号码，五个字段的识别结果输出。
  
  默认接口请求频率限制：20次/秒。
       */
  async RecognizeTravelCardOCR(req, cb) {
    return this.request('RecognizeTravelCardOCR', req, cb);
  }
  /**
       * 本接口支持事业单位法人证书关键字段识别，包括注册号、有效期、住所、名称、法定代表人等。
  
  默认接口请求频率限制：5次/秒。
       */
  async InstitutionOCR(req, cb) {
    return this.request('InstitutionOCR', req, cb);
  }
  /**
       * 本接口支持图像英文文字的检测和识别，返回文字框位置与文字内容。支持多场景、任意版面下的英文、字母、数字和常见字符的识别，同时覆盖英文印刷体和英文手写体识别。
  
  默认接口请求频率限制：10次/秒。
       */
  async EnglishOCR(req, cb) {
    return this.request('EnglishOCR', req, cb);
  }
  /**
       * 本接口支持居民户口簿户主页及成员页关键字段的识别，包括姓名、户别、地址、籍贯、身份证号码等。
  
  默认接口请求频率限制：5次/秒。
       */
  async ResidenceBookletOCR(req, cb) {
    return this.request('ResidenceBookletOCR', req, cb);
  }
  /**
       * 本接口支持对中国大陆主流银行卡正反面关键字段的检测与识别，包括卡号、卡类型、卡名字、银行信息、有效期。支持竖排异形卡识别、多角度旋转图片识别。支持对复印件、翻拍件、边框遮挡的银行卡进行告警，可应用于各种银行卡信息有效性校验场景，如金融行业身份认证、第三方支付绑卡等场景。
  
  默认接口请求频率限制：10次/秒。
       */
  async BankCardOCR(req, cb) {
    return this.request('BankCardOCR', req, cb);
  }
  /**
       * 本接口支持机动车销售统一发票和二手车销售统一发票的识别，包括发票号码、发票代码、合计金额、合计税额等二十多个字段。
  
  默认接口请求频率限制：5次/秒。
       */
  async CarInvoiceOCR(req, cb) {
    return this.request('CarInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持驾驶证主页和副页所有字段的自动定位与识别，重点字段的识别准确度达到99%以上。
  
  驾驶证主页：包括证号、姓名、性别、国籍、住址、出生日期、初次领证日期、准驾车型、有效期限、发证单位
  
  驾驶证副页：包括证号、姓名、档案编号、记录。
  
  另外，本接口还支持复印件、翻拍告警功能。同时支持识别交管12123 APP发放的电子驾驶证正页。
  
  电子驾驶证正页：包括证号、姓名、性别、国籍、出生日期、初次领证日期、准驾车型、有效期开始时间、有效期截止时间、档案编号、状态、累积记分。
  
  默认接口请求频率限制：10次/秒。
       */
  async DriverLicenseOCR(req, cb) {
    return this.request('DriverLicenseOCR', req, cb);
  }
  /**
       * 智能识别并结构化港澳台居民来往内地通行证正面全部字段，包含中文姓名、英文姓名、性别、出生日期、签发机关、有效期限、证件号、签发地点、签发次数、证件类别。
  
  默认接口请求频率限制：20次/秒。
       */
  async MainlandPermitOCR(req, cb) {
    return this.request('MainlandPermitOCR', req, cb);
  }
  /**
   * 菲律宾SSSID/UMID识别
   */
  async RecognizePhilippinesSssIDOCR(req, cb) {
    return this.request('RecognizePhilippinesSssIDOCR', req, cb);
  }
  /**
       * 本接口支持识别主流初高中数学符号和公式，返回公式的 Latex 格式文本。
  
  默认接口请求频率限制：5次/秒。
       */
  async FormulaOCR(req, cb) {
    return this.request('FormulaOCR', req, cb);
  }
  /**
       * 本接口支持中国大陆地区护照个人资料页多个字段的检测与识别。已支持字段包括英文姓名、中文姓名、国家码、护照号、出生地、出生日期、国籍英文、性别英文、有效期、签发地点英文、签发日期、持证人签名、护照机读码（MRZ码）等。
  
  默认接口请求频率限制：10次/秒。
       */
  async PassportOCR(req, cb) {
    return this.request('PassportOCR', req, cb);
  }
  /**
       * 本接口支持常见银行票据的自动分类和识别。整单识别包括支票（含现金支票、普通支票、转账支票），承兑汇票（含银行承兑汇票、商业承兑汇票）以及进账单等，适用于中国人民银行印发的 2010 版银行票据凭证版式（银发[2010]299 号）。
  
  默认接口请求频率限制：5次/秒。
       */
  async FinanBillOCR(req, cb) {
    return this.request('FinanBillOCR', req, cb);
  }
  /**
   * 菲律宾驾驶证识别
   */
  async RecognizePhilippinesDrivingLicenseOCR(req, cb) {
    return this.request('RecognizePhilippinesDrivingLicenseOCR', req, cb);
  }
  /**
   * 本接口支持OFD格式的 增值税电子普通发票、增值税电子专用发票、电子发票（普通发票）、电子发票（增值税专用发票）识别，返回发票代码、发票号码、开票日期、验证码、机器编号、密码区，购买方和销售方信息，包括名称、纳税人识别号、地址电话、开户行及账号，以及价税合计、开票人、收款人、复核人、税额、不含税金额等字段信息。
   */
  async VerifyOfdVatInvoiceOCR(req, cb) {
    return this.request('VerifyOfdVatInvoiceOCR', req, cb);
  }
  /**
       * 本接口支持 单张、多张、多类型 票据的混合识别，同时支持自选需要识别的票据类型，已支持票种包括：增值税发票（专票、普票、卷票）、全电发票、非税发票、定额发票、通用机打发票、购车发票、火车票、出租车发票、机票行程单、汽车票、轮船票、过路过桥费发票共14种标准报销发票，并支持其他类发票的识别。
  
  默认接口请求频率限制：5次/秒。
       */
  async MixedInvoiceOCR(req, cb) {
    return this.request('MixedInvoiceOCR', req, cb);
  }
  /**
       * 印尼身份证识别
  
  默认接口请求频率限制：20次/秒。
       */
  async RecognizeIndonesiaIDCardOCR(req, cb) {
    return this.request('RecognizeIndonesiaIDCardOCR', req, cb);
  }
  /**
       * 本接口支持北京、上海、广东、江苏、吉林、黑龙江、天津、辽宁、浙江、河南、四川、贵州、山东、安徽、福建、江西、湖北、湖南等省份健康码的识别，包括持码人姓名、持码人身份证号、健康码更新时间、健康码颜色、核酸检测结果、核酸检测间隔时长、核酸检测时间，疫苗接种信息，八个字段的识别结果输出。不同省市健康码显示的字段信息有所不同，上述字段的识别结果可能为空，以图片上具体展示的信息为准。
  
  默认接口请求频率限制：10次/秒。
       */
  async RecognizeHealthCodeOCR(req, cb) {
    return this.request('RecognizeHealthCodeOCR', req, cb);
  }
  /**
       * 本接口支持数学试题内容的识别和结构化输出，包括通用文本解析和小学/初中/高中数学公式解析能力（包括91种题型，180种符号），公式返回格式为 Latex 格式文本。
  
  默认接口请求频率限制：5次/秒。
       */
  async EduPaperOCR(req, cb) {
    return this.request('EduPaperOCR', req, cb);
  }
  /**
       * 本接口支持网约车运输证关键字段的识别，包括交运管许可字号、车辆所有人、车辆号牌、起始日期、截止日期、发证日期。
  
  默认接口请求频率限制：5次/秒。
       */
  async RideHailingTransportLicenseOCR(req, cb) {
    return this.request('RideHailingTransportLicenseOCR', req, cb);
  }
  /**
   * 菲律宾TinID识别
   */
  async RecognizePhilippinesTinIDOCR(req, cb) {
    return this.request('RecognizePhilippinesTinIDOCR', req, cb);
  }
  /**
       * 本接口支持 PDF多页（最多30页）、一页中单张、多张、类型票据的混合识别，同时支持单选识别某类票据，已支持票种包括：增值税发票（专票、普票、卷票、区块链发票、通行费发票）、全电发票（专票、普票）、非税发票（通用票据、统一缴纳书）、定额发票、通用机打发票、购车发票（机动车销售发票、二手车发票）、火车票、出租车发票、机票行程单、汽车票、轮船票、过路过桥费发票共14种标准报销发票，并支持非上述类型的其他发票的智能识别，点击[立即试用](https://cloud.tencent.com/product/ocr)。
  
  默认接口请求频率限制：5次/秒。
  
  
  支持返回的细项目子票种SubType、子票种中文TypeDescription、以及对应所属大类票种Type 的说明如下列表：
  <table style="width:715px">
        <thead>
          <tr>
            <th style="width:200px">SubType 子票种英文</th>
            <th style="width:200px">TypeDescription子票种中文</th>
            <th >Type 所属大类票种</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> VatSpecialInvoice</td>
            <td> 增值税专用发票 </td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatCommonInvoice</td>
            <td> 增值税普通发票 </td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatElectronicCommonInvoice </td>
            <td> 增值税电子普通发票 </td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatElectronicSpecialInvoice </td>
            <td> 增值税电子专用发票 </td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatElectronicInvoiceBlockchain</td>
            <td> 区块链电子发票 </td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatElectronicInvoiceToll</td>
            <td> 增值税电子普通发票(通行费)</td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatSalesList</td>
            <td> 增值税销货清单</td>
            <td> 3 </td>
          </tr>
          <tr>
            <td> VatElectronicSpecialInvoiceFull</td>
            <td> 电子发票(专用发票)</td>
            <td> 16 </td>
          </tr>
          <tr>
            <td> VatElectronicInvoiceFull</td>
            <td> 电子发票(普通发票) </td>
            <td> 16 </td>
          </tr>
          <tr>
            <td> MotorVehicleSaleInvoice </td>
            <td> 机动车销售统一发票 </td>
            <td> 12 </td>
          </tr>
          <tr>
            <td> UsedCarPurchaseInvoice </td>
            <td> 二手车销售统一发票 </td>
            <td> 12 </td>
          </tr>
          <tr>
            <td> VatInvoiceRoll </td>
            <td> 增值税普通发票(卷票) </td>
            <td> 11 </td>
          </tr>
          <tr>
            <td> TaxiTicket </td>
            <td> 出租车发票 </td>
            <td> 0 </td>
          </tr>
          <tr>
            <td> QuotaInvoice </td>
            <td> 定额发票 </td>
            <td> 1 </td>
          </tr>
          <tr>
            <td> TrainTicket </td>
            <td> 火车票 </td>
            <td> 2 </td>
          </tr>
          <tr>
            <td> AirTransport </td>
            <td> 机票行程单 </td>
            <td> 5 </td>
          </tr>
          <tr>
            <td> MachinePrintedInvoice </td>
            <td> 通用机打发票 </td>
            <td> 8 </td>
          </tr>
          <tr>
            <td> BusInvoice </td>
            <td> 汽车票 </td>
            <td> 9 </td>
          </tr>
          <tr>
            <td> ShippingInvoice </td>
            <td> 轮船票 </td>
            <td> 10 </td>
          </tr>
          <tr>
            <td> NonTaxIncomeGeneralBill </td>
            <td> 非税收入通用票据 </td>
            <td> 15 </td>
          </tr>
          <tr>
            <td> NonTaxIncomeElectronicBill </td>
            <td> 非税收入一般缴款书(电子) </td>
            <td> 15 </td>
          </tr>
          <tr>
            <td> TollInvoice </td>
            <td> 过路过桥费发票 </td>
            <td> 13 </td>
          </tr>
          <tr>
            <td> MedicalOutpatientInvoice </td>
            <td> 医疗门诊收费票据（电子） </td>
            <td> 17 </td>
          </tr>
          <tr>
            <td> MedicalHospitalizedInvoice </td>
            <td> 医疗住院收费票据（电子） </td>
            <td> 17 </td>
          </tr>
          <tr>
            <td> OtherInvoice </td>
            <td> 其他发票 </td>
            <td> -1 </td>
          </tr>
        </tbody>
      </table>
       */
  async RecognizeGeneralInvoice(req, cb) {
    return this.request('RecognizeGeneralInvoice', req, cb);
  }
  /**
       * 本接口支持行驶证主页和副页所有字段的自动定位与识别。
  
  行驶证主页：车牌号码、车辆类型、所有人、住址、使用性质、品牌型号、识别代码、发动机号、注册日期、发证日期、发证单位。
  
  行驶证副页：号牌号码、档案编号、核定载人数、总质量、整备质量、核定载质量、外廓尺寸、准牵引总质量、备注、检验记录。
  
  另外，本接口还支持复印件、翻拍告警功能。
  
  默认接口请求频率限制：10次/秒。
       */
  async VehicleLicenseOCR(req, cb) {
    return this.request('VehicleLicenseOCR', req, cb);
  }
}
