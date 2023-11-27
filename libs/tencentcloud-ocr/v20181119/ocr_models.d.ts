/**
 * 非税收入条目
 */
export interface NonTaxItem {
    /**
      * 项目编码
      */
    ItemID?: string;
    /**
      * 项目名称
      */
    Name?: string;
    /**
      * 单位
      */
    Unit?: string;
    /**
      * 数量
      */
    Quantity?: string;
    /**
      * 标准
      */
    Standard?: string;
    /**
      * 金额
      */
    Total?: string;
}
/**
 * 运单识别结果
 */
export interface TextWaybill {
    /**
      * 收件人姓名
      */
    RecName: WaybillObj;
    /**
      * 收件人手机号
      */
    RecNum: WaybillObj;
    /**
      * 收件人地址
      */
    RecAddr: WaybillObj;
    /**
      * 寄件人姓名
      */
    SenderName: WaybillObj;
    /**
      * 寄件人手机号
      */
    SenderNum: WaybillObj;
    /**
      * 寄件人地址
      */
    SenderAddr: WaybillObj;
    /**
      * 运单号
      */
    WaybillNum: WaybillObj;
}
/**
 * RecognizeOnlineTaxiItineraryOCR返回参数结构体
 */
export interface RecognizeOnlineTaxiItineraryOCRResponse {
    /**
      * 网约车行程单识别结果，具体内容请点击左侧链接。
      */
    OnlineTaxiItineraryInfos?: Array<OnlineTaxiItineraryInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 混贴票据单张发票识别信息
 */
export interface InvoiceItem {
    /**
      * 识别结果。
OK：表示识别成功；FailedOperation.UnsupportedInvioce：表示不支持识别；
FailedOperation.UnKnowError：表示识别失败；
其它错误码见各个票据接口的定义。
      */
    Code: string;
    /**
      * 识别出的图片所属的票据类型。
-1：未知类型
0：出租车发票
1：定额发票
2：火车票
3：增值税发票
5：机票行程单
8：通用机打发票
9：汽车票
10：轮船票
11：增值税发票（卷票）
12：购车发票
13：过路过桥费发票
15：非税发票
16：全电发票
      */
    Type: number;
    /**
      * 旋转后的图片四点坐标。
      */
    Polygon: Polygon;
    /**
      * 识别出的图片在混贴票据图片中的旋转角度。
      */
    Angle: number;
    /**
      * 识别到的内容。
      */
    SingleInvoiceInfos: SingleInvoiceItem;
    /**
      * 发票处于识别图片或PDF文件中的页教，默认从1开始。
      */
    Page?: number;
    /**
      * 发票详细类型，详见下方 SubType 返回值说明
      */
    SubType?: string;
    /**
      * 发票类型描述，详见下方 TypeDescription  返回值说明
      */
    TypeDescription?: string;
    /**
      * 切割单图文件，Base64编码后的切图后的图片文件，开启 EnableCutImage 后进行返回
      */
    CutImage?: string;
    /**
      * 发票详细类型描述，详见下方 SubType 返回值说明
      */
    SubTypeDescription?: string;
}
/**
 * BankSlipOCR请求参数结构体
 */
export interface BankSlipOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * BusinessCardOCR返回参数结构体
 */
export interface BusinessCardOCRResponse {
    /**
      * 名片识别结果，具体内容请点击左侧链接。
      */
    BusinessCardInfos: Array<BusinessCardInfo>;
    /**
      * 返回图像预处理后的图片，图像预处理未开启时返回内容为空。
      */
    RetImageBase64: string;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angle: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 算式识别结果
 */
export interface TextArithmetic {
    /**
      * 识别出的文本行内容
      */
    DetectedText: string;
    /**
      * 算式运算结果，true-正确   false-错误或非法参数
      */
    Result: boolean;
    /**
      * 保留字段，暂不支持
      */
    Confidence: number;
    /**
      * 原图文本行坐标，以四个顶点坐标表示（保留字段，暂不支持）
注意：此字段可能返回 null，表示取不到有效值。
      */
    Polygon: Array<Coord>;
    /**
      * 保留字段，暂不支持
      */
    AdvancedInfo: string;
    /**
      * 文本行旋转纠正之后在图像中的像素坐标，表示为（左上角x, 左上角y，宽width，高height）
      */
    ItemCoord: ItemCoord;
    /**
      * 算式题型编号：
‘1’: 加减乘除四则
‘2’: 加减乘除已知结果求运算因子
‘3’: 判断大小
‘4’: 约等于估算
‘5’: 带余数除法
‘6’: 分数四则运算
‘7’: 单位换算
‘8’: 竖式加减法
‘9’: 竖式乘除法
‘10’: 脱式计算
‘11’: 解方程
      */
    ExpressionType: string;
    /**
      * 错题推荐答案，算式运算结果正确返回为""，算式运算结果错误返回推荐答案 (注：暂不支持多个关系运算符（如1<10<7）、无关系运算符（如frac(1,2)+frac(2,3)）、单位换算（如1元=100角）错题的推荐答案返回)
      */
    Answer: string;
}
/**
 * HKIDCardOCR请求参数结构体
 */
export interface HKIDCardOCRRequest {
    /**
      * 是否鉴伪。
      */
    DetectFake: boolean;
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage: boolean;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 3M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * CarInvoiceOCR请求参数结构体
 */
export interface CarInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * 混贴票据单张发票识别信息
 */
export interface MixedInvoiceItem {
    /**
      * 识别结果。
OK：表示识别成功；FailedOperation.UnsupportedInvioce：表示不支持识别；
FailedOperation.UnKnowError：表示识别失败；
其它错误码见各个票据接口的定义。
      */
    Code: string;
    /**
      * 识别出的图片所属的票据类型。
-1：未知类型
0：出租车发票
1：定额发票
2：火车票
3：增值税发票
5：机票行程单
8：通用机打发票
9：汽车票
10：轮船票
11：增值税发票（卷票）
12：购车发票
13：过路过桥费发票
15：非税发票
16：全电发票
      */
    Type: number;
    /**
      * 识别出的图片在混贴票据图片中的位置信息。与Angel结合可以得出原图位置，组成RotatedRect((X+0.5\*Width,Y+0.5\*Height), (Width, Height), Angle)，详情可参考OpenCV文档。
      */
    Rect: Rect;
    /**
      * 识别出的图片在混贴票据图片中的旋转角度。
      */
    Angle: number;
    /**
      * 识别到的内容。
      */
    SingleInvoiceInfos: Array<SingleInvoiceInfo>;
    /**
      * 发票处于识别图片或PDF文件中的页教，默认从1开始。
      */
    Page?: number;
}
/**
 * RecognizeTravelCardOCR请求参数结构体
 */
export interface RecognizeTravelCardOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * TrainTicketOCR请求参数结构体
 */
export interface TrainTicketOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * EstateCertOCR返回参数结构体
 */
export interface EstateCertOCRResponse {
    /**
      * 权利人
      */
    Obligee: string;
    /**
      * 共有情况
      */
    Ownership: string;
    /**
      * 坐落
      */
    Location: string;
    /**
      * 不动产单元号
      */
    Unit: string;
    /**
      * 权利类型
      */
    Type: string;
    /**
      * 权利性质
      */
    Property: string;
    /**
      * 用途
      */
    Usage: string;
    /**
      * 面积
      */
    Area: string;
    /**
      * 使用期限
      */
    Term: string;
    /**
      * 权利其他状况，多行会用换行符\n连接。
      */
    Other: string;
    /**
      * 图片旋转角度
      */
    Angle: number;
    /**
      * 不动产权号
      */
    Number: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * FlightInvoiceOCR请求参数结构体
 */
export interface FlightInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * RecognizePhilippinesDrivingLicenseOCR请求参数结构体
 */
export interface RecognizePhilippinesDrivingLicenseOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage?: boolean;
}
/**
 * 还原文本信息
 */
export interface WordItem {
    /**
      * 文本块内容
      */
    DetectedText?: string;
    /**
      * 四点坐标
      */
    Coord?: Polygon;
}
/**
 * MLIDPassportOCR请求参数结构体
 */
export interface MLIDPassportOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
      */
    ImageBase64: string;
    /**
      * 是否返回图片，默认false
      */
    RetImage?: boolean;
}
/**
 * 智能结构化元素组
 */
export interface ItemInfo {
    /**
      * key信息组
注意：此字段可能返回 null，表示取不到有效值。
      */
    Key?: Key;
    /**
      * Value信息组
注意：此字段可能返回 null，表示取不到有效值。
      */
    Value?: Value;
}
/**
 * SmartStructuralOCRV2请求参数结构体
 */
export interface SmartStructuralOCRV2Request {
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
    /**
      * 自定义结构化功能需返回的字段名称，例：
若客户只想返回姓名、性别两个字段的识别结果，则输入
ItemNames=["姓名","性别"]
      */
    ItemNames?: Array<string>;
    /**
      * 是否开启全文字段识别
      */
    ReturnFullText?: boolean;
}
/**
 * TextDetect返回参数结构体
 */
export interface TextDetectResponse {
    /**
      * 图片中是否包含文字。
      */
    HasText: boolean;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * TollInvoiceOCR返回参数结构体
 */
export interface TollInvoiceOCRResponse {
    /**
      * 过路过桥费发票识别结果，具体内容请点击左侧链接。
      */
    TollInvoiceInfos?: Array<TollInvoiceInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VerifyBizLicense返回参数结构体
 */
export interface VerifyBizLicenseResponse {
    /**
      * 状态码
      */
    ErrorCode?: number;
    /**
      * 统一社会信用代码
      */
    CreditCode?: string;
    /**
      * 组织机构代码
      */
    OrgCode?: string;
    /**
      * 经营期限自（YYYY-MM-DD）
      */
    OpenFrom?: string;
    /**
      * 经营期限至（YYYY-MM-DD）
      */
    OpenTo?: string;
    /**
      * 法人姓名
      */
    FrName?: string;
    /**
      * 经营状态，包括：成立、筹建、存续、在营、开业、在册、正常经营、开业登记中、登记成立、撤销、撤销登记、非正常户、告解、个体暂时吊销、个体转企业、吊销（未注销）、拟注销、已注销、（待）迁入、（待）迁出、停业、歇业、清算等。
      */
    EnterpriseStatus?: string;
    /**
      * 经营（业务）范围及方式
      */
    OperateScopeAndForm?: string;
    /**
      * 注册资金（单位:万元）
      */
    RegCap?: string;
    /**
      * 注册币种
      */
    RegCapCur?: string;
    /**
      * 登记机关
      */
    RegOrg?: string;
    /**
      * 开业日期（YYYY-MM-DD）
      */
    EsDate?: string;
    /**
      * 企业（机构）类型
      */
    EnterpriseType?: string;
    /**
      * 注销日期
      */
    CancelDate?: string;
    /**
      * 吊销日期
      */
    RevokeDate?: string;
    /**
      * 许可经营项目
      */
    AbuItem?: string;
    /**
      * 一般经营项目
      */
    CbuItem?: string;
    /**
      * 核准时间
      */
    ApprDate?: string;
    /**
      * 省（返回空值）
      */
    Province?: string;
    /**
      * 地级市（返回空值）
      */
    City?: string;
    /**
      * 区\县（返回空值）
      */
    County?: string;
    /**
      * 住所所在行政区划代码（返回空值）
      */
    AreaCode?: string;
    /**
      * 行业门类代码（返回空值）
      */
    IndustryPhyCode?: string;
    /**
      * 行业门类名称（返回空值）
      */
    IndustryPhyName?: string;
    /**
      * 国民经济行业代码（返回空值）
      */
    IndustryCode?: string;
    /**
      * 国民经济行业名称（返回空值）
      */
    IndustryName?: string;
    /**
      * 经营（业务）范围
      */
    OperateScope?: string;
    /**
      * 要核验的工商注册号
      */
    VerifyRegNo?: string;
    /**
      * 工商注册号
      */
    RegNo?: string;
    /**
      * 要核验的企业名称
      */
    VerifyEnterpriseName?: string;
    /**
      * 企业名称
      */
    EnterpriseName?: string;
    /**
      * 要核验的注册地址
      */
    VerifyAddress?: string;
    /**
      * 注册地址
      */
    Address?: string;
    /**
      * 验证结果
      */
    RegNumResult?: BizLicenseVerifyResult;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * FinanBillSliceOCR返回参数结构体
 */
export interface FinanBillSliceOCRResponse {
    /**
      * 金融票据切片识别结果，具体内容请点击左侧链接。
      */
    FinanBillSliceInfos?: Array<FinanBillSliceInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * DriverLicenseOCR返回参数结构体
 */
export interface DriverLicenseOCRResponse {
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 性别
      */
    Sex?: string;
    /**
      * 国籍
      */
    Nationality?: string;
    /**
      * 住址
      */
    Address?: string;
    /**
      * 出生日期（YYYY-MM-DD）
      */
    DateOfBirth?: string;
    /**
      * 初次领证日期（YYYY-MM-DD）
      */
    DateOfFirstIssue?: string;
    /**
      * 准驾车型
      */
    Class?: string;
    /**
      * 有效期开始时间（YYYY-MM-DD）
      */
    StartDate?: string;
    /**
      * 有效期截止时间（新版驾驶证返回 YYYY-MM-DD，
老版驾驶证返回有效期限 X年）
      */
    EndDate?: string;
    /**
      * 证号
      */
    CardCode?: string;
    /**
      * 档案编号
      */
    ArchivesCode?: string;
    /**
      * 记录
      */
    Record?: string;
    /**
      * Code 告警码列表和释义：
-9102  复印件告警
-9103  翻拍件告警
-9106  ps告警
注：告警码可以同时存在多个
      */
    RecognizeWarnCode?: Array<number>;
    /**
      * 告警码说明：
WARN_DRIVER_LICENSE_COPY_CARD 复印件告警
WARN_DRIVER_LICENSE_SCREENED_CARD 翻拍件告警
WARN_DRIVER_LICENSE_PS_CARD ps告警
注：告警信息可以同时存在多个
      */
    RecognizeWarnMsg?: Array<string>;
    /**
      * 发证单位
      */
    IssuingAuthority?: string;
    /**
      * 状态（仅电子驾驶证支持返回该字段）
      */
    State?: string;
    /**
      * 累积记分（仅电子驾驶证支持返回该字段）
      */
    CumulativeScore?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * WaybillOCR返回参数结构体
 */
export interface WaybillOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    TextDetections?: TextWaybill;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * CreateAIFormTask请求参数结构体
 */
export interface CreateAIFormTaskRequest {
    /**
      * 多个文件的URL列表
      */
    FileList: Array<SmartFormFileUrl>;
    /**
      * 备注信息1
      */
    FirstNotes?: string;
    /**
      * 备注信息2
      */
    SecondNotes?: string;
    /**
      * 文件类型
      */
    FileType?: number;
}
/**
 * 识别出来的单词信息包括单词（包括单词Character和单词置信度confidence）
 */
export interface Words {
    /**
      * 置信度 0 ~100
      */
    Confidence: number;
    /**
      * 候选字Character
      */
    Character: string;
}
/**
 * VerifyBizLicense请求参数结构体
 */
export interface VerifyBizLicenseRequest {
    /**
      * 用于入参是营业执照图片的场景，ImageBase64和ImageUrl必须提供一个，如果都提供，只使用 ImageUrl。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
      */
    ImageBase64?: string;
    /**
      * 用于入参是营业执照图片的场景，ImageBase64和ImageUrl必须提供一个，如果都提供，只使用 ImageUrl。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
      */
    ImageUrl?: string;
    /**
      * 用于入参是营业执照图片的场景，表示需要校验的参数：RegNum（注册号或者统一社会信用代码），Name（企业名称），Address（经营地址）。选择后会返回相关参数校验结果。RegNum为必选，Name和Address可选。
格式为{RegNum: true, Name:true/false, Address:true/false}

设置方式参考：
Config = Json.stringify({"Name":true,"Address":true})
API 3.0 Explorer 设置方式参考：
Config = {"Name":true,"Address":true}
      */
    ImageConfig?: string;
    /**
      * 用于入参是文本的场景，RegNum表示注册号或者统一社会信用代码。若没有传入营业执照图片，则RegNum为必选项，若图片和RegNum都传入，则只使用RegNum。
      */
    RegNum?: string;
    /**
      * 用于入参是文本的场景，Name表示企业名称。Name为可选项，填写后会返回Name的校验结果。
      */
    Name?: string;
    /**
      * 用于入参是文本的场景，Address表示经营地址，填写后会返回Address的校验结果。
      */
    Address?: string;
}
/**
 * 英文识别结果
 */
export interface TextDetectionEn {
    /**
      * 识别出的文本行内容。
      */
    DetectedText: string;
    /**
      * 置信度 0 ~100。
      */
    Confidence: number;
    /**
      * 文本行在原图中的四点坐标。
注意：此字段可能返回 null，表示取不到有效值。
      */
    Polygon: Array<Coord>;
    /**
      * 此字段为扩展字段。目前EnglishOCR接口返回内容为空。
      */
    AdvancedInfo: string;
    /**
      * 英文单词在原图中的四点坐标。
      */
    WordCoordPoint: Array<WordCoordPoint>;
    /**
      * 候选字符集(包含候选字Character以及置信度Confidence)。
      */
    CandWord: Array<CandWord>;
    /**
      * 识别出来的单词信息（包括单词Character和单词置信度confidence）
      */
    Words: Array<Words>;
}
/**
 * PermitOCR返回参数结构体
 */
export interface PermitOCRResponse {
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 英文姓名
      */
    EnglishName?: string;
    /**
      * 证件号
      */
    Number?: string;
    /**
      * 性别
      */
    Sex?: string;
    /**
      * 有效期限
      */
    ValidDate?: string;
    /**
      * 签发机关
      */
    IssueAuthority?: string;
    /**
      * 签发地点
      */
    IssueAddress?: string;
    /**
      * 出生日期
      */
    Birthday?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * InvoiceGeneralOCR请求参数结构体
 */
export interface InvoiceGeneralOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * 矩形坐标
 */
export interface Rect {
    /**
      * 左上角x
      */
    X: number;
    /**
      * 左上角y
      */
    Y: number;
    /**
      * 宽度
      */
    Width: number;
    /**
      * 高度
      */
    Height: number;
}
/**
 * 全部车牌信息
 */
export interface LicensePlateInfo {
    /**
      * 识别出的车牌号码。
      */
    Number: string;
    /**
      * 置信度，0 - 100 之间。
      */
    Confidence: number;
    /**
      * 文本行在原图片中的像素坐标框。
      */
    Rect: Rect;
    /**
      * 识别出的车牌颜色，目前支持颜色包括 “白”、“黑”、“蓝”、“绿“、“黄”、“黄绿”、“临牌”。
      */
    Color: string;
}
/**
 * RideHailingTransportLicenseOCR请求参数结构体
 */
export interface RideHailingTransportLicenseOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。图片下载时间不超过 3 秒。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
}
/**
 * 增值税普通发票（卷票）条目
 */
export interface VatRollItem {
    /**
      * 项目名称
      */
    Name?: string;
    /**
      * 数量
      */
    Quantity?: string;
    /**
      * 单价
      */
    Price?: string;
    /**
      * 金额
      */
    Total?: string;
}
/**
 * 数学公式识别结果
 */
export interface TextFormula {
    /**
      * 识别出的文本行内容
      */
    DetectedText: string;
}
/**
 * HmtResidentPermitOCR返回参数结构体
 */
export interface HmtResidentPermitOCRResponse {
    /**
      * 证件姓名
      */
    Name?: string;
    /**
      * 性别
      */
    Sex?: string;
    /**
      * 出生日期
      */
    Birth?: string;
    /**
      * 地址
      */
    Address?: string;
    /**
      * 身份证号
      */
    IdCardNo?: string;
    /**
      * 0-正面
1-反面
      */
    CardType?: number;
    /**
      * 证件有效期限
      */
    ValidDate?: string;
    /**
      * 签发机关
      */
    Authority?: string;
    /**
      * 签发次数
      */
    VisaNum?: string;
    /**
      * 通行证号码
      */
    PassNo?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 增值税发票项目明细
 */
export interface VatInvoiceItem {
    /**
      * 行号
      */
    LineNo: string;
    /**
      * 名称
      */
    Name: string;
    /**
      * 规格
      */
    Spec: string;
    /**
      * 单位
      */
    Unit: string;
    /**
      * 数量
      */
    Quantity: string;
    /**
      * 单价
      */
    UnitPrice: string;
    /**
      * 不含税金额
      */
    AmountWithoutTax: string;
    /**
      * 税率
      */
    TaxRate: string;
    /**
      * 税额
      */
    TaxAmount: string;
    /**
      * 税收分类编码
      */
    TaxClassifyCode: string;
    /**
      * 运输工具类型
      */
    VehicleType?: string;
    /**
      * 运输工具牌号
      */
    VehicleBrand?: string;
    /**
      * 起始地
      */
    DeparturePlace?: string;
    /**
      * 到达地
      */
    ArrivalPlace?: string;
    /**
      * 运输货物名称
      */
    TransportItemsName?: string;
    /**
      * 建筑服务发生地
      */
    ConstructionPlace?: string;
    /**
      * 建筑项目名称
      */
    ConstructionName?: string;
}
/**
 * 机动车登记证书识别结果
 */
export interface VehicleRegCertInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
【注册登记页】
车辆型号、车辆识别代号/车架号、发动机号、制造厂名称、轴距、轮胎数、总质量、外廓尺寸、轴数、车辆出厂日期、发证日期、使用性质、车辆获得方式、车辆类型、国产/进口、燃料种类、车身颜色、发动机型号、车辆品牌、编号、转向形式、
机动车所有人1、身份证明名称1、号码1、登记机关1、登记日期1
机动车所有人2、身份证明名称2、号码2、登记机关2、登记日期2
机动车所有人3、身份证明名称3、号码3、登记机关3、登记日期3
机动车所有人4、身份证明名称4、号码4、登记机关4、登记日期4
机动车所有人5、身份证明名称5、号码5、登记机关5、登记日期5
机动车所有人6、身份证明名称6、号码6、登记机关6、登记日期6
机动车所有人7、身份证明名称7、号码7、登记机关7、登记日期7
【抵押登记页】
机动车登记证书编号、身份证明名称/号码、抵押权人姓名/名称、抵押登记日期。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段name对应的字符串结果。
      */
    Value: string;
}
/**
 * 机票行程卡条目
 */
export interface FlightItem {
    /**
      * 出发航站楼
      */
    TerminalGetOn?: string;
    /**
      * 到达航站楼
      */
    TerminalGetOff?: string;
    /**
      * 承运人
      */
    Carrier?: string;
    /**
      * 航班号
      */
    FlightNumber?: string;
    /**
      * 座位等级
      */
    Seat?: string;
    /**
      * 乘机日期
      */
    DateGetOn?: string;
    /**
      * 乘机时间
      */
    TimeGetOn?: string;
    /**
      * 出发站
      */
    StationGetOn?: string;
    /**
      * 到达站
      */
    StationGetOff?: string;
    /**
      * 免费行李
      */
    Allow?: string;
    /**
      * 客票级别/客票类别
      */
    FareBasis?: string;
}
/**
 * value信息组
 */
export interface Value {
    /**
      * 自动识别的字段内容
      */
    AutoContent?: string;
    /**
      * 四点坐标
注意：此字段可能返回 null，表示取不到有效值。
      */
    Coord?: Polygon;
}
/**
 * EnterpriseLicenseOCR返回参数结构体
 */
export interface EnterpriseLicenseOCRResponse {
    /**
      * 企业证照识别结果，具体内容请点击左侧链接。
      */
    EnterpriseLicenseInfos?: Array<EnterpriseLicenseInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 印章信息
 */
export interface SealInfo {
    /**
      * 印章主体内容
      */
    SealBody: string;
    /**
      * 印章坐标
      */
    Location: Rect;
    /**
      * 印章其它文本内容
      */
    OtherTexts: Array<string>;
    /**
      * 印章类型，表示为:
圆形印章：0
椭圆形印章：1
方形印章：2
菱形印章：3
三角形印章：4
      */
    SealShape: string;
}
/**
 * RecognizePhilippinesVoteIDOCR请求参数结构体
 */
export interface RecognizePhilippinesVoteIDOCRRequest {
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage: boolean;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 通用机打发票信息
 */
export interface InvoiceGeneralInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段识别（注：下划线表示一个字段）：
发票代码、发票号码、日期、合计金额(小写)、合计金额(大写)、购买方识别号、销售方识别号、校验码、购买方名称、销售方名称、时间、种类、发票消费类型、省、市、是否有公司印章、发票名称、<span style="text-decoration:underline">购买方地址、电话</span>、<span style="text-decoration:underline">销售方地址、电话</span>、购买方开户行及账号、销售方开户行及账号、经办人取票用户、经办人支付信息、经办人商户号、经办人订单号、<span style="text-decoration:underline">货物或应税劳务、服务名称</span>、数量、单价、税率、税额、金额、单位、规格型号、合计税额、合计金额、备注、收款人、复核、开票人、密码区、行业分类
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * 增值税发票识别结果
 */
export interface TextVatInvoice {
    /**
      * 识别出的字段名称（关键字）。支持以下字段的识别：
发票代码、 发票号码、 打印发票代码、 打印发票号码、 开票日期、 购买方识别号、 小写金额、 价税合计(大写)、 销售方识别号、 校验码、 购买方名称、 销售方名称、 税额、 复核、 联次名称、 备注、 联次、 密码区、 开票人、 收款人、 （货物或应税劳务、服务名称）、省、 市、 服务类型、 通行费标志、 是否代开、 是否收购、 合计金额、 是否有公司印章、 发票消费类型、 车船税、 机器编号、 成品油标志、 税率、 合计税额、 （购买方地址、电话）、 （销售方地址、电话）、 单价、 金额、 销售方开户行及账号、 购买方开户行及账号、 规格型号、 发票名称、 单位、 数量、 校验码备选、 校验码后六位备选、发票号码备选、车牌号、类型、通行日期起、通行日期止、发票类型。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 字段在原图中的中的四点坐标。
注意：此字段可能返回 null，表示取不到有效值。
注意：此字段可能返回 null，表示取不到有效值。
      */
    Polygon: Polygon;
}
/**
 * InstitutionOCR返回参数结构体
 */
export interface InstitutionOCRResponse {
    /**
      * 注册号
      */
    RegId?: string;
    /**
      * 有效期
      */
    ValidDate?: string;
    /**
      * 住所
      */
    Location?: string;
    /**
      * 名称
      */
    Name?: string;
    /**
      * 法定代表人
      */
    LegalPerson?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 机动车销售统一发票信息
 */
export interface VehicleInvoiceInfo {
    /**
      * 车辆类型
      */
    CarType: string;
    /**
      * 厂牌型号
      */
    PlateModel: string;
    /**
      * 产地
      */
    ProduceAddress: string;
    /**
      * 合格证号
      */
    CertificateNo: string;
    /**
      * 进口证明书号
      */
    ImportNo: string;
    /**
      * LSVCA2NP9HN0xxxxx
      */
    VinNo: string;
    /**
      * 完税证书号
      */
    PayTaxesNo: string;
    /**
      * 吨位
      */
    Tonnage: string;
    /**
      * 限乘人数
      */
    LimitCount: string;
    /**
      * 发动机号码
      */
    EngineNo: string;
    /**
      * 商检单号
      */
    BizCheckFormNo: string;
    /**
      * 主管税务机关代码
      */
    TaxtationOrgCode: string;
    /**
      * 主管税务机关名称
      */
    TaxtationOrgName: string;
    /**
      * 税率
      */
    MotorTaxRate: string;
    /**
      * 开户行
      */
    MotorBankName: string;
    /**
      * 账号
      */
    MotorBankAccount: string;
    /**
      * 销售地址
      */
    SellerAddress: string;
    /**
      * 销售电话
      */
    SellerTel: string;
    /**
      * 购方身份证
      */
    BuyerNo: string;
}
/**
 * DriverLicenseOCR请求参数结构体
 */
export interface DriverLicenseOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。图片下载时间不超过 3 秒。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * FRONT 为驾驶证主页正面（有红色印章的一面），
BACK 为驾驶证副页正面（有档案编号的一面）。
默认值为：FRONT。
      */
    CardSide?: string;
}
/**
 * 验真接口
 */
export interface BizLicenseVerifyResult {
    /**
      * “0“：一致
“-1”：不一致
      */
    RegNum: string;
    /**
      * “0“：一致
“-1”：不一致
“”：不验真
      */
    Name: string;
    /**
      * “0“：一致
“-1”：不一致
“”：不验真
      */
    Address: string;
}
/**
 * 文字识别结果
 */
export interface TextDetection {
    /**
      * 识别出的文本行内容
      */
    DetectedText: string;
    /**
      * 置信度 0 ~100
      */
    Confidence: number;
    /**
      * 文本行坐标，以四个顶点坐标表示
注意：此字段可能返回 null，表示取不到有效值。
      */
    Polygon: Array<Coord>;
    /**
      * 此字段为扩展字段。
GeneralBasicOcr接口返回段落信息Parag，包含ParagNo。
      */
    AdvancedInfo: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标，表示为（左上角x, 左上角y，宽width，高height）
      */
    ItemPolygon: ItemCoord;
    /**
      * 识别出来的单字信息包括单字（包括单字Character和单字置信度confidence）， 支持识别的接口：GeneralBasicOCR、GeneralAccurateOCR
      */
    Words: Array<DetectedWords>;
    /**
      * 单字在原图中的四点坐标， 支持识别的接口：GeneralBasicOCR、GeneralAccurateOCR
      */
    WordCoordPoint: Array<DetectedWordCoordPoint>;
}
/**
 * RecognizeTableOCR返回参数结构体
 */
export interface RecognizeTableOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    TableDetections?: Array<TableDetectInfo>;
    /**
      * Base64 编码后的 Excel 数据。
      */
    Data?: string;
    /**
      * 图片为PDF时，返回PDF的总页数，默认为0
      */
    PdfPageSize?: number;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，统一以逆时针方向旋转，逆时针为负，角度范围为-360°至0°。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 数学试题识别结果
 */
export interface TextEduPaper {
    /**
      * 识别出的字段名称（关键字）
      */
    Item: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Item对应的字符串结果
      */
    DetectedText: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标，表示为（左上角x, 左上角y，宽width，高height）
      */
    Itemcoord: ItemCoord;
}
/**
 * 增值税发票项目信息
 */
export interface VatInvoiceItemInfo {
    /**
      * 项目名称
      */
    Name?: string;
    /**
      * 规格型号
      */
    Specification?: string;
    /**
      * 单位
      */
    Unit?: string;
    /**
      * 数量
      */
    Quantity?: string;
    /**
      * 单价
      */
    Price?: string;
    /**
      * 金额
      */
    Total?: string;
    /**
      * 税率
      */
    TaxRate?: string;
    /**
      * 税额
      */
    Tax?: string;
    /**
      * 通行日期起
      */
    DateStart?: string;
    /**
      * 通行日期止
      */
    DateEnd?: string;
    /**
      * 车牌号
      */
    LicensePlate?: string;
    /**
      * 车辆类型
      */
    VehicleType?: string;
}
/**
 * QrcodeOCR返回参数结构体
 */
export interface QrcodeOCRResponse {
    /**
      * 二维码/条形码识别结果信息，具体内容请点击左侧链接。
      */
    CodeResults?: Array<QrcodeResultsInfo>;
    /**
      * 图片大小，具体内容请点击左侧链接。
      */
    ImgSize?: QrcodeImgSize;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 运单识别对象
 */
export interface WaybillObj {
    /**
      * 识别出的文本行内容
      */
    Text: string;
}
/**
 * 英文OCR识别出的单词在原图中的四点坐标数组
 */
export interface WordCoordPoint {
    /**
      * 英文OCR识别出的每个单词在原图中的四点坐标。
      */
    WordCoordinate: Array<Coord>;
}
/**
 * 票据检测结果
 */
export interface InvoiceDetectInfo {
    /**
      * 识别出的图片在混贴票据图片中的旋转角度。
      */
    Angle: number;
    /**
      * 识别出的图片所属的票据类型。
-1：未知类型
0：出租车发票
1：定额发票
2：火车票
3：增值税发票
4：客运限额发票
5：机票行程单
6：酒店账单
7：完税证明
8：通用机打发票
9：汽车票
10：轮船票
11：增值税发票（卷票 ）
12：购车发票
13：过路过桥费发票
14：购物小票
      */
    Type: number;
    /**
      * 识别出的图片在混贴票据图片中的位置信息。与Angel结合可以得出原图位置，组成RotatedRect((X+0.5\*Width,Y+0.5\*Height), (Width, Height), Angle)，详情可参考OpenCV文档。
      */
    Rect: Rect;
    /**
      * 入参 ReturnImage 为 True 时返回 Base64 编码后的图片。
注意：此字段可能返回 null，表示取不到有效值。
      */
    Image: string;
}
/**
 * MainlandPermitOCR请求参数结构体
 */
export interface MainlandPermitOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否返回头像。默认不返回。
      */
    RetProfile?: boolean;
}
/**
 * 电子发票详细条目信息
 */
export interface VatElectronicItemInfo {
    /**
      * 项目名称
      */
    Name?: string;
    /**
      * 数量
      */
    Quantity?: string;
    /**
      * 规格型号
      */
    Specification?: string;
    /**
      * 单价
      */
    Price?: string;
    /**
      * 金额
      */
    Total?: string;
    /**
      * 税率
      */
    TaxRate?: string;
    /**
      * 税额
      */
    Tax?: string;
    /**
      * 单位
      */
    Unit?: string;
    /**
      * 运输工具类型
      */
    VehicleType?: string;
    /**
      * 运输工具牌号
      */
    VehicleBrand?: string;
    /**
      * 起始地
      */
    DeparturePlace?: string;
    /**
      * 到达地
      */
    ArrivalPlace?: string;
    /**
      * 运输货物名称，仅货物运输服务发票返回
      */
    TransportItemsName?: string;
    /**
      * 建筑服务发生地，仅建筑发票返回
      */
    PlaceOfBuildingService?: string;
    /**
      * 建筑项目名称，仅建筑发票返回
      */
    BuildingName?: string;
    /**
      * 产权证书/不动产权证号，仅不动产经营租赁服务发票返回
      */
    EstateNumber?: string;
    /**
      * 面积单位，仅不动产经营租赁服务发票返回
      */
    AreaUnit?: string;
}
/**
 * SmartStructuralOCRV2返回参数结构体
 */
export interface SmartStructuralOCRV2Response {
    /**
      * 图片旋转角度(角度制)，文本的水平方向
为 0；顺时针为正，逆时针为负
      */
    Angle?: number;
    /**
      * 配置结构化文本信息
      */
    StructuralList?: Array<GroupInfo>;
    /**
      * 还原文本信息
      */
    WordList?: Array<WordItem>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * EnterpriseLicenseOCR请求参数结构体
 */
export interface EnterpriseLicenseOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * BankCardOCR请求参数结构体
 */
export interface BankCardOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * 是否返回预处理（精确剪裁对齐）后的银行卡图片数据，默认false。
      */
    RetBorderCutImage?: boolean;
    /**
      * 是否返回卡号的切图图片数据，默认false。
      */
    RetCardNoImage?: boolean;
    /**
      * 复印件检测开关，如果输入的图片是银行卡复印件图片则返回告警，默认false。
      */
    EnableCopyCheck?: boolean;
    /**
      * 翻拍检测开关，如果输入的图片是银行卡翻拍图片则返回告警，默认false。
      */
    EnableReshootCheck?: boolean;
    /**
      * 边框遮挡检测开关，如果输入的图片是银行卡边框被遮挡则返回告警，默认false。
      */
    EnableBorderCheck?: boolean;
    /**
      * 是否返回图片质量分数（图片质量分数是评价一个图片的模糊程度的标准），默认false。
      */
    EnableQualityValue?: boolean;
}
/**
 * 智能结构化识别
 */
export interface StructuralItem {
    /**
      * 识别出的字段名称(关键字)。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值。
      */
    Value: string;
    /**
      * 置信度 0 ~100。
      */
    Confidence: number;
    /**
      * 文本行在旋转纠正之后的图像中的像素
坐标。
      */
    ItemCoord: ItemCoord;
    /**
      * 字段所在行号，下标从0开始，非行字段或未能识别行号的该值返回-1。
      */
    Row: number;
}
/**
 * 网约车行程单识别结果
 */
export interface OnlineTaxiItineraryInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
发票代码、 机打代码、 发票号码、 发动机号码、 合格证号、 机打号码、 价税合计(小写)、 销货单位名称、 身份证号码/组织机构代码、 购买方名称、 销售方纳税人识别号、 购买方纳税人识别号、主管税务机关、 主管税务机关代码、 开票日期、 不含税价(小写)、 吨位、增值税税率或征收率、 车辆识别代号/车架号码、 增值税税额、 厂牌型号、 省、 市、 发票消费类型、 销售方电话、 销售方账号、 产地、 进口证明书号、 车辆类型、 机器编号、备注、开票人、限乘人数、商检单号、销售方地址、销售方开户银行、价税合计、发票类型。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段name对应的字符串结果。
      */
    Value: string;
    /**
      * 字段所在行，下标从0开始，非行字段或未能识别行号的返回-1
      */
    Row: number;
}
/**
 * VehicleRegCertOCR请求参数结构体
 */
export interface VehicleRegCertOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * PropOwnerCertOCR返回参数结构体
 */
export interface PropOwnerCertOCRResponse {
    /**
      * 房地产权利人
      */
    Owner?: string;
    /**
      * 共有情况
      */
    Possession?: string;
    /**
      * 登记时间
      */
    RegisterTime?: string;
    /**
      * 规划用途
      */
    Purpose?: string;
    /**
      * 房屋性质
      */
    Nature?: string;
    /**
      * 房地坐落
      */
    Location?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 金融票据整单识别单个字段的内容
 */
export interface FinanBillInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
【进账单】
日期、出票全称、出票账号、出票开户行、收款人全称、收款人账号、收款开户行、大写金额、小写金额、票据种类、票据张数、票据号码；
【支票】
开户银行、支票种类、凭证号码2、日期、大写金额、小写金额、付款行编号、密码、凭证号码1；
【银行承兑汇票】或【商业承兑汇票】
出票日期、行号1、行号2、出票人全称、出票人账号、付款行全称、收款人全称、收款人账号、收款人开户行、出票金额大写、出票金额小写、汇票到期日、付款行行号、付款行地址。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
}
/**
 * TrainTicketOCR返回参数结构体
 */
export interface TrainTicketOCRResponse {
    /**
      * 编号
      */
    TicketNum?: string;
    /**
      * 出发站
      */
    StartStation?: string;
    /**
      * 到达站
      */
    DestinationStation?: string;
    /**
      * 出发时间
      */
    Date?: string;
    /**
      * 车次
      */
    TrainNum?: string;
    /**
      * 座位号
      */
    Seat?: string;
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 票价
      */
    Price?: string;
    /**
      * 席别
      */
    SeatCategory?: string;
    /**
      * 身份证号
      */
    ID?: string;
    /**
      * 发票消费类型：交通
      */
    InvoiceType?: string;
    /**
      * 序列号
      */
    SerialNumber?: string;
    /**
      * 加收票价
      */
    AdditionalCost?: string;
    /**
      * 手续费
      */
    HandlingFee?: string;
    /**
      * 大写金额（票面有大写金额该字段才有值）
      */
    LegalAmount?: string;
    /**
      * 售票站
      */
    TicketStation?: string;
    /**
      * 原票价（一般有手续费的才有原始票价字段）
      */
    OriginalPrice?: string;
    /**
      * 发票类型：火车票、火车票补票、火车票退票凭证
      */
    InvoiceStyle?: string;
    /**
      * 收据号码
      */
    ReceiptNumber?: string;
    /**
      * 仅供报销使用：1为是，0为否
      */
    IsReceipt?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizePhilippinesTinIDOCR返回参数结构体
 */
export interface RecognizePhilippinesTinIDOCRResponse {
    /**
      * 人像照片Base64后的结果
      */
    HeadPortrait: TextDetectionResult;
    /**
      * 编码
      */
    LicenseNumber: TextDetectionResult;
    /**
      * 姓名
      */
    FullName: TextDetectionResult;
    /**
      * 地址
      */
    Address: TextDetectionResult;
    /**
      * 生日
      */
    Birthday: TextDetectionResult;
    /**
      * 发证日期
      */
    IssueDate: TextDetectionResult;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 过路过桥费字段信息
 */
export interface TollInvoiceInfo {
    /**
      * 识别出的字段名称（关键字）。支持以下字段的识别：
发票代码、发票号码、日期、金额、入口、出口、时间、发票消费类型、高速标志。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * 银行回单识别出的字段
 */
export interface BankSlipInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
付款开户行、收款开户行、付款账号、收款账号、回单类型、回单编号、币种、流水号、凭证号码、交易机构、交易金额、手续费、日期等字段信息。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * ArithmeticOCR返回参数结构体
 */
export interface ArithmeticOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    TextDetections?: Array<TextArithmetic>;
    /**
      * 图片横屏的角度(90度或270度)
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * FormulaOCR返回参数结构体
 */
export interface FormulaOCRResponse {
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负
      */
    Angle?: number;
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    FormulaInfos?: Array<TextFormula>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 汽车票字段信息
 */
export interface BusInvoiceInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
发票代码、发票号码、日期、票价、始发地、目的地、姓名、时间、发票消费类型、身份证号、省、市、开票日期、乘车地点、检票口、客票类型、车型、座位号、车次。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * SmartStructuralOCR请求参数结构体
 */
export interface SmartStructuralOCRRequest {
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 自定义结构化功能需返回的字段名称，例：
若客户只想返回姓名、性别两个字段的识别结果，则输入
ItemNames=["姓名","性别"]
      */
    ItemNames?: Array<string>;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
    /**
      * 是否开启全文字段识别，默认值为false，开启后可返回全文字段识别结果。
      */
    ReturnFullText?: boolean;
}
/**
 * 单元格数据
 */
export interface TableCellInfo {
    /**
      * 单元格左上角的列索引
      */
    ColTl: number;
    /**
      * 单元格左上角的行索引
      */
    RowTl: number;
    /**
      * 单元格右下角的列索引
      */
    ColBr: number;
    /**
      * 单元格右下角的行索引
      */
    RowBr: number;
    /**
      * 单元格内识别出的字符串文本，若文本存在多行，以换行符"\n"隔开
      */
    Text: string;
    /**
      * 单元格类型
      */
    Type: string;
    /**
      * 单元格置信度
      */
    Confidence: number;
    /**
      * 单元格在图像中的四点坐标
      */
    Polygon: Array<Coord>;
}
/**
 * GeneralHandwritingOCR请求参数结构体
 */
export interface GeneralHandwritingOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 场景字段，默认不用填写。
可选值:only_hw  表示只输出手写体识别结果，过滤印刷体。
      */
    Scene?: string;
    /**
      * 是否开启单字的四点定位坐标输出，默认值为false。
      */
    EnableWordPolygon?: boolean;
    /**
      * 文本检测开关，默认值为true。
设置为false表示直接进行单行识别，可适用于识别单行手写体签名场景。
      */
    EnableDetectText?: boolean;
}
/**
 * BizLicenseOCR请求参数结构体
 */
export interface BizLicenseOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * MixedInvoiceDetect返回参数结构体
 */
export interface MixedInvoiceDetectResponse {
    /**
      * 检测出的票据类型列表，具体内容请点击左侧链接。
      */
    InvoiceDetectInfos?: Array<InvoiceDetectInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizePhilippinesVoteIDOCR返回参数结构体
 */
export interface RecognizePhilippinesVoteIDOCRResponse {
    /**
      * 人像照片Base64后的结果
      */
    HeadPortrait?: TextDetectionResult;
    /**
      * 菲律宾VoteID的VIN
      */
    VIN?: TextDetectionResult;
    /**
      * 姓名
      */
    FirstName?: TextDetectionResult;
    /**
      * 姓氏
      */
    LastName?: TextDetectionResult;
    /**
      * 出生日期
      */
    Birthday?: TextDetectionResult;
    /**
      * 婚姻状况
      */
    CivilStatus?: TextDetectionResult;
    /**
      * 国籍
      */
    Citizenship?: TextDetectionResult;
    /**
      * 地址
      */
    Address?: TextDetectionResult;
    /**
      * 地区
      */
    PrecinctNo?: TextDetectionResult;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 发票人员信息
 */
export interface VatInvoiceUserInfo {
    /**
      * 名称
      */
    Name: string;
    /**
      * 纳税人识别号
      */
    TaxId: string;
    /**
      * 地 址、电 话
      */
    AddrTel: string;
    /**
      * 开户行及账号
      */
    FinancialAccount: string;
}
/**
 * 通用机打发票条目
 */
export interface GeneralMachineItem {
    /**
      * 项目名称
      */
    Name?: string;
    /**
      * 规格型号
      */
    Specification?: string;
    /**
      * 单位
      */
    Unit?: string;
    /**
      * 数量
      */
    Quantity?: string;
    /**
      * 单价
      */
    Price?: string;
    /**
      * 金额
      */
    Total?: string;
    /**
      * 税率
      */
    TaxRate?: string;
    /**
      * 税额
      */
    Tax?: string;
}
/**
 * GeneralAccurateOCR返回参数结构体
 */
export interface GeneralAccurateOCRResponse {
    /**
      * 检测到的文本信息，包括文本行内容、置信度、文本行坐标以及文本行旋转纠正后的坐标，具体内容请点击左侧链接。
      */
    TextDetections?: Array<TextDetection>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angel?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * HmtResidentPermitOCR请求参数结构体
 */
export interface HmtResidentPermitOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * FRONT：有照片的一面（人像面），
BACK：无照片的一面（国徽面），
该参数如果不填或填错，将为您自动判断正反面。
      */
    CardSide?: string;
}
/**
 * 汽车票
 */
export interface BusInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 乘车时间
      */
    TimeGetOn?: string;
    /**
      * 乘车日期
      */
    DateGetOn?: string;
    /**
      * 出发车站
      */
    StationGetOn?: string;
    /**
      * 到达车站
      */
    StationGetOff?: string;
    /**
      * 票价
      */
    Total?: string;
    /**
      * 姓名
      */
    UserName?: string;
    /**
      * 消费类型
      */
    Kind?: string;
    /**
      * 身份证号
      */
    UserID?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 乘车地点
      */
    PlaceGetOn?: string;
    /**
      * 检票口
      */
    GateNumber?: string;
    /**
      * 客票类型
      */
    TicketType?: string;
    /**
      * 车型
      */
    VehicleType?: string;
    /**
      * 座位号
      */
    SeatNumber?: string;
    /**
      * 车次
      */
    TrainNumber?: string;
}
/**
 * QrcodeOCR请求参数结构体
 */
export interface QrcodeOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，支持PNG、JPG、JPEG格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，支持PNG、JPG、JPEG格式。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
}
/**
 * TaxiInvoiceOCR返回参数结构体
 */
export interface TaxiInvoiceOCRResponse {
    /**
      * 发票代码
      */
    InvoiceNum?: string;
    /**
      * 发票号码
      */
    InvoiceCode?: string;
    /**
      * 日期
      */
    Date?: string;
    /**
      * 金额
      */
    Fare?: string;
    /**
      * 上车时间
      */
    GetOnTime?: string;
    /**
      * 下车时间
      */
    GetOffTime?: string;
    /**
      * 里程
      */
    Distance?: string;
    /**
      * 发票所在地
      */
    Location?: string;
    /**
      * 车牌号
      */
    PlateNumber?: string;
    /**
      * 发票消费类型
      */
    InvoiceType?: string;
    /**
      * 省
注意：此字段可能返回 null，表示取不到有效值。
      */
    Province?: string;
    /**
      * 市
注意：此字段可能返回 null，表示取不到有效值。
      */
    City?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizeGeneralInvoice请求参数结构体
 */
export interface RecognizeGeneralInvoiceRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG、PDF，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
支持的图片像素：需介于20-10000px之间。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG、PDF，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
支持的图片像素：需介于20-10000px之间。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 需要识别的票据类型列表，为空或不填表示识别全部类型。
0：出租车发票
1：定额发票
2：火车票
3：增值税发票
5：机票行程单
8：通用机打发票
9：汽车票
10：轮船票
11：增值税发票（卷票 ）
12：购车发票
13：过路过桥费发票
15：非税发票
16：全电发票
-1：其他发票

默认为空，识别所有类型发票。
当传入单个类型时，图片均采用该票类型进行处理。
暂不支持多个参数进行局部控制。
      */
    Types?: Array<number>;
    /**
      * 是否开启其他票识别，默认值为true，开启后可支持其他发票的智能识别。
      */
    EnableOther?: boolean;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    EnablePdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，传入时仅支持PDF单页识别，当上传文件为PDF且EnablePdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
    /**
      * 是否开启PDF多页识别，默认值为false，开启后可同时支持多页PDF的识别返回，仅支持返回文件前30页。开启后EnablePdf和PdfPageNumber入参不进行控制。
      */
    EnableMultiplePage?: boolean;
    /**
      * 是否返回切割图片base64，默认值为false。
      */
    EnableCutImage?: boolean;
}
/**
 * GeneralBasicOCR返回参数结构体
 */
export interface GeneralBasicOCRResponse {
    /**
      * 检测到的文本信息，包括文本行内容、置信度、文本行坐标以及文本行旋转纠正后的坐标，具体内容请点击左侧链接。
      */
    TextDetections?: Array<TextDetection>;
    /**
      * 检测到的语言类型，目前支持的语言类型参考入参LanguageType说明。
      */
    Language?: string;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angel?: number;
    /**
      * 图片为PDF时，返回PDF的总页数，默认为0
      */
    PdfPageSize?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizeThaiIDCardOCR返回参数结构体
 */
export interface RecognizeThaiIDCardOCRResponse {
    /**
      * 身份证号码
      */
    ID?: string;
    /**
      * 泰文姓名
      */
    ThaiName?: string;
    /**
      * 英文姓名
      */
    EnFirstName?: string;
    /**
      * 地址
      */
    Address?: string;
    /**
      * 出生日期
      */
    Birthday?: string;
    /**
      * 首次领用日期
      */
    IssueDate?: string;
    /**
      * 签发日期
      */
    ExpirationDate?: string;
    /**
      * 英文姓名
      */
    EnLastName?: string;
    /**
      * 证件人像照片抠取
      */
    PortraitImage?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 其他发票
 */
export interface OtherInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 金额
      */
    Total?: string;
    /**
      * 列表
      */
    OtherInvoiceListItems?: Array<OtherInvoiceItem>;
    /**
      * 表格
      */
    OtherInvoiceTableItems?: Array<OtherInvoiceList>;
}
/**
 * 单元格识别结果
 */
export interface CellContent {
    /**
      * 段落编号
注意：此字段可能返回 null，表示取不到有效值。
      */
    ParagNo: number;
    /**
      * 字体大小
注意：此字段可能返回 null，表示取不到有效值。
      */
    WordSize: number;
}
/**
 * RecognizeMedicalInvoiceOCR返回参数结构体
 */
export interface RecognizeMedicalInvoiceOCRResponse {
    /**
      * 识别出的字段信息
      */
    MedicalInvoiceInfos?: Array<MedicalInvoiceInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * MixedInvoiceOCR返回参数结构体
 */
export interface MixedInvoiceOCRResponse {
    /**
      * 混贴票据识别结果，具体内容请点击左侧链接。
      */
    MixedInvoiceItems?: Array<MixedInvoiceItem>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * ClassifyDetectOCR返回参数结构体
 */
export interface ClassifyDetectOCRResponse {
    /**
      * 智能卡证分类结果。当图片类型不支持分类识别或者识别出的类型不在请求参数DiscernType指定的范围内时，返回结果中的Type字段将为空字符串，Name字段将返回"其它"
      */
    ClassifyDetectInfos: Array<ClassifyDetectInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VatInvoiceVerifyNew请求参数结构体
 */
export interface VatInvoiceVerifyNewRequest {
    /**
      * 发票号码，8位、20位（全电票）
      */
    InvoiceNo: string;
    /**
      * 开票日期（不支持当天发票查询，支持五年以内开具的发票），格式：“YYYY-MM-DD”，如：2019-12-20。
      */
    InvoiceDate: string;
    /**
      * 发票代码（10或12 位），全电发票为空。查验未成功超过5次后当日无法再查。
      */
    InvoiceCode?: string;
    /**
      * 票种类型 01:增值税专用发票， 02:货运运输业增值税专用发 票， 03:机动车销售统一发票， 04:增值税普通发票， 08:增值税电子专用发票(含全电)， 10:增值税电子普通发票(含全电)， 11:增值税普通发票(卷式)， 14:增值税电子(通行费)发 票， 15:二手车销售统一发票， 32:深圳区块链发票(云南区块链因业务调整现已下线)。
      */
    InvoiceKind?: string;
    /**
      * 校验码后 6 位，增值税普通发票、增值税电子普通发票、增值税普通发票(卷式)、增值税电子普通发票(通行费)时必填;
区块链为 5 位
      */
    CheckCode?: string;
    /**
      * 不含税金额，增值税专用发票、增值税电子专用发票、机动车销售统一发票、二手车销售统一发票、区块链发票时必填; 全电发票为价税合计(含税金额)
      */
    Amount?: string;
    /**
      * 地区编码，通用机打电子发票时必填。
广东:4400，浙江:3300
      */
    RegionCode?: string;
    /**
      * 销方税号，通用机打电子发票必填
      */
    SellerTaxCode?: string;
    /**
      * 是否开启通用机打电子发票，默认为关闭。
      */
    EnableCommonElectronic?: boolean;
}
/**
 * VehicleLicenseOCR返回参数结构体
 */
export interface VehicleLicenseOCRResponse {
    /**
      * 行驶证主页正面的识别结果，CardSide 为 FRONT。
注意：此字段可能返回 null，表示取不到有效值。
      */
    FrontInfo: TextVehicleFront;
    /**
      * 行驶证副页正面的识别结果，CardSide 为 BACK。
注意：此字段可能返回 null，表示取不到有效值。
      */
    BackInfo: TextVehicleBack;
    /**
      * Code 告警码列表和释义：
-9102 复印件告警
-9103 翻拍件告警
-9106 ps告警
注：告警码可以同时存在多个
      */
    RecognizeWarnCode: Array<number>;
    /**
      * 告警码说明：
WARN_DRIVER_LICENSE_COPY_CARD 复印件告警
WARN_DRIVER_LICENSE_SCREENED_CARD 翻拍件告警
WARN_DRIVER_LICENSE_PS_CARD ps告警
注：告警信息可以同时存在多个
      */
    RecognizeWarnMsg: Array<string>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizePhilippinesSssIDOCR请求参数结构体
 */
export interface RecognizePhilippinesSssIDOCRRequest {
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage: boolean;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * key信息组
 */
export interface Key {
    /**
      * 自动识别的字段名称
      */
    AutoName?: string;
    /**
      * 定义的字段名称（传key的名称）
注意：此字段可能返回 null，表示取不到有效值。
      */
    ConfigName?: string;
}
/**
 * IDCardOCR返回参数结构体
 */
export interface IDCardOCRResponse {
    /**
      * 姓名（人像面）
      */
    Name?: string;
    /**
      * 性别（人像面）
      */
    Sex?: string;
    /**
      * 民族（人像面）
      */
    Nation?: string;
    /**
      * 出生日期（人像面）
      */
    Birth?: string;
    /**
      * 地址（人像面）
      */
    Address?: string;
    /**
      * 身份证号（人像面）
      */
    IdNum?: string;
    /**
      * 发证机关（国徽面）
      */
    Authority?: string;
    /**
      * 证件有效期（国徽面）
      */
    ValidDate?: string;
    /**
      * 扩展信息，不请求则不返回，具体输入参考示例3和示例4。
IdCard，裁剪后身份证照片的base64编码，请求 Config.CropIdCard 时返回；
Portrait，身份证头像照片的base64编码，请求 Config.CropPortrait 时返回；

Quality，图片质量分数，请求 Config.Quality 时返回（取值范围：0 ~ 100，分数越低越模糊，建议阈值≥50）;
BorderCodeValue，身份证边框不完整告警阈值分数，请求 Config.BorderCheckWarn时返回（取值范围：0 ~ 100，分数越低边框遮挡可能性越低，建议阈值≤50）;

WarnInfos，告警信息，Code 告警码列表和释义：
-9100	身份证有效日期不合法告警，
-9101	身份证边框不完整告警，
-9102	身份证复印件告警，
-9103	身份证翻拍告警，
-9105	身份证框内遮挡告警，
-9104	临时身份证告警，
-9106	身份证 PS 告警，
-9107       身份证反光告警。
      */
    AdvancedInfo?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * ClassifyDetectOCR请求参数结构体
 */
export interface ClassifyDetectOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 可以指定要识别的票证类型,指定后不出现在此列表的票证将不返回类型。不指定时默认返回所有支持类别票证的识别信息。

以下是当前支持的类型：
IDCardFront: 身份证正面识别
IDCardBack: 身份证背面识别
Passport: 护照
BusinessCard: 名片识别
BankCard: 银行卡识别
VehicleLicenseFront: 行驶证主页识别
VehicleLicenseBack: 行驶证副页识别
DriverLicenseFront: 驾驶证主页识别
DriverLicenseBack: 驾驶证副页识别
PermitFront: 港澳台通行证正面
ResidenceBooklet: 户口本资料页
MainlandPermitFront: 港澳台来往内地通行证正面
HmtResidentPermitFront: 港澳台居住证正面
HmtResidentPermitBack: 港澳台居住证背面
EstateCert: 不动产证
BizLicense: 营业执照
      */
    DiscernType?: Array<string>;
}
/**
 * DutyPaidProofOCR返回参数结构体
 */
export interface DutyPaidProofOCRResponse {
    /**
      * 完税证明识别结果，具体内容请点击左侧链接。
      */
    DutyPaidProofInfos?: Array<DutyPaidProofInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * TollInvoiceOCR请求参数结构体
 */
export interface TollInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * LicensePlateOCR返回参数结构体
 */
export interface LicensePlateOCRResponse {
    /**
      * 识别出的车牌号码。
      */
    Number?: string;
    /**
      * 置信度，0 - 100 之间。
      */
    Confidence?: number;
    /**
      * 文本行在原图片中的像素坐标框。
      */
    Rect?: Rect;
    /**
      * 识别出的车牌颜色，目前支持颜色包括 “白”、“黑”、“蓝”、“绿“、“黄”、“黄绿”、“临牌”。
      */
    Color?: string;
    /**
      * 全部车牌信息。
      */
    LicensePlateInfos?: Array<LicensePlateInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * HKIDCardOCR返回参数结构体
 */
export interface HKIDCardOCRResponse {
    /**
      * 中文姓名
      */
    CnName: string;
    /**
      * 英文姓名
      */
    EnName: string;
    /**
      * 中文姓名对应电码
      */
    TelexCode: string;
    /**
      * 性别 ：“男M”或“女F”
      */
    Sex: string;
    /**
      * 出生日期
      */
    Birthday: string;
    /**
      * 永久性居民身份证。
0：非永久；
1：永久；
-1：未知。
      */
    Permanent: number;
    /**
      * 身份证号码
      */
    IdNum: string;
    /**
      * 证件符号，出生日期下的符号，例如"***AZ"
      */
    Symbol: string;
    /**
      * 首次签发日期
      */
    FirstIssueDate: string;
    /**
      * 最近领用日期
      */
    CurrentIssueDate: string;
    /**
      * 真假判断。
0：无法判断（图像模糊、不完整、反光、过暗等导致无法判断）；
1：假；
2：真。
注意：此字段可能返回 null，表示取不到有效值。
      */
    FakeDetectResult: number;
    /**
      * 人像照片Base64后的结果
注意：此字段可能返回 null，表示取不到有效值。
      */
    HeadImage: string;
    /**
      * 多重告警码，当身份证是翻拍、复印、PS件时返回对应告警码。
-9102：证照复印件告警
-9103：证照翻拍告警
-9104：证照PS告警
      */
    WarningCode: Array<number>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 医疗发票识别结果
 */
export interface MedicalInvoiceInfo {
    /**
      * 医疗发票识别结果条目
      */
    MedicalInvoiceItems: Array<MedicalInvoiceItem>;
}
/**
 * 发票商品
 */
export interface VatInvoiceGoodsInfo {
    /**
      * 项目名称
      */
    Item: string;
    /**
      * 规格型号
      */
    Specification: string;
    /**
      * 单位
      */
    MeasurementDimension: string;
    /**
      * 价格
      */
    Price: string;
    /**
      * 数量
      */
    Quantity: string;
    /**
      * 金额
      */
    Amount: string;
    /**
      * 税率(如6%、免税)
      */
    TaxScheme: string;
    /**
      * 税额
      */
    TaxAmount: string;
}
/**
 * 组在图中的序号
 */
export interface GroupInfo {
    /**
      * 每一行的元素
      */
    Groups?: Array<LineInfo>;
}
/**
 * OrgCodeCertOCR返回参数结构体
 */
export interface OrgCodeCertOCRResponse {
    /**
      * 代码
      */
    OrgCode?: string;
    /**
      * 机构名称
      */
    Name?: string;
    /**
      * 地址
      */
    Address?: string;
    /**
      * 有效期
      */
    ValidDate?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * PermitOCR请求参数结构体
 */
export interface PermitOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 混贴票据中单张发票的内容
 */
export interface SingleInvoiceItem {
    /**
      * 增值税专用发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatSpecialInvoice: VatInvoiceInfo;
    /**
      * 增值税普通发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatCommonInvoice: VatInvoiceInfo;
    /**
      * 增值税电子普通发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatElectronicCommonInvoice: VatInvoiceInfo;
    /**
      * 增值税电子专用发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatElectronicSpecialInvoice?: VatInvoiceInfo;
    /**
      * 区块链电子发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatElectronicInvoiceBlockchain?: VatInvoiceInfo;
    /**
      * 增值税电子普通发票(通行费)
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatElectronicInvoiceToll?: VatInvoiceInfo;
    /**
      * 电子发票(专用发票)
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatElectronicSpecialInvoiceFull?: VatElectronicInfo;
    /**
      * 电子发票(普通发票)
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatElectronicInvoiceFull?: VatElectronicInfo;
    /**
      * 通用机打发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    MachinePrintedInvoice?: MachinePrintedInvoice;
    /**
      * 汽车票
注意：此字段可能返回 null，表示取不到有效值。
      */
    BusInvoice?: BusInvoice;
    /**
      * 轮船票
注意：此字段可能返回 null，表示取不到有效值。
      */
    ShippingInvoice?: ShippingInvoice;
    /**
      * 过路过桥费发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    TollInvoice?: TollInvoice;
    /**
      * 其他发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    OtherInvoice?: OtherInvoice;
    /**
      * 机动车销售统一发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    MotorVehicleSaleInvoice?: MotorVehicleSaleInvoice;
    /**
      * 二手车销售统一发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    UsedCarPurchaseInvoice?: UsedCarPurchaseInvoice;
    /**
      * 增值税普通发票(卷票)
注意：此字段可能返回 null，表示取不到有效值。
      */
    VatInvoiceRoll?: VatInvoiceRoll;
    /**
      * 出租车发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    TaxiTicket?: TaxiTicket;
    /**
      * 定额发票
注意：此字段可能返回 null，表示取不到有效值。
      */
    QuotaInvoice?: QuotaInvoice;
    /**
      * 机票行程单
注意：此字段可能返回 null，表示取不到有效值。
      */
    AirTransport?: AirTransport;
    /**
      * 非税收入通用票据
注意：此字段可能返回 null，表示取不到有效值。
      */
    NonTaxIncomeGeneralBill?: NonTaxIncomeBill;
    /**
      * 非税收入一般缴款书(电子)
注意：此字段可能返回 null，表示取不到有效值。
      */
    NonTaxIncomeElectronicBill?: NonTaxIncomeBill;
    /**
      * 火车票
注意：此字段可能返回 null，表示取不到有效值。
      */
    TrainTicket?: TrainTicket;
}
/**
 * InvoiceGeneralOCR返回参数结构体
 */
export interface InvoiceGeneralOCRResponse {
    /**
      * 通用机打发票识别结果，具体内容请点击左侧链接。
      */
    InvoiceGeneralInfos?: Array<InvoiceGeneralInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 智慧表单上传文件信息
 */
export interface SmartFormFileUrl {
    /**
      * 文件url地址
      */
    FileUrl: string;
    /**
      * 文件的顺序，顺序从1开始
      */
    FileOrderNumber: number;
}
/**
 * VatInvoiceVerifyNew返回参数结构体
 */
export interface VatInvoiceVerifyNewResponse {
    /**
      * 增值税发票信息，详情请点击左侧链接。
      */
    Invoice?: VatInvoice;
    /**
      * 机动车销售统一发票信息
      */
    VehicleInvoiceInfo?: VehicleInvoiceInfo;
    /**
      * 二手车销售统一发票信息
      */
    UsedVehicleInvoiceInfo?: UsedVehicleInvoiceInfo;
    /**
      * 通行费发票信息
      */
    PassInvoiceInfoList?: Array<PassInvoiceInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 增值税发票返回值
 */
export interface VatInvoiceInfo {
    /**
      * 校验码
      */
    CheckCode?: string;
    /**
      * 发票联次
      */
    FormType?: string;
    /**
      * 车船税
      */
    TravelTax?: string;
    /**
      * 购买方地址电话
      */
    BuyerAddrTel?: string;
    /**
      * 购买方银行账号
      */
    BuyerBankAccount?: string;
    /**
      * 公司印章内容
      */
    CompanySealContent?: string;
    /**
      * 税务局章内容
      */
    TaxSealContent?: string;
    /**
      * 服务类型
      */
    ServiceName?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 是否存在二维码（0：没有，1：有）
      */
    QRCodeMark?: number;
    /**
      * 是否有代开标记（0：没有，1：有）
      */
    AgentMark?: number;
    /**
      * 是否有通行费标记（0：没有，1：有）
      */
    TransitMark?: number;
    /**
      * 是否有成品油标记（0：没有，1：有）
      */
    OilMark?: number;
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 机打发票号码
      */
    NumberConfirm?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 税前金额
      */
    PretaxAmount?: string;
    /**
      * 合计税额
      */
    Tax?: string;
    /**
      * 机器编号
      */
    MachineCode?: string;
    /**
      * 密码区
      */
    Ciphertext?: string;
    /**
      * 备注
      */
    Remark?: string;
    /**
      * 销售方名称
      */
    Seller?: string;
    /**
      * 销售方纳税人识别号
      */
    SellerTaxID?: string;
    /**
      * 销售方地址电话
      */
    SellerAddrTel?: string;
    /**
      * 销售方银行账号
      */
    SellerBankAccount?: string;
    /**
      * 购买方名称
      */
    Buyer?: string;
    /**
      * 购买方纳税人识别号
      */
    BuyerTaxID?: string;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
    /**
      * 开票人
      */
    Issuer?: string;
    /**
      * 复核人
      */
    Reviewer?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 增值税发票项目信息
      */
    VatInvoiceItemInfos?: Array<VatInvoiceItemInfo>;
    /**
      * 机打发票代码
      */
    CodeConfirm?: string;
    /**
      * 收款人
      */
    Receiptor?: string;
}
/**
 * RecognizePhilippinesSssIDOCR返回参数结构体
 */
export interface RecognizePhilippinesSssIDOCRResponse {
    /**
      * 人像照片Base64后的结果
      */
    HeadPortrait?: TextDetectionResult;
    /**
      * 编号
      */
    LicenseNumber?: TextDetectionResult;
    /**
      * 姓名
      */
    FullName?: TextDetectionResult;
    /**
      * 生日
      */
    Birthday?: TextDetectionResult;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * TaxiInvoiceOCR请求参数结构体
 */
export interface TaxiInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * 通用机打发票
 */
export interface MachinePrintedInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 时间
      */
    Time?: string;
    /**
      * 校验码
      */
    CheckCode?: string;
    /**
      * 密码区
      */
    Ciphertext?: string;
    /**
      * 种类
      */
    Category?: string;
    /**
      * 税前金额
      */
    PretaxAmount?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 合计税额
      */
    Tax?: string;
    /**
      * 行业分类
      */
    IndustryClass?: string;
    /**
      * 销售方名称
      */
    Seller?: string;
    /**
      * 销售方纳税人识别号
      */
    SellerTaxID?: string;
    /**
      * 销售方地址电话
      */
    SellerAddrTel?: string;
    /**
      * 销售方银行账号
      */
    SellerBankAccount?: string;
    /**
      * 购买方名称
      */
    Buyer?: string;
    /**
      * 购买方纳税人识别号
      */
    BuyerTaxID?: string;
    /**
      * 购买方地址电话
      */
    BuyerAddrTel?: string;
    /**
      * 购买方银行账号
      */
    BuyerBankAccount?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
    /**
      * 是否为浙江/广东通用机打发票（0：没有，1：有）
      */
    ElectronicMark?: number;
    /**
      * 开票人
      */
    Issuer?: string;
    /**
      * 收款人
      */
    Receiptor?: string;
    /**
      * 复核人
      */
    Reviewer?: string;
    /**
      * 备注
      */
    Remark?: string;
    /**
      * 经办人支付信息
      */
    PaymentInfo?: string;
    /**
      * 经办人取票用户
      */
    TicketPickupUser?: string;
    /**
      * 经办人商户号
      */
    MerchantNumber?: string;
    /**
      * 经办人订单号
      */
    OrderNumber?: string;
    /**
      * 条目
      */
    GeneralMachineItems?: Array<GeneralMachineItem>;
}
/**
 * PropOwnerCertOCR请求参数结构体
 */
export interface PropOwnerCertOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 混贴票据中单张发票的内容
 */
export interface SingleInvoiceInfo {
    /**
      * 识别出的字段名称
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段name对应的字符串结果。
      */
    Value: string;
    /**
      * 字段属于第几行，用于相同字段的排版，如发票明细表格项目，普通字段使用默认值为-1，表示无列排版。
      */
    Row: number;
}
/**
 * RecognizeContainerOCR请求参数结构体
 */
export interface RecognizeContainerOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 火车票
 */
export interface TrainTicket {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 乘车日期
      */
    DateGetOn?: string;
    /**
      * 乘车时间
      */
    TimeGetOn?: string;
    /**
      * 乘车人姓名
      */
    Name?: string;
    /**
      * 出发车站
      */
    StationGetOn?: string;
    /**
      * 到达车站
      */
    StationGetOff?: string;
    /**
      * 座位类型
      */
    Seat?: string;
    /**
      * 总金额
      */
    Total?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 序列号
      */
    SerialNumber?: string;
    /**
      * 身份证号
      */
    UserID?: string;
    /**
      * 检票口
      */
    GateNumber?: string;
    /**
      * 车次
      */
    TrainNumber?: string;
    /**
      * 手续费
      */
    HandlingFee?: string;
    /**
      * 原票价
      */
    OriginalFare?: string;
    /**
      * 大写金额
      */
    TotalCn?: string;
    /**
      * 座位号
      */
    SeatNumber?: string;
    /**
      * 取票地址
      */
    PickUpAddress?: string;
    /**
      * 是否始发改签
      */
    TicketChange?: string;
    /**
      * 加收票价
      */
    AdditionalFare?: string;
    /**
      * 收据号码
      */
    ReceiptNumber?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 是否仅供报销使用（0：没有，1：有）
      */
    ReimburseOnlyMark?: number;
}
/**
 * EduPaperOCR请求参数结构体
 */
export interface EduPaperOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 扩展配置信息。
配置格式：{"option1":value1,"option2":value2}
1. task_type：任务类型【0: 关闭版式分析与处理 1: 开启版式分析处理】可选参数，Int32类型，默认值为1
2. is_structuralization：是否结构化输出【true：返回包体同时返回通用和结构化输出  false：返回包体返回通用输出】 可选参数，Bool类型，默认值为true
3. if_readable_format：是否按照版式整合通用文本/公式输出结果 可选参数，Bool类型，默认值为false
示例：
{"task_type": 1,"is_structuralization": true,"if_readable_format": true}
      */
    Config?: string;
}
/**
 * VatRollInvoiceOCR返回参数结构体
 */
export interface VatRollInvoiceOCRResponse {
    /**
      * 增值税发票（卷票）识别结果，具体内容请点击左侧链接。
      */
    VatRollInvoiceInfos?: Array<VatRollInvoiceInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VatInvoiceVerify请求参数结构体
 */
export interface VatInvoiceVerifyRequest {
    /**
      * 发票代码， 一张发票一天只能查询5次。
      */
    InvoiceCode: string;
    /**
      * 发票号码（8位）
      */
    InvoiceNo: string;
    /**
      * 开票日期（不支持当天发票查询，支持五年以内开具的发票），格式：“YYYY-MM-DD”，如：2019-12-20。
      */
    InvoiceDate: string;
    /**
      * 根据票种传递对应值，如果报参数错误，请仔细检查每个票种对应的值

增值税专用发票：开具金额（不含税）

增值税普通发票、增值税电子普通发票（含通行费发票）、增值税普通发票（卷票）：校验码后6位

区块链发票：不含税金额/校验码，例如：“285.01/856ab”

机动车销售统一发票：不含税价

货物运输业增值税专用发票：合计金额

二手车销售统一发票：车价合计
      */
    Additional: string;
}
/**
 * EduPaperOCR返回参数结构体
 */
export interface EduPaperOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    EduPaperInfos: Array<TextEduPaper>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。
      */
    Angle: number;
    /**
      * 结构化方式输出，具体内容请点击左侧链接。
      */
    QuestionBlockInfos: Array<QuestionBlockObj>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizeThaiIDCardOCR请求参数结构体
 */
export interface RecognizeThaiIDCardOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * 图片开关。默认为false，不返回泰国身份证头像照片的base64编码。
设置为true时，返回旋转矫正后的泰国身份证头像照片的base64编码
      */
    CropPortrait?: boolean;
}
/**
 * 名片识别结果
 */
export interface BusinessCardInfo {
    /**
      * 识别出的字段名称（关键字，可能重复，比如多个手机），能识别的字段名为：
姓名、英文姓名、英文地址、公司、英文公司、职位、英文职位、部门、英文部门、手机、电话、传真、社交帐号、QQ、MSN、微信、微博、邮箱、邮编、网址、公司账号、其他。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标，表示为（左上角x, 左上角y，宽width，高height）
      */
    ItemCoord: ItemCoord;
}
/**
 * 机动车销售统一发票
 */
export interface MotorVehicleSaleInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 税前金额
      */
    PretaxAmount?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 销售方名称
      */
    Seller?: string;
    /**
      * 销售方单位代码
      */
    SellerTaxID?: string;
    /**
      * 销售方电话
      */
    SellerTel?: string;
    /**
      * 销售方地址
      */
    SellerAddress?: string;
    /**
      * 销售方开户行
      */
    SellerBank?: string;
    /**
      * 销售方银行账号
      */
    SellerBankAccount?: string;
    /**
      * 购买方名称
      */
    Buyer?: string;
    /**
      * 购买方纳税人识别号
      */
    BuyerTaxID?: string;
    /**
      * 购买方身份证号码/组织机构代码
      */
    BuyerID?: string;
    /**
      * 主管税务机关
      */
    TaxAuthorities?: string;
    /**
      * 主管税务机关代码
      */
    TaxAuthoritiesCode?: string;
    /**
      * 车辆识别代码
      */
    VIN?: string;
    /**
      * 厂牌型号
      */
    VehicleModel?: string;
    /**
      * 发动机号码
      */
    VehicleEngineCode?: string;
    /**
      * 合格证号
      */
    CertificateNumber?: string;
    /**
      * 商检单号
      */
    InspectionNumber?: string;
    /**
      * 机器编号
      */
    MachineID?: string;
    /**
      * 车辆类型
      */
    VehicleType?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 合计税额
      */
    Tax?: string;
    /**
      * 税率
      */
    TaxRate?: string;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
    /**
      * 吨位
      */
    Tonnage?: string;
    /**
      * 备注
      */
    Remark?: string;
    /**
      * 发票联次
      */
    FormType?: string;
    /**
      * 发票联名
      */
    FormName?: string;
    /**
      * 开票人
      */
    Issuer?: string;
    /**
      * 完税凭证号码
      */
    TaxNum?: string;
    /**
      * 限乘人数
      */
    MaxPeopleNum?: string;
    /**
      * 产地
      */
    Origin?: string;
    /**
      * 机打发票代码
      */
    MachineCode?: string;
    /**
      * 机打发票号码
      */
    MachineNumber?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
}
/**
 * TableOCR请求参数结构体
 */
export interface TableOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 3M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 3M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 二手车销售统一发票信息
 */
export interface UsedVehicleInvoiceInfo {
    /**
      * 所属税局
      */
    TaxBureau: string;
    /**
      * 买方单位/个人
      */
    Buyer: string;
    /**
      * 买方单位代码/身份证号码
      */
    BuyerNo: string;
    /**
      * 买方单位/个人地址
      */
    BuyerAddress: string;
    /**
      * 买方单位电话
      */
    BuyerTel: string;
    /**
      * 卖方单位/个人
      */
    Seller: string;
    /**
      * 卖方单位代码/身份证号码
      */
    SellerNo: string;
    /**
      * 卖方单位/个人地址
      */
    SellerAddress: string;
    /**
      * 卖方单位电话
      */
    SellerTel: string;
    /**
      * 车牌照号
      */
    VehicleLicenseNo: string;
    /**
      * 登记证号
      */
    RegisterNo: string;
    /**
      * 车架号/车辆识别代码
      */
    VehicleIdentifyNo: string;
    /**
      * 转入地车辆管理所名称
      */
    ManagementOffice: string;
    /**
      * 车价合计
      */
    VehicleTotalPrice: string;
    /**
      * 经营、拍卖单位
      */
    Auctioneer: string;
    /**
      * 经营、拍卖单位地址
      */
    AuctioneerAddress: string;
    /**
      * 经营、拍卖单位纳税人识别号
      */
    AuctioneerTaxpayerNum: string;
    /**
      * 经营、拍卖单位开户银行、账号
      */
    AuctioneerBankAccount: string;
    /**
      * 经营、拍卖单位电话
      */
    AuctioneerTel: string;
    /**
      * 二手车市场
      */
    Market: string;
    /**
      * 二手车市场纳税人识别号
      */
    MarketTaxpayerNum: string;
    /**
      * 二手车市场地址
      */
    MarketAddress: string;
    /**
      * 二手车市场开户银行账号
      */
    MarketBankAccount: string;
    /**
      * 二手车市场电话
      */
    MarketTel: string;
}
/**
 * ImageEnhancement返回参数结构体
 */
export interface ImageEnhancementResponse {
    /**
      * 图片数据标识：
“origin”：原图
“preprocess”:预处理后的图
      */
    ImageTag?: string;
    /**
      * 图片数据，返回预处理后图像或原图像base64字符
      */
    Image?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 图片大小
 */
export interface QrcodeImgSize {
    /**
      * 宽
      */
    Wide: number;
    /**
      * 高
      */
    High: number;
}
/**
 * PassportOCR返回参数结构体
 */
export interface PassportOCRResponse {
    /**
      * 国家码
      */
    Country?: string;
    /**
      * 护照号
      */
    PassportNo?: string;
    /**
      * 性别
      */
    Sex?: string;
    /**
      * 国籍
      */
    Nationality?: string;
    /**
      * 出生日期
      */
    BirthDate?: string;
    /**
      * 出生地点
      */
    BirthPlace?: string;
    /**
      * 签发日期
      */
    IssueDate?: string;
    /**
      * 签发地点
      */
    IssuePlace?: string;
    /**
      * 有效期
      */
    ExpiryDate?: string;
    /**
      * 持证人签名
      */
    Signature?: string;
    /**
      * 最下方第一行 MRZ Code 序列
      */
    CodeSet?: string;
    /**
      * 最下方第二行 MRZ Code 序列
      */
    CodeCrc?: string;
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 姓
      */
    FamilyName?: string;
    /**
      * 名
      */
    FirstName?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VerifyBasicBizLicense返回参数结构体
 */
export interface VerifyBasicBizLicenseResponse {
    /**
      * 状态码，成功时返回0
      */
    ErrorCode?: number;
    /**
      * 统一社会信用代码
      */
    CreditCode?: string;
    /**
      * 经营期限自（YYYY-MM-DD）
      */
    Opfrom?: string;
    /**
      * 经营期限至（YYYY-MM-DD）
      */
    Opto?: string;
    /**
      * 法人姓名
      */
    Frname?: string;
    /**
      * 经营状态，包括：成立、筹建、存续、在营、开业、在册、正常经营、开业登记中、登记成立、撤销、撤销登记、非正常户、告解、个体暂时吊销、个体转企业、吊销（未注销）、拟注销、已注销、（待）迁入、（待）迁出、停业、歇业、清算等。
      */
    Entstatus?: string;
    /**
      * 经营业务范围
      */
    Zsopscope?: string;
    /**
      * 查询的状态信息
      */
    Reason?: string;
    /**
      * 原注册号
      */
    Oriregno?: string;
    /**
      * 要核验的工商注册号
      */
    VerifyRegno?: string;
    /**
      * 工商注册号
      */
    Regno?: string;
    /**
      * 要核验的企业名称
      */
    VerifyEntname?: string;
    /**
      * 企业名称
      */
    Entname?: string;
    /**
      * 要核验的住址
      */
    VerifyDom?: string;
    /**
      * 住址
      */
    Dom?: string;
    /**
      * 验证结果
      */
    RegNumResult?: BizLicenseVerifyResult;
    /**
      * 注册资本（单位：万元）,只有输入参数regCapital为1的时候才输出
      */
    RegCapital?: string;
    /**
      * 成立/注册日期，只有输入参数EstablishTime为true时展示，默认为空
      */
    EstablishTime?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * TextDetect请求参数结构体
 */
export interface TextDetectRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * RecognizeTravelCardOCR返回参数结构体
 */
export interface RecognizeTravelCardOCRResponse {
    /**
      * 行程卡更新时间，格式为：XXXX.XX.XX XX:XX:XX
      */
    Time?: string;
    /**
      * 行程卡颜色：绿色、黄色、红色
      */
    Color?: string;
    /**
      * 7天内到达或途经的城市（自2022年7月8日起，通信行程卡查询结果的覆盖时间范围由“14天”调整为“7天”）
      */
    ReachedCity?: Array<string>;
    /**
      * 7天内到达或途径存在中高风险地区的城市（自2022年6月29日起，通信行程卡取消“星号”标记，改字段将返回空值）
      */
    RiskArea?: Array<string>;
    /**
      * 电话号码
      */
    Telephone?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 商品码信息
 */
export interface ProductDataRecord {
    /**
      * 产品名称
      */
    ProductName: string;
    /**
      * 产品名称(英文)
      */
    EnName: string;
    /**
      * 品牌名称
      */
    BrandName: string;
    /**
      * 规格型号
      */
    Type: string;
    /**
      * 宽度，单位毫米
      */
    Width: string;
    /**
      * 高度，单位毫米
      */
    Height: string;
    /**
      * 深度，单位毫米
      */
    Depth: string;
    /**
      * 关键字
      */
    KeyWord: string;
    /**
      * 简短描述
      */
    Description: string;
    /**
      * 图片链接
      */
    ImageLink: Array<string>;
    /**
      * 厂家名称
      */
    ManufacturerName: string;
    /**
      * 厂家地址
      */
    ManufacturerAddress: string;
    /**
      * 企业社会信用代码
      */
    FirmCode: string;
    /**
      * 表示数据查询状态
checkResult	状态说明
1	 经查，该商品条码已在中国物品编码中心注册
2	经查，该厂商识别代码已在中国物品编码中心注册，但编码信息未按规定通报。
3	经查，该厂商识别代码已于xxxxx注销，请关注产品生产日期。
4	经查，该企业以及条码未经条码中心注册，属于违法使用
-1	经查，该商品条码被冒用
-2	经查，该厂商识别代码已在中国物品编码中心注册，但该产品已经下市
S001                未找到该厂商识别代码的注册信息。
S002		该厂商识别代码已经在GS1注册，但编码信息未通报
S003		该商品条码已在GS1通报
S004		该商品条码已注销
S005		数字不正确。GS1前缀（3位国家/地区代码）用于特殊用途。
E001		完整性失败：此GTIN的长度无效。
E002		完整性失败：校验位不正确。
E003		完整性失败：字符串包含字母数字字符。
E004		数字不正确。GS1前缀（3位国家/地区代码）不存在。
E005		数字不正确。GS1前缀（3位国家/地区代码）用于特殊用途。
E006		数字不正确。尚未分配该GS1公司前缀。
E008	        经查，该企业厂商识别代码以及条码尚未通报
      */
    CheckResult: string;
    /**
      * UNSPSC分类码
      */
    CategoryCode: string;
}
/**
 * LicensePlateOCR请求参数结构体
 */
export interface LicensePlateOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * GeneralBasicOCR请求参数结构体
 */
export interface GeneralBasicOCRRequest {
    /**
      * 图片/PDF的 Base64 值。
要求图片/PDF经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP、PDF格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片/PDF的 Url 地址。
要求图片/PDF经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP、PDF格式。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 保留字段。
      */
    Scene?: string;
    /**
      * 识别语言类型。
支持自动识别语言类型，同时支持自选语言种类，默认中英文混合(zh)，各种语言均支持与英文混合的文字识别。
可选值：
zh：中英混合
zh_rare：支持英文、数字、中文生僻字、繁体字，特殊符号等
auto：自动
mix：混合语种
jap：日语
kor：韩语
spa：西班牙语
fre：法语
ger：德语
por：葡萄牙语
vie：越语
may：马来语
rus：俄语
ita：意大利语
hol：荷兰语
swe：瑞典语
fin：芬兰语
dan：丹麦语
nor：挪威语
hun：匈牙利语
tha：泰语
hi：印地语
ara：阿拉伯语
      */
    LanguageType?: string;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
    /**
      * 是否返回单字信息，默认关
      */
    IsWords?: boolean;
}
/**
 * 行驶证副页正面的识别结果
 */
export interface TextVehicleBack {
    /**
      * 号牌号码
注意：此字段可能返回 null，表示取不到有效值。
      */
    PlateNo: string;
    /**
      * 档案编号
注意：此字段可能返回 null，表示取不到有效值。
      */
    FileNo: string;
    /**
      * 核定人数
注意：此字段可能返回 null，表示取不到有效值。
      */
    AllowNum: string;
    /**
      * 总质量
注意：此字段可能返回 null，表示取不到有效值。
      */
    TotalMass: string;
    /**
      * 整备质量
注意：此字段可能返回 null，表示取不到有效值。
      */
    CurbWeight: string;
    /**
      * 核定载质量
注意：此字段可能返回 null，表示取不到有效值。
      */
    LoadQuality: string;
    /**
      * 外廓尺寸
注意：此字段可能返回 null，表示取不到有效值。
      */
    ExternalSize: string;
    /**
      * 备注
注意：此字段可能返回 null，表示取不到有效值。
      */
    Marks: string;
    /**
      * 检验记录
注意：此字段可能返回 null，表示取不到有效值。
      */
    Record: string;
    /**
      * 准牵引总质量
注意：此字段可能返回 null，表示取不到有效值。
      */
    TotalQuasiMass: string;
    /**
      * 副页编码
注意：此字段可能返回 null，表示取不到有效值。
      */
    SubPageCode?: string;
}
/**
 * RecognizeIndonesiaIDCardOCR返回参数结构体
 */
export interface RecognizeIndonesiaIDCardOCRResponse {
    /**
      * 证件号码
      */
    NIK?: string;
    /**
      * 姓名
      */
    Nama?: string;
    /**
      * 出生地/出生时间
      */
    TempatTglLahir?: string;
    /**
      * 性别
      */
    JenisKelamin?: string;
    /**
      * 血型
      */
    GolDarah?: string;
    /**
      * 地址
      */
    Alamat?: string;
    /**
      * 街道
      */
    RTRW?: string;
    /**
      * 村
      */
    KelDesa?: string;
    /**
      * 地区
      */
    Kecamatan?: string;
    /**
      * 宗教信仰
      */
    Agama?: string;
    /**
      * 婚姻状况
      */
    StatusPerkawinan?: string;
    /**
      * 职业
      */
    Perkerjaan?: string;
    /**
      * 国籍
      */
    KewargaNegaraan?: string;
    /**
      * 身份证有效期限
      */
    BerlakuHingga?: string;
    /**
      * 发证日期
      */
    IssuedDate?: string;
    /**
      * 人像截图
      */
    Photo?: string;
    /**
      * 省份，Scene为V2时支持识别
      */
    Provinsi?: string;
    /**
      * 城市，Scene为V2时支持识别
      */
    Kota?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * GeneralEfficientOCR请求参数结构体
 */
export interface GeneralEfficientOCRRequest {
    /**
      * 图片的 Base64 值。
要求图片经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
要求图片经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP格式。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * RecognizePhilippinesUMIDOCR返回参数结构体
 */
export interface RecognizePhilippinesUMIDOCRResponse {
    /**
      * 姓
      */
    Surname?: TextDetectionResult;
    /**
      * 中间名
      */
    MiddleName?: TextDetectionResult;
    /**
      * 名
      */
    GivenName?: TextDetectionResult;
    /**
      * 地址
      */
    Address?: TextDetectionResult;
    /**
      * 生日
      */
    Birthday?: TextDetectionResult;
    /**
      * crn码
      */
    CRN?: TextDetectionResult;
    /**
      * 性别
      */
    Sex?: TextDetectionResult;
    /**
      * 人像照片Base64后的结果
      */
    HeadPortrait?: TextDetectionResult;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * AdvertiseOCR请求参数结构体
 */
export interface AdvertiseOCRRequest {
    /**
      * 图片的 Base64 值。
要求图片经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
要求图片经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP格式。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * RideHailingDriverLicenseOCR返回参数结构体
 */
export interface RideHailingDriverLicenseOCRResponse {
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 证号，对应网约车驾驶证字段：证号/从业资格证号/驾驶员证号/身份证号
      */
    LicenseNumber?: string;
    /**
      * 有效起始日期
      */
    StartDate?: string;
    /**
      * 有效期截止时间，对应网约车驾驶证字段：有效期至/营运期限止
      */
    EndDate?: string;
    /**
      * 初始发证日期，对应网约车驾驶证字段：初始领证日期/发证日期
      */
    ReleaseDate?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 企业四要素核验结果
 */
export interface Detail {
    /**
      * 企业四要素核验结果状态码
      */
    Result: number;
    /**
      * 企业四要素核验结果描述
      */
    Desc: string;
}
/**
 * EnglishOCR请求参数结构体
 */
export interface EnglishOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。像素须介于20-10000px之间。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。

      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。像素须介于20-10000px之间。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 单词四点坐标开关，开启可返回图片中单词的四点坐标。
该参数默认值为false。
      */
    EnableCoordPoint?: boolean;
    /**
      * 候选字开关，开启可返回识别时多个可能的候选字（每个候选字对应其置信度）。
该参数默认值为false。
      */
    EnableCandWord?: boolean;
    /**
      * 预处理开关，功能是检测图片倾斜的角度，将原本倾斜的图片矫正。该参数默认值为true。
      */
    Preprocess?: boolean;
}
/**
 * VatInvoiceVerify返回参数结构体
 */
export interface VatInvoiceVerifyResponse {
    /**
      * 增值税发票信息，详情请点击左侧链接。
      */
    Invoice?: VatInvoice;
    /**
      * 机动车销售统一发票信息
      */
    VehicleInvoiceInfo?: VehicleInvoiceInfo;
    /**
      * 二手车销售统一发票信息
      */
    UsedVehicleInvoiceInfo?: UsedVehicleInvoiceInfo;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 电子发票返回值
 */
export interface VatElectronicInfo {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 税前金额
      */
    PretaxAmount?: string;
    /**
      * 合计税额
      */
    Tax?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 销售方名称
      */
    Seller?: string;
    /**
      * 销售方纳税人识别号
      */
    SellerTaxID?: string;
    /**
      * 购买方名称
      */
    Buyer?: string;
    /**
      * 购买方纳税人识别号
      */
    BuyerTaxID?: string;
    /**
      * 开票人
      */
    Issuer?: string;
    /**
      * 备注
      */
    Remark?: string;
    /**
      * 小计金额
      */
    SubTotal?: string;
    /**
      * 小计税额
      */
    SubTax?: string;
    /**
      * 电子发票详细条目信息
      */
    VatElectronicItems?: Array<VatElectronicItemInfo>;
}
/**
 * SmartStructuralOCR返回参数结构体
 */
export interface SmartStructuralOCRResponse {
    /**
      * 图片旋转角度(角度制)，文本的水平方向
为 0；顺时针为正，逆时针为负
      */
    Angle: number;
    /**
      * 识别信息
      */
    StructuralItems: Array<StructuralItem>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 识别出来的单字信息包括单字（包括单字Character和单字置信度confidence）
 */
export interface DetectedWords {
    /**
      * 置信度 0 ~100
      */
    Confidence: number;
    /**
      * 候选字Character
      */
    Character: string;
}
/**
 * 其他票Table
 */
export interface OtherInvoiceList {
    /**
      * 列表
      */
    OtherInvoiceItemList?: Array<OtherInvoiceItem>;
}
/**
 * RecognizeIndonesiaIDCardOCR请求参数结构体
 */
export interface RecognizeIndonesiaIDCardOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage?: boolean;
    /**
      * 场景参数，默认值为V1
可选值：
V1
V2
      */
    Scene?: string;
}
/**
 * 轮船票字段信息
 */
export interface ShipInvoiceInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
发票代码、发票号码、日期、票价、始发地、目的地、姓名、时间、发票消费类型、省、市、币种。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * 文本的坐标，以四个顶点坐标表示
注意：此字段可能返回 null，表示取不到有效值
 */
export interface Polygon {
    /**
      * 左上顶点坐标
      */
    LeftTop: Coord;
    /**
      * 右上顶点坐标
      */
    RightTop: Coord;
    /**
      * 右下顶点坐标
      */
    RightBottom: Coord;
    /**
      * 左下顶点坐标
      */
    LeftBottom: Coord;
}
/**
 * GeneralAccurateOCR请求参数结构体
 */
export interface GeneralAccurateOCRRequest {
    /**
      * 图片的 Base64 值。
要求图片经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
要求图片经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP格式。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否返回单字信息，默认关
      */
    IsWords?: boolean;
    /**
      * 是否开启原图切图检测功能，开启后可提升“整图面积大，但单字符占比面积小”（例如：试卷）场景下的识别效果，默认关
      */
    EnableDetectSplit?: boolean;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * OrgCodeCertOCR请求参数结构体
 */
export interface OrgCodeCertOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * FlightInvoiceOCR返回参数结构体
 */
export interface FlightInvoiceOCRResponse {
    /**
      * 机票行程单识别结果，具体内容请点击左侧链接。
      */
    FlightInvoiceInfos?: Array<FlightInvoiceInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 识别结果
 */
export interface TextDetectionResult {
    /**
      * 识别出的文本行内容
      */
    Value: string;
    /**
      * 坐标，以四个顶点坐标表示
      */
    Polygon: Array<Coord>;
}
/**
 * InstitutionOCR请求参数结构体
 */
export interface InstitutionOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 购车发票识别结果
 */
export interface CarInvoiceInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
发票代码、 机打代码、 发票号码、 发动机号码、 合格证号、 机打号码、 价税合计(小写)、 销货单位名称、 身份证号码/组织机构代码、 购买方名称、 销售方纳税人识别号、 购买方纳税人识别号、主管税务机关、 主管税务机关代码、 开票日期、 不含税价(小写)、 吨位、增值税税率或征收率、 车辆识别代号/车架号码、 增值税税额、 厂牌型号、 省、 市、 发票消费类型、 销售方电话、 销售方账号、 产地、 进口证明书号、 车辆类型、 机器编号、备注、开票人、限乘人数、商检单号、销售方地址、销售方开户银行、价税合计、发票类型。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段name对应的字符串结果。
      */
    Value: string;
    /**
      * 字段在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
    /**
      * 字段在原图中的中的四点坐标。
注意：此字段可能返回 null，表示取不到有效值。
注意：此字段可能返回 null，表示取不到有效值。
      */
    Polygon: Polygon;
}
/**
 * 机票行程单识别结果
 */
export interface FlightInvoiceInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
票价、合计金额、填开日期、有效身份证件号码、电子客票号码、验证码、旅客姓名、填开单位、其他税费、燃油附加费、民航发展基金、保险费、销售单位代号、始发地、目的地、航班号、时间、日期、座位等级、承运人、发票消费类型、国内国际标签、印刷序号、客票级别/类别、客票生效日期、有效期截止日期、免费行李。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段 Name 对应的字符串结果。
      */
    Value: string;
    /**
      * 多个行程的字段所在行号，下标从0开始，非行字段或未能识别行号的该值返回-1。
      */
    Row: number;
}
/**
 * 行驶证主页正面的识别结果
 */
export interface TextVehicleFront {
    /**
      * 号牌号码
注意：此字段可能返回 null，表示取不到有效值。
      */
    PlateNo: string;
    /**
      * 车辆类型
注意：此字段可能返回 null，表示取不到有效值。
      */
    VehicleType: string;
    /**
      * 所有人
注意：此字段可能返回 null，表示取不到有效值。
      */
    Owner: string;
    /**
      * 住址
注意：此字段可能返回 null，表示取不到有效值。
      */
    Address: string;
    /**
      * 使用性质
注意：此字段可能返回 null，表示取不到有效值。
      */
    UseCharacter: string;
    /**
      * 品牌型号
注意：此字段可能返回 null，表示取不到有效值。
      */
    Model: string;
    /**
      * 车辆识别代号
注意：此字段可能返回 null，表示取不到有效值。
      */
    Vin: string;
    /**
      * 发动机号码
注意：此字段可能返回 null，表示取不到有效值。
      */
    EngineNo: string;
    /**
      * 注册日期
注意：此字段可能返回 null，表示取不到有效值。
      */
    RegisterDate: string;
    /**
      * 发证日期
注意：此字段可能返回 null，表示取不到有效值。
      */
    IssueDate: string;
    /**
      * 印章
注意：此字段可能返回 null，表示取不到有效值。
      */
    Seal: string;
}
/**
 * 广告文字识别结果
 */
export interface AdvertiseTextDetection {
    /**
      * 识别出的文本行内容
      */
    DetectedText: string;
    /**
      * 置信度 0 ~100
      */
    Confidence: number;
    /**
      * 文本行坐标，以四个顶点坐标表示
      */
    Polygon: Array<Coord>;
    /**
      * 此字段为扩展字段。
GeneralBasicOcr接口返回段落信息Parag，包含ParagNo。
      */
    AdvancedInfo: string;
}
/**
 * 金融票据切片识别单个字段的内容
 */
export interface FinanBillSliceInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
大写金额、小写金额、账号、票号1、票号2、收款人、大写日期、同城交换号、地址-省份、地址-城市、付款行全称、支票密码、支票用途。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
}
/**
 * RideHailingDriverLicenseOCR请求参数结构体
 */
export interface RideHailingDriverLicenseOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。图片下载时间不超过 3 秒。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
}
/**
 * QueryBarCode返回参数结构体
 */
export interface QueryBarCodeResponse {
    /**
      * 条码
      */
    BarCode?: string;
    /**
      * 条码信息数组
      */
    ProductDataRecords?: Array<ProductDataRecord>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * ArithmeticOCR请求参数结构体
 */
export interface ArithmeticOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 用于选择是否支持横屏拍摄。打开则支持横屏拍摄图片角度判断，角度信息在返回参数的angle中，默认值为true
      */
    SupportHorizontalImage?: boolean;
    /**
      * 是否拒绝非速算图，打开则拒绝非速算图(注：非速算图是指风景人物等明显不是速算图片的图片)，默认值为false
      */
    RejectNonArithmeticPic?: boolean;
    /**
      * 是否展开耦合算式中的竖式计算，默认值为false
      */
    EnableDispRelatedVertical?: boolean;
    /**
      * 是否展示竖式算式的中间结果和格式控制字符，默认值为false
      */
    EnableDispMidResult?: boolean;
    /**
      * 是否开启pdf识别，默认值为true
      */
    EnablePdfRecognize?: boolean;
    /**
      * pdf页码，从0开始，默认为0
      */
    PdfPageIndex?: number;
}
/**
 * 非税收入
 */
export interface NonTaxIncomeBill {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 校验码
      */
    CheckCode?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 交款人名称
      */
    Buyer?: string;
    /**
      * 交款人纳税人识别号
      */
    BuyerTaxID?: string;
    /**
      * 收款人名称
      */
    Seller?: string;
    /**
      * 收款单位名称
      */
    SellerCompany?: string;
    /**
      * 备注
      */
    Remark?: string;
    /**
      * 币种
      */
    CurrencyCode?: string;
    /**
      * 复核人
      */
    Reviewer?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 其他信息
      */
    OtherInfo?: string;
    /**
      * 缴款码
      */
    PaymentCode?: string;
    /**
      * 执收单位编码
      */
    ReceiveUnitCode?: string;
    /**
      * 执收单位名称
      */
    Receiver?: string;
    /**
      * 经办人
      */
    Operator?: string;
    /**
      * 付款人账号
      */
    PayerAccount?: string;
    /**
      * 付款人开户银行
      */
    PayerBank?: string;
    /**
      * 收款人账号
      */
    ReceiverAccount?: string;
    /**
      * 收款人开户银行
      */
    ReceiverBank?: string;
    /**
      * 条目
      */
    NonTaxItems?: Array<NonTaxItem>;
}
/**
 * VerifyOfdVatInvoiceOCR请求参数结构体
 */
export interface VerifyOfdVatInvoiceOCRRequest {
    /**
      * OFD文件的 Url 地址。
      */
    OfdFileUrl?: string;
    /**
      * OFD文件的 Base64 值。
OfdFileUrl 和 OfdFileBase64 必传其一，若两者都传，只解析OfdFileBase64。
      */
    OfdFileBase64?: string;
}
/**
 * FinanBillSliceOCR请求参数结构体
 */
export interface FinanBillSliceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * MLIDPassportOCR返回参数结构体
 */
export interface MLIDPassportOCRResponse {
    /**
      * 护照ID
      */
    ID?: string;
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 出生日期
      */
    DateOfBirth?: string;
    /**
      * 性别（F女，M男）
      */
    Sex?: string;
    /**
      * 有效期
      */
    DateOfExpiration?: string;
    /**
      * 发行国
      */
    IssuingCountry?: string;
    /**
      * 国家地区代码
      */
    Nationality?: string;
    /**
      * 告警码
-9103	证照翻拍告警
-9102	证照复印件告警（包括黑白复印件、彩色复印件）
-9106       证件遮挡告警
      */
    Warn?: Array<number>;
    /**
      * 证件图片
      */
    Image?: string;
    /**
      * 扩展字段:
{
    ID:{
        Confidence:0.9999
    },
    Name:{
        Confidence:0.9996
    }
}
      */
    AdvancedInfo?: string;
    /**
      * 最下方第一行 MRZ Code 序列
      */
    CodeSet?: string;
    /**
      * 最下方第二行 MRZ Code 序列
      */
    CodeCrc?: string;
    /**
      * 姓
注意：此字段可能返回 null，表示取不到有效值。
      */
    Surname?: string;
    /**
      * 名
注意：此字段可能返回 null，表示取不到有效值。
      */
    GivenName?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VatRollInvoiceOCR请求参数结构体
 */
export interface VatRollInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * 机票行程单
 */
export interface AirTransport {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 电子客票号码
      */
    Number?: string;
    /**
      * 校验码
      */
    CheckCode?: string;
    /**
      * 印刷序号
      */
    SerialNumber?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 销售单位代号
      */
    AgentCode?: string;
    /**
      * 销售单位代号第一行
      */
    AgentCodeFirst?: string;
    /**
      * 销售单位代号第二行
      */
    AgentCodeSecond?: string;
    /**
      * 姓名
      */
    UserName?: string;
    /**
      * 身份证号
      */
    UserID?: string;
    /**
      * 填开单位
      */
    Issuer?: string;
    /**
      * 票价
      */
    Fare?: string;
    /**
      * 合计税额
      */
    Tax?: string;
    /**
      * 燃油附加费
      */
    FuelSurcharge?: string;
    /**
      * 民航发展基金
      */
    AirDevelopmentFund?: string;
    /**
      * 保险费
      */
    Insurance?: string;
    /**
      * 合计金额（小写）
      */
    Total?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 国内国际标签
      */
    DomesticInternationalTag?: string;
    /**
      * 客票生效日期
      */
    DateStart?: string;
    /**
      * 有效截至日期
      */
    DateEnd?: string;
    /**
      * 签注
      */
    Endorsement?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 条目
      */
    FlightItems?: Array<FlightItem>;
}
/**
 * VerifyEnterpriseFourFactors请求参数结构体
 */
export interface VerifyEnterpriseFourFactorsRequest {
    /**
      * 姓名
      */
    RealName: string;
    /**
      * 证件号码（公司注册证件号）
      */
    IdCard: string;
    /**
      * 企业全称
      */
    EnterpriseName: string;
    /**
      * 企业标识（注册号，统一社会信用代码）
      */
    EnterpriseMark: string;
}
/**
 * 表格标题
 */
export interface TableTitle {
    /**
      * 表格名称
注意：此字段可能返回 null，表示取不到有效值。
      */
    Text: string;
}
/**
 * RecognizeTableAccurateOCR请求参数结构体
 */
export interface RecognizeTableAccurateOCRRequest {
    /**
      * 图片/PDF的 Base64 值。
要求图片/PDF经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP、PDF格式。
图片支持的像素范围：需介于20-10000px之间。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片/PDF的 Url 地址。
要求图片/PDF经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP、PDF格式。
图片支持的像素范围：需介于20-10000px之间。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定
性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * 坐标
 */
export interface Coord {
    /**
      * 横坐标
      */
    X: number;
    /**
      * 纵坐标
      */
    Y: number;
}
/**
 * SealOCR返回参数结构体
 */
export interface SealOCRResponse {
    /**
      * 印章内容
      */
    SealBody?: string;
    /**
      * 印章坐标
      */
    Location?: Rect;
    /**
      * 其它文本内容
      */
    OtherTexts?: Array<string>;
    /**
      * 全部印章信息
      */
    SealInfos?: Array<SealInfo>;
    /**
      * 印章类型，表示为：
圆形印章：0
椭圆形印章：1
方形印章：2
菱形印章：3
三角形印章：4
      */
    SealShape?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 识别出的字段
 */
export interface DutyPaidProofInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
税号 、纳税人识别号 、纳税人名称 、金额合计大写 、金额合计小写 、填发日期 、税务机关 、填票人。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * FinanBillOCR返回参数结构体
 */
export interface FinanBillOCRResponse {
    /**
      * 金融票据整单识别结果，具体内容请点击左侧链接。
      */
    FinanBillInfos?: Array<FinanBillInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizeHealthCodeOCR请求参数结构体
 */
export interface RecognizeHealthCodeOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 需要识别的健康码类型列表，为空或不填表示默认为自动识别。
0:自动识别
      */
    Type?: number;
}
/**
 * BankSlipOCR返回参数结构体
 */
export interface BankSlipOCRResponse {
    /**
      * 银行回单识别结果，具体内容请点击左侧链接。
      */
    BankSlipInfos?: Array<BankSlipInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 通行费发票信息
 */
export interface PassInvoiceInfo {
    /**
      * 通行费车牌号
      */
    NumberPlate: string;
    /**
      * 通行费类型
      */
    Type: string;
    /**
      * 通行日期起
      */
    PassDateBegin: string;
    /**
      * 通行日期止
      */
    PassDateEnd: string;
    /**
      * 税收分类编码
      */
    TaxClassifyCode: string;
}
/**
 * 试题识别结构化信息
 */
export interface QuestionObj {
    /**
      * 题号
      */
    QuestionTextNo: string;
    /**
      * 题型：
1: "选择题"
2: "填空题"
3: "解答题"
      */
    QuestionTextType: number;
    /**
      * 题干
      */
    QuestionText: string;
    /**
      * 选择题选项，包含1个或多个option
      */
    QuestionOptions: string;
    /**
      * 所有子题的question属性
      */
    QuestionSubquestion: string;
    /**
      * 示意图检测框在的图片中的像素坐标
      */
    QuestionImageCoords: Array<Rect>;
}
/**
 * 表格内容检测
 */
export interface TableInfo {
    /**
      * 单元格内容
注意：此字段可能返回 null，表示取不到有效值。
      */
    Cells: Array<TableCellInfo>;
    /**
      * 图像中的文本块类型，0 为非表格文本，
1 为有线表格，2 为无线表格
注意：此字段可能返回 null，表示取不到有效值。
      */
    Type: number;
    /**
      * 表格主体四个顶点坐标（依次为左上角，
右上角，右下角，左下角）
注意：此字段可能返回 null，表示取不到有效值。
      */
    TableCoordPoint: Array<Coord>;
}
/**
 * VinOCR返回参数结构体
 */
export interface VinOCRResponse {
    /**
      * 检测到的车辆 VIN 码。
      */
    Vin: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * GetTaskState返回参数结构体
 */
export interface GetTaskStateResponse {
    /**
      * 1:任务识别完成，还未提交
2:任务已手动关闭
3:任务已提交
4:任务识别中
5:超时：任务超过了可操作的24H时限
6:任务识别失败
      */
    TaskState?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * FormulaOCR请求参数结构体
 */
export interface FormulaOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 文字识别结果
 */
export interface TextGeneralHandwriting {
    /**
      * 识别出的文本行内容
      */
    DetectedText: string;
    /**
      * 置信度 0 - 100
      */
    Confidence: number;
    /**
      * 文本行坐标，以四个顶点坐标表示
      */
    Polygon: Array<Coord>;
    /**
      * 此字段为扩展字段。
能返回文本行的段落信息，例如：{\"Parag\":{\"ParagNo\":2}}，
其中ParagNo为段落行，从1开始。
      */
    AdvancedInfo: string;
    /**
      * 字的坐标数组，以四个顶点坐标表示
注意：此字段可能返回 null，表示取不到有效值。
      */
    WordPolygon: Array<Polygon>;
}
/**
 * PassportOCR请求参数结构体
 */
export interface PassportOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * 默认填写CN
支持中国大陆地区护照。
      */
    Type?: string;
}
/**
 * DutyPaidProofOCR请求参数结构体
 */
export interface DutyPaidProofOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * RecognizeHealthCodeOCR返回参数结构体
 */
export interface RecognizeHealthCodeOCRResponse {
    /**
      * 持码人姓名，如：王*（允许返回空值）
      */
    Name?: string;
    /**
      * 持码人身份证号，如：11**************01（允许返回空值）
      */
    IDNumber?: string;
    /**
      * 健康码更新时间（允许返回空值）
      */
    Time?: string;
    /**
      * 健康码颜色：绿色、黄色、红色（允许返回空值）
      */
    Color?: string;
    /**
      * 核酸检测间隔时长（允许返回空值）
      */
    TestingInterval?: string;
    /**
      * 核酸检测结果：阴性、阳性、暂无核酸检测记录（允许返回空值）
      */
    TestingResult?: string;
    /**
      * 核酸检测时间（允许返回空值）
      */
    TestingTime?: string;
    /**
      * 疫苗接种信息，返回接种针数或接种情况（允许返回空值）
      */
    Vaccination?: string;
    /**
      * 场所名称（允许返回空值）
      */
    SpotName?: string;
    /**
      * 疫苗接种时间
      */
    VaccinationTime?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 按行输出，行序号
 */
export interface LineInfo {
    /**
      * 每行的一个元素
      */
    Lines?: Array<ItemInfo>;
}
/**
 * QueryBarCode请求参数结构体
 */
export interface QueryBarCodeRequest {
    /**
      * 条形码
      */
    BarCode: string;
}
/**
 * 过路过桥费发票
 */
export interface TollInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 日期
      */
    Date?: string;
    /**
      * 时间
      */
    Time?: string;
    /**
      * 入口
      */
    Entrance?: string;
    /**
      * 出口
      */
    Exit?: string;
    /**
      * 高速标志（0：没有，1：有）
      */
    HighwayMark?: number;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
}
/**
 * 文本行在旋转纠正之后的图像中的像素坐标，表示为（左上角x, 左上角y，宽width，高height）
 */
export interface ItemCoord {
    /**
      * 左上角x
      */
    X: number;
    /**
      * 左上角y
      */
    Y: number;
    /**
      * 宽width
      */
    Width: number;
    /**
      * 高height
      */
    Height: number;
}
/**
 * CreateAIFormTask返回参数结构体
 */
export interface CreateAIFormTaskResponse {
    /**
      * 本次识别任务的唯一身份ID
注意：此字段可能返回 null，表示取不到有效值。
      */
    TaskId?: string;
    /**
      * 本次识别任务的操作URL，有效期自生成之时起共24小时
注意：此字段可能返回 null，表示取不到有效值。
      */
    OperateUrl?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * MixedInvoiceOCR请求参数结构体
 */
export interface MixedInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG、PDF，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG、PDF，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 需要识别的票据类型列表，为空或不填表示识别全部类型。
0：出租车发票
1：定额发票
2：火车票
3：增值税发票
5：机票行程单
8：通用机打发票
9：汽车票
10：轮船票
11：增值税发票（卷票 ）
12：购车发票
13：过路过桥费发票
15：非税发票
16：全电发票
----------------------
-1：其他发票,（只传入此类型时，图片均采用其他票类型进行识别）
      */
    Types?: Array<number>;
    /**
      * 是否识别其他类型发票，默认为Yes
Yes：识别其他类型发票
No：不识别其他类型发票
      */
    ReturnOther?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
    /**
      * 是否开启PDF多页识别，默认值为false，开启后可同时支持多页PDF的识别返回，仅支持返回文件前30页。开启后IsPDF和PdfPageNumber入参不进行控制。
      */
    ReturnMultiplePage?: boolean;
}
/**
 * 轮船票
 */
export interface ShippingInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 姓名
      */
    UserName?: string;
    /**
      * 日期
      */
    Date?: string;
    /**
      * 时间
      */
    Time?: string;
    /**
      * 出发车站
      */
    StationGetOn?: string;
    /**
      * 到达车站
      */
    StationGetOff?: string;
    /**
      * 票价
      */
    Total?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 币种
      */
    CurrencyCode?: string;
}
/**
 * 表格内容检测
 */
export interface TableDetectInfo {
    /**
      * 单元格内容
注意：此字段可能返回 null，表示取不到有效值。
      */
    Cells: Array<TableCell>;
    /**
      * 表格标题
注意：此字段可能返回 null，表示取不到有效值。
      */
    Titles: Array<TableTitle>;
    /**
      * 图像中的文本块类型，0 为非表格文本，
1 为有线表格，2 为无线表格
（接口暂不支持日文无线表格识别，若传入日文无线表格，返回0）
注意：此字段可能返回 null，表示取不到有效值。
      */
    Type: number;
    /**
      * 表格主体四个顶点坐标（依次为左上角，
右上角，右下角，左下角）
注意：此字段可能返回 null，表示取不到有效值。
      */
    TableCoordPoint: Array<Coord>;
}
/**
 * ResidenceBookletOCR返回参数结构体
 */
export interface ResidenceBookletOCRResponse {
    /**
      * 户号
      */
    HouseholdNumber?: string;
    /**
      * 姓名
      */
    Name?: string;
    /**
      * 性别
      */
    Sex?: string;
    /**
      * 出生地
      */
    BirthPlace?: string;
    /**
      * 民族
      */
    Nation?: string;
    /**
      * 籍贯
      */
    NativePlace?: string;
    /**
      * 出生日期
      */
    BirthDate?: string;
    /**
      * 公民身份证件编号
      */
    IdCardNumber?: string;
    /**
      * 文化程度
      */
    EducationDegree?: string;
    /**
      * 服务处所
      */
    ServicePlace?: string;
    /**
      * 户别
      */
    Household?: string;
    /**
      * 住址
      */
    Address?: string;
    /**
      * 承办人签章文字
      */
    Signature?: string;
    /**
      * 签发日期
      */
    IssueDate?: string;
    /**
      * 户主页编号
      */
    HomePageNumber?: string;
    /**
      * 户主姓名
      */
    HouseholderName?: string;
    /**
      * 户主或与户主关系
      */
    Relationship?: string;
    /**
      * 本市（县）其他住址
      */
    OtherAddresses?: string;
    /**
      * 宗教信仰
      */
    ReligiousBelief?: string;
    /**
      * 身高
      */
    Height?: string;
    /**
      * 血型
      */
    BloodType?: string;
    /**
      * 婚姻状况
      */
    MaritalStatus?: string;
    /**
      * 兵役状况
      */
    VeteranStatus?: string;
    /**
      * 职业
      */
    Profession?: string;
    /**
      * 何时由何地迁来本市(县)
      */
    MoveToCityInformation?: string;
    /**
      * 何时由何地迁来本址
      */
    MoveToSiteInformation?: string;
    /**
      * 登记日期
      */
    RegistrationDate?: string;
    /**
      * 曾用名
      */
    FormerName?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 增值税普通发票(卷票)
 */
export interface VatInvoiceRoll {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 机打发票号码
      */
    NumberConfirm?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 校验码
      */
    CheckCode?: string;
    /**
      * 销售方名称
      */
    Seller?: string;
    /**
      * 销售方纳税人识别号
      */
    SellerTaxID?: string;
    /**
      * 购买方名称
      */
    Buyer?: string;
    /**
      * 购买方纳税人识别号
      */
    BuyerTaxID?: string;
    /**
      * 种类
      */
    Category?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 服务类型
      */
    ServiceName?: string;
    /**
      * 公司印章内容
      */
    CompanySealContent?: string;
    /**
      * 税务局章内容
      */
    TaxSealContent?: string;
    /**
      * 条目
      */
    VatRollItems?: Array<VatRollItem>;
}
/**
 * CarInvoiceOCR返回参数结构体
 */
export interface CarInvoiceOCRResponse {
    /**
      * 购车发票识别结果，具体内容请点击左侧链接。
      */
    CarInvoiceInfos?: Array<CarInvoiceInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VehicleRegCertOCR返回参数结构体
 */
export interface VehicleRegCertOCRResponse {
    /**
      * 机动车登记证书识别结果，具体内容请点击左侧链接。
      */
    VehicleRegCertInfos?: Array<VehicleRegCertInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * GeneralFastOCR请求参数结构体
 */
export interface GeneralFastOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * 医疗发票识别结果
 */
export interface MedicalInvoiceItem {
    /**
      * 识别出的字段名称
<table><tr><td>分类</td><td>name</td></tr><tr><td>票据基本信息</td><td>发票名称</td></tr><tr><td></td><td>票据代码</td></tr><tr><td></td><td>票据号码</td></tr><tr><td></td><td>电子票据代码</td></tr><tr><td></td><td>电子票据号码</td></tr><tr><td></td><td>交款人统一社会信用代码</td></tr><tr><td></td><td>校验码</td></tr><tr><td></td><td>交款人</td></tr><tr><td></td><td>开票日期</td></tr><tr><td></td><td>收款单位</td></tr><tr><td></td><td>复核人</td></tr><tr><td></td><td>收款人</td></tr><tr><td></td><td>业务流水号</td></tr><tr><td></td><td>门诊号</td></tr><tr><td></td><td>就诊日期</td></tr><tr><td></td><td>医疗机构类型</td></tr><tr><td></td><td>医保类型</td></tr><tr><td></td><td>医保编号</td></tr><tr><td></td><td>性别</td></tr><tr><td></td><td>医保统筹基金支付</td></tr><tr><td></td><td>其他支付</td></tr><tr><td></td><td>个人账户支付</td></tr><tr><td></td><td>个人现金支付</td></tr><tr><td></td><td>个人自付</td></tr><tr><td></td><td>个人自费</td></tr><tr><td></td><td>病历号</td></tr><tr><td></td><td>住院号</td></tr><tr><td></td><td>住院科别</td></tr><tr><td></td><td>住院时间</td></tr><tr><td></td><td>预缴金额</td></tr><tr><td></td><td>补缴金额</td></tr><tr><td></td><td>退费金额</td></tr><tr><td></td><td>发票属地</td></tr><tr><td></td><td>发票类型</td></tr><tr><td>总金额</td><td>总金额大写</td></tr><tr><td></td><td>总金额小写</td></tr><tr><td>收费大项</td><td>大项名称</td></tr><tr><td></td><td>大项金额</td></tr><tr><td>收费细项</td><td>项目名称</td></tr><tr><td></td><td>数量</td></tr><tr><td></td><td>单位</td></tr><tr><td></td><td>金额</td></tr><tr><td></td><td>备注</td></tr><tr><td>票据其他信息</td><td>入院时间</td></tr><tr><td></td><td>出院时间</td></tr><tr><td></td><td>住院天数</td></tr><tr><td></td><td>自付二</td></tr><tr><td></td><td>自付一</td></tr><tr><td></td><td>起付金额</td></tr><tr><td></td><td>超封顶金额</td></tr><tr><td></td><td>自费</td></tr><tr><td></td><td>本次医保范围内金额</td></tr><tr><td></td><td>累计医保内范围金额</td></tr><tr><td></td><td>门诊大额支付</td></tr><tr><td></td><td>残军补助支付</td></tr><tr><td></td><td>年度门诊大额累计支付</td></tr><tr><td></td><td>单位补充险[原公疗]支付</td></tr><tr><td></td><td>社会保障卡号</td></tr><tr><td></td><td>姓名</td></tr><tr><td></td><td>交易流水号</td></tr><tr><td></td><td>本次支付后个人账户余额</td></tr><tr><td></td><td>基金支付</td></tr><tr><td></td><td>现金支付</td></tr><tr><td></td><td>复核</td></tr><tr><td></td><td>自负</td></tr><tr><td></td><td>结算方式</td></tr><tr><td></td><td>医保统筹/公医记账</td></tr><tr><td></td><td>其他</td></tr><tr><td></td><td>个人支付金额</td></tr><tr><td></td><td>欠费</td></tr><tr><td></td><td>退休补充支付</td></tr><tr><td></td><td>医院类型</td></tr><tr><td></td><td>退款</td></tr><tr><td></td><td>补收</td></tr><tr><td></td><td>附加支付</td></tr><tr><td></td><td>分类自负</td></tr><tr><td></td><td>其它</td></tr><tr><td></td><td>预交款</td></tr><tr><td></td><td>个人缴费</td></tr></table>
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段name对应的字符串结果
      */
    Content: string;
    /**
      * 识别出的文本行四点坐标
注意：此字段可能返回 null，表示取不到有效值。
      */
    Vertex: Polygon;
    /**
      * 识别出的文本行在旋转纠正之后的图像中的像素坐标
注意：此字段可能返回 null，表示取不到有效值。
      */
    Coord: Rect;
}
/**
 * ShipInvoiceOCR返回参数结构体
 */
export interface ShipInvoiceOCRResponse {
    /**
      * 轮船票识别结果，具体内容请点击左侧链接。
      */
    ShipInvoiceInfos?: Array<ShipInvoiceInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizeGeneralInvoice返回参数结构体
 */
export interface RecognizeGeneralInvoiceResponse {
    /**
      * 混贴票据识别结果，具体内容请点击左侧链接。
      */
    MixedInvoiceItems?: Array<InvoiceItem>;
    /**
      * PDF文件总页码
      */
    TotalPDFCount?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 保险单据信息
 */
export interface InsuranceBillInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
【病案首页】
姓名、性别、出生日期、出院诊断、疾病编码、入院病情等。
【费用清单】
医疗参保人员类别、身份证号、入院方式、结账日期、项目、金额等。
【结算单】
名称、单价、数量、金额、医保内、医保外等。
【医疗发票】
姓名、性别、住院时间、收费项目、金额、合计等。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
}
/**
 * GetTaskState请求参数结构体
 */
export interface GetTaskStateRequest {
    /**
      * 智慧表单任务唯一身份ID
      */
    TaskId: string;
}
/**
 * RecognizeMedicalInvoiceOCR请求参数结构体
 */
export interface RecognizeMedicalInvoiceOCRRequest {
    /**
      * 图片的Base64 值。
支持的文件格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载文件经Base64编码后不超过 7M。文件下载时间不超过 3 秒。
输入参数 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的Url 地址。
支持的文件格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载文件经 Base64 编码后不超过 7M。文件下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否需要返回识别出的文本行在原图上的四点坐标，默认不返回
      */
    ReturnVertex?: boolean;
    /**
      * 是否需要返回识别出的文本行在旋转纠正之后的图像中的四点坐标，默认不返回
      */
    ReturnCoord?: boolean;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * InsuranceBillOCR返回参数结构体
 */
export interface InsuranceBillOCRResponse {
    /**
      * 保险单据识别结果，具体内容请点击左侧链接。
      */
    InsuranceBillInfos: Array<InsuranceBillInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 卡证智能分类结果
 */
export interface ClassifyDetectInfo {
    /**
      * 分类名称，包括：身份证、护照、名片、银行卡、行驶证、驾驶证、港澳台通行证、户口本、港澳台来往内地通行证、港澳台居住证、不动产证、营业执照
      */
    Name: string;
    /**
      * 分类类型
注意：此字段可能返回 null，表示取不到有效值。
      */
    Type: string;
    /**
      * 位置坐标
      */
    Rect: Rect;
}
/**
 * GeneralEfficientOCR返回参数结构体
 */
export interface GeneralEfficientOCRResponse {
    /**
      * 检测到的文本信息，包括文本行内容、置信度、文本行坐标以及文本行旋转纠正后的坐标，具体内容请点击左侧链接。
      */
    TextDetections: Array<TextDetection>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angel: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * ShipInvoiceOCR请求参数结构体
 */
export interface ShipInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * SealOCR请求参数结构体
 */
export interface SealOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。图片下载时间不超过 3 秒。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
}
/**
 * VerifyOfdVatInvoiceOCR返回参数结构体
 */
export interface VerifyOfdVatInvoiceOCRResponse {
    /**
      * 发票类型
026:增值税电子普通发票
028:增值税电子专用发票
010:电子发票（普通发票）
020:电子发票（增值税专用发票）
      */
    Type?: string;
    /**
      * 发票代码
      */
    InvoiceCode?: string;
    /**
      * 发票号码
      */
    InvoiceNumber?: string;
    /**
      * 开票日期
      */
    IssueDate?: string;
    /**
      * 验证码
      */
    InvoiceCheckCode?: string;
    /**
      * 机器编号
      */
    MachineNumber?: string;
    /**
      * 密码区
      */
    TaxControlCode?: string;
    /**
      * 购买方
      */
    Buyer?: VatInvoiceUserInfo;
    /**
      * 销售方
      */
    Seller?: VatInvoiceUserInfo;
    /**
      * 价税合计
      */
    TaxInclusiveTotalAmount?: string;
    /**
      * 开票人
      */
    InvoiceClerk?: string;
    /**
      * 收款人
      */
    Payee?: string;
    /**
      * 复核人
      */
    Checker?: string;
    /**
      * 税额
      */
    TaxTotalAmount?: string;
    /**
      * 不含税金额
      */
    TaxExclusiveTotalAmount?: string;
    /**
      * 备注
      */
    Note?: string;
    /**
      * 货物或服务清单
      */
    GoodsInfos?: Array<VatInvoiceGoodsInfo>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 表格识别结果
 */
export interface TextTable {
    /**
      * 单元格左上角的列索引
      */
    ColTl: number;
    /**
      * 单元格左上角的行索引
      */
    RowTl: number;
    /**
      * 单元格右下角的列索引
      */
    ColBr: number;
    /**
      * 单元格右下角的行索引
      */
    RowBr: number;
    /**
      * 单元格文字
      */
    Text: string;
    /**
      * 单元格类型，包含body（表格主体）、header（表头）、footer（表尾）三种
      */
    Type: string;
    /**
      * 置信度 0 ~100
      */
    Confidence: number;
    /**
      * 文本行坐标，以四个顶点坐标表示
      */
    Polygon: Array<Coord>;
    /**
      * 此字段为扩展字段
      */
    AdvancedInfo: string;
}
/**
 * RecognizeTableAccurateOCR返回参数结构体
 */
export interface RecognizeTableAccurateOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
注意：此字段可能返回 null，表示取不到有效值。
      */
    TableDetections?: Array<TableInfo>;
    /**
      * Base64 编码后的 Excel 数据。
      */
    Data?: string;
    /**
      * 图片为PDF时，返回PDF的总页数，默认为0
注意：此字段可能返回 null，表示取不到有效值。
      */
    PdfPageSize?: number;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，统一以逆时针方向旋转，逆时针为负，角度范围为-360°至0°。
注意：此字段可能返回 null，表示取不到有效值。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * ResidenceBookletOCR请求参数结构体
 */
export interface ResidenceBookletOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * BusInvoiceOCR返回参数结构体
 */
export interface BusInvoiceOCRResponse {
    /**
      * 汽车票识别结果，具体内容请点击左侧链接。
      */
    BusInvoiceInfos?: Array<BusInvoiceInfo>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°，顺时针为正，逆时针为负。
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 二维码/条形码识别结果信息
 */
export interface QrcodeResultsInfo {
    /**
      * 类型（二维码、条形码）
      */
    TypeName: string;
    /**
      * 二维码/条形码包含的地址
      */
    Url: string;
    /**
      * 二维码/条形码坐标
      */
    Position: QrcodePositionObj;
}
/**
 * MainlandPermitOCR返回参数结构体
 */
export interface MainlandPermitOCRResponse {
    /**
      * 中文姓名
      */
    Name?: string;
    /**
      * 英文姓名
      */
    EnglishName?: string;
    /**
      * 性别
      */
    Sex?: string;
    /**
      * 出生日期
      */
    Birthday?: string;
    /**
      * 签发机关
      */
    IssueAuthority?: string;
    /**
      * 有效期限
      */
    ValidDate?: string;
    /**
      * 证件号
      */
    Number?: string;
    /**
      * 签发地点
      */
    IssueAddress?: string;
    /**
      * 签发次数
      */
    IssueNumber?: string;
    /**
      * 证件类别， 如：台湾居民来往大陆通行证、港澳居民来往内地通行证。
      */
    Type?: string;
    /**
      * RetProfile为True时返回头像字段， Base64编码
      */
    Profile?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 增值税发票信息
 */
export interface VatInvoice {
    /**
      * 发票代码
      */
    Code: string;
    /**
      * 发票号码
      */
    Number: string;
    /**
      * 开票日期
      */
    Date: string;
    /**
      * 购方抬头
      */
    BuyerName: string;
    /**
      * 购方税号
      */
    BuyerTaxCode: string;
    /**
      * 购方地址电话
      */
    BuyerAddressPhone: string;
    /**
      * 购方银行账号
      */
    BuyerBankAccount: string;
    /**
      * 销方名称
      */
    SellerName: string;
    /**
      * 销方税号
      */
    SellerTaxCode: string;
    /**
      * 销方地址电话
      */
    SellerAddressPhone: string;
    /**
      * 销方银行账号
      */
    SellerBankAccount: string;
    /**
      * 备注
      */
    Remark: string;
    /**
      * 机器编码
      */
    MachineNo: string;
    /**
      * 票种类型
01：增值税专用发票，
02：货运运输业增值税专用发票，
03：机动车销售统一发票，
04：增值税普通发票，
08：增值税电子专用发票（含全电，全电仅新版接口支持），
10：增值税电子普通发票（含全电，全电仅新版接口支持），
11：增值税普通发票（卷式），
14：增值税电子（通行费）发票，
15：二手车销售统一发票，
32：深圳区块链发票，
102：通用机打电子发票
      */
    Type: string;
    /**
      * 检验码
      */
    CheckCode: string;
    /**
      * 是否作废（红冲）是否作废（红冲）
Y：已作废，N：未作废，H：红冲，HP：部分红冲，HF：全额红冲
      */
    IsAbandoned: string;
    /**
      * 是否有销货清单
Y: 有清单 N：无清单
卷票无
      */
    HasSellerList: string;
    /**
      * 销货清单标题
      */
    SellerListTitle: string;
    /**
      * 销货清单税额
      */
    SellerListTax: string;
    /**
      * 不含税金额
      */
    AmountWithoutTax: string;
    /**
      * 税额
      */
    TaxAmount: string;
    /**
      * 含税金额
      */
    AmountWithTax: string;
    /**
      * 项目明细
      */
    Items: Array<VatInvoiceItem>;
    /**
      * 所属税局
      */
    TaxBureau: string;
    /**
      * 通行费标志:Y、是;N、否
      */
    TrafficFreeFlag: string;
}
/**
 * MLIDCardOCR请求参数结构体
 */
export interface MLIDCardOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。( 中国地区之外不支持这个字段 )
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否返回图片，默认false
      */
    RetImage?: boolean;
}
/**
 * OtherInvoiceItem
 */
export interface OtherInvoiceItem {
    /**
      * 票面key值
      */
    Name?: string;
    /**
      * 票面value值
      */
    Value?: string;
}
/**
 * 出租车发票
 */
export interface TaxiTicket {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 上车时间
      */
    TimeGetOn?: string;
    /**
      * 下车时间
      */
    TimeGetOff?: string;
    /**
      * 单价
      */
    Price?: string;
    /**
      * 里程
      */
    Mileage?: string;
    /**
      * 总金额
      */
    Total?: string;
    /**
      * 发票所在地
      */
    Place?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 车牌号
      */
    LicensePlate?: string;
    /**
      * 燃油附加费
      */
    FuelFee?: string;
    /**
      * 预约叫车服务费
      */
    BookingCallFee?: string;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
}
/**
 * EnglishOCR返回参数结构体
 */
export interface EnglishOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    TextDetections?: Array<TextDetectionEn>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angel?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * BusInvoiceOCR请求参数结构体
 */
export interface BusInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * QuotaInvoiceOCR返回参数结构体
 */
export interface QuotaInvoiceOCRResponse {
    /**
      * 发票号码
      */
    InvoiceNum?: string;
    /**
      * 发票代码
      */
    InvoiceCode?: string;
    /**
      * 大写金额
      */
    Rate?: string;
    /**
      * 小写金额
      */
    RateNum?: string;
    /**
      * 发票消费类型
      */
    InvoiceType?: string;
    /**
      * 省
注意：此字段可能返回 null，表示取不到有效值。
      */
    Province?: string;
    /**
      * 市
注意：此字段可能返回 null，表示取不到有效值。
      */
    City?: string;
    /**
      * 是否有公司印章（1有 0无 空为识别不出）
注意：此字段可能返回 null，表示取不到有效值。
      */
    HasStamp?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RideHailingTransportLicenseOCR返回参数结构体
 */
export interface RideHailingTransportLicenseOCRResponse {
    /**
      * 交运管许可字号。
      */
    OperationLicenseNumber?: string;
    /**
      * 车辆所有人，对应网约车运输证字段：车辆所有人/车主名称/业户名称。
      */
    VehicleOwner?: string;
    /**
      * 车牌号码，对应网约车运输证字段：车牌号码/车辆号牌。
      */
    VehicleNumber?: string;
    /**
      * 有效起始日期。
      */
    StartDate?: string;
    /**
      * 有效期截止时间，对应网约车运输证字段：有效期至/营运期限止。
      */
    EndDate?: string;
    /**
      * 初始发证日期，对应网约车运输证字段：初始领证日期/发证日期。
      */
    ReleaseDate?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 候选字符集(包含候选字Character以及置信度Confidence)
 */
export interface CandWord {
    /**
      * 候选字符集的单词信息（包括单词Character和单词置信度confidence）
      */
    CandWords: Array<Words>;
}
/**
 * RecognizeContainerOCR返回参数结构体
 */
export interface RecognizeContainerOCRResponse {
    /**
      * 集装箱箱号
      */
    ContainerId?: string;
    /**
      * 集装箱类型
      */
    ContainerType?: string;
    /**
      * 集装箱总重量，单位：千克（KG）
      */
    GrossKG?: string;
    /**
      * 集装箱总重量，单位：磅（LB）
      */
    GrossLB?: string;
    /**
      * 集装箱有效承重，单位：千克（KG）
      */
    PayloadKG?: string;
    /**
      * 集装箱有效承重，单位：磅（LB）
      */
    PayloadLB?: string;
    /**
      * 集装箱容量，单位：立方米
      */
    CapacityM3?: string;
    /**
      * 集装箱容量，单位：立英尺
      */
    CapacityFT3?: string;
    /**
      * 告警码
-9926	集装箱箱号不完整或者不清晰
-9927	集装箱类型不完整或者不清晰
      */
    Warn?: Array<number>;
    /**
      * 集装箱自身重量，单位：千克（KG）
      */
    TareKG?: string;
    /**
      * 集装箱自身重量，单位：磅（LB）
      */
    TareLB?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 企业证照单个字段的内容
 */
export interface EnterpriseLicenseInfo {
    /**
      * 识别出的字段名称（关键字），不同证件类型可能不同，证件类型包含企业登记证书、许可证书、企业执照、三证合一类证书；
支持以下字段：统一社会信用代码、法定代表人、公司名称、公司地址、注册资金、企业关型、经营范围、成立日期、有效期、开办资金、经费来源、举办单位等；
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
}
/**
 * 定额发票
 */
export interface QuotaInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 是否存在二维码（1：有，0：无）
      */
    QRCodeMark?: number;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
}
/**
 * InsuranceBillOCR请求参数结构体
 */
export interface InsuranceBillOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * ImageEnhancement请求参数结构体
 */
export interface ImageEnhancementRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 默认为空，ReturnImage的取值以及含义如下：
“preprocess”: 返回预处理后的图片数据
“origin”：返回原图片数据
" ":不返回图片数据
      */
    ReturnImage?: string;
    /**
      * 默认值为1，指定图像增强方法：
1：切边增强
2：弯曲矫正
202：黑白模式
204：提亮模式
205：灰度模式
207：省墨模式
208：文字锐化（适合非彩色图片）
300:自动增强（自动从301～304选择任务类型）
301：去摩尔纹
302：去除阴影
303：去除模糊
304：去除过曝
      */
    TaskType?: number;
}
/**
 * GeneralHandwritingOCR返回参数结构体
 */
export interface GeneralHandwritingOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    TextDetections: Array<TextGeneralHandwriting>;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angel: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 单元格数据
 */
export interface TableCell {
    /**
      * 单元格左上角的列索引
      */
    ColTl: number;
    /**
      * 单元格左上角的行索引
      */
    RowTl: number;
    /**
      * 单元格右下角的列索引
      */
    ColBr: number;
    /**
      * 单元格右下角的行索引
      */
    RowBr: number;
    /**
      * 单元格内识别出的字符串文本，若文本存在多行，以换行符"\n"隔开
      */
    Text: string;
    /**
      * 单元格类型
      */
    Type: string;
    /**
      * 单元格置信度
      */
    Confidence: number;
    /**
      * 单元格在图像中的四点坐标
      */
    Polygon: Array<Coord>;
    /**
      * 此字段为扩展字段
注意：此字段可能返回 null，表示取不到有效值。
      */
    AdvancedInfo: string;
    /**
      * 单元格文本属性
      */
    Contents: Array<CellContent>;
}
/**
 * TableOCR返回参数结构体
 */
export interface TableOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接
      */
    TextDetections?: Array<TextTable>;
    /**
      * Base64 编码后的 Excel 数据。
      */
    Data?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 单字在原图中的坐标，以四个顶点坐标表示，以左上角为起点，顺时针返回。
 */
export interface DetectedWordCoordPoint {
    /**
      * 单字在原图中的坐标，以四个顶点坐标表示，以左上角为起点，顺时针返回。
      */
    WordCoordinate: Array<Coord>;
}
/**
 * 数学试题识别结构化对象
 */
export interface QuestionBlockObj {
    /**
      * 数学试题识别结构化信息数组
      */
    QuestionArr: Array<QuestionObj>;
    /**
      * 题目主体区域检测框在图片中的像素坐标
      */
    QuestionBboxCoord: Rect;
}
/**
 * AdvertiseOCR返回参数结构体
 */
export interface AdvertiseOCRResponse {
    /**
      * 检测到的文本信息，包括文本行内容、置信度、文本行坐标以及文本行旋转纠正后的坐标，具体内容请点击左侧链接。
      */
    TextDetections?: Array<AdvertiseTextDetection>;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VehicleLicenseOCR请求参数结构体
 */
export interface VehicleLicenseOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。图片下载时间不超过 3 秒。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * FRONT 为行驶证主页正面（有红色印章的一面），
BACK 为行驶证副页正面（有号码号牌的一面），
DOUBLE 为行驶证主页正面和副页正面。
默认值为：FRONT。
      */
    CardSide?: string;
}
/**
 * 增值税发票卷票信息
 */
export interface VatRollInvoiceInfo {
    /**
      * 识别出的字段名称(关键字)，支持以下字段：
发票代码、合计金额(小写)、合计金额(大写)、开票日期、发票号码、购买方识别号、销售方识别号、校验码、销售方名称、购买方名称、发票消费类型、省、市、是否有公司印章、单价、金额、数量、服务类型、品名、种类。
      */
    Name: string;
    /**
      * 识别出的字段名称对应的值，也就是字段Name对应的字符串结果。
      */
    Value: string;
    /**
      * 文本行在旋转纠正之后的图像中的像素坐标。
      */
    Rect: Rect;
}
/**
 * RecognizeOnlineTaxiItineraryOCR请求参数结构体
 */
export interface RecognizeOnlineTaxiItineraryOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * IDCardOCR请求参数结构体
 */
export interface IDCardOCRRequest {
    /**
      * 图片的 Base64 值。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。要求图片经Base64编码后不超过 7M，分辨率建议500*800以上，支持PNG、JPG、JPEG、BMP格式。建议卡片部分占据图片2/3以上。
建议图片存储于腾讯云，可保障更高的下载速度和稳定性。
      */
    ImageUrl?: string;
    /**
      * FRONT：身份证有照片的一面（人像面），
BACK：身份证有国徽的一面（国徽面），
该参数如果不填，将为您自动判断身份证正反面。
      */
    CardSide?: string;
    /**
      * 以下可选字段均为bool 类型，默认false：
CropIdCard，身份证照片裁剪（去掉证件外多余的边缘、自动矫正拍摄角度）
CropPortrait，人像照片裁剪（自动抠取身份证头像区域）
CopyWarn，复印件告警
BorderCheckWarn，边框和框内遮挡告警
ReshootWarn，翻拍告警
DetectPsWarn，PS检测告警
TempIdWarn，临时身份证告警
InvalidDateWarn，身份证有效日期不合法告警
Quality，图片质量分数（评价图片的模糊程度）
MultiCardDetect，是否开启多卡证检测
ReflectWarn，是否开启反光检测

SDK 设置方式参考：
Config = Json.stringify({"CropIdCard":true,"CropPortrait":true})
API 3.0 Explorer 设置方式参考：
Config = {"CropIdCard":true,"CropPortrait":true}
      */
    Config?: string;
}
/**
 * MixedInvoiceDetect请求参数结构体
 */
export interface MixedInvoiceDetectRequest {
    /**
      * 是否需要返回裁剪后的图片。
      */
    ReturnImage: boolean;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * WaybillOCR请求参数结构体
 */
export interface WaybillOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 预检测开关，当待识别运单占整个输入图像的比例较小时，建议打开预检测开关。默认值为false。
      */
    EnablePreDetect?: boolean;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * VinOCR请求参数结构体
 */
export interface VinOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * VatInvoiceOCR请求参数结构体
 */
export interface VatInvoiceOCRRequest {
    /**
      * 图片/PDF的 Base64 值。
支持的文件格式：PNG、JPG、JPEG、PDF，暂不支持 GIF 格式。
支持的图片/PDF大小：所下载文件经Base64编码后不超过 7M。文件下载时间不超过 3 秒。
支持的图片像素：需介于20-10000px之间。
输入参数 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片/PDF的 Url 地址。
支持的文件格式：PNG、JPG、JPEG、PDF，暂不支持 GIF 格式。
支持的图片/PDF大小：所下载文件经 Base64 编码后不超过 7M。文件下载时间不超过 3 秒。
支持的图片像素：需介于20-10000px之间。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * RecognizePhilippinesUMIDOCR请求参数结构体
 */
export interface RecognizePhilippinesUMIDOCRRequest {
    /**
      * 图片的 Base64 值。 支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。 支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。 图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。 支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。 支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。 图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。 非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage?: boolean;
}
/**
 * MLIDCardOCR返回参数结构体
 */
export interface MLIDCardOCRResponse {
    /**
      * 身份证号
      */
    ID: string;
    /**
      * 姓名
      */
    Name: string;
    /**
      * 地址
      */
    Address: string;
    /**
      * 性别
      */
    Sex: string;
    /**
      * 告警码
-9103	证照翻拍告警
-9102	证照复印件告警
-9106       证件遮挡告警
-9107       模糊图片告警
      */
    Warn: Array<number>;
    /**
      * 证件图片
      */
    Image: string;
    /**
      * 此字段为扩展字段。
返回字段识别结果的置信度，格式如下
{
  字段名:{
    Confidence:0.9999
  }
}
      */
    AdvancedInfo: string;
    /**
      * 证件类型
MyKad  身份证
MyPR    永居证
MyTentera   军官证
MyKAS    临时身份证
POLIS  警察证
IKAD   劳工证
MyKid 儿童卡
      */
    Type: string;
    /**
      * 出生日期（目前该字段仅支持IKAD劳工证、MyKad 身份证）
      */
    Birthday: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * RecognizePhilippinesTinIDOCR请求参数结构体
 */
export interface RecognizePhilippinesTinIDOCRRequest {
    /**
      * 是否返回人像照片。
      */
    ReturnHeadImage: boolean;
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * RecognizeTableOCR请求参数结构体
 */
export interface RecognizeTableOCRRequest {
    /**
      * 图片/PDF的 Base64 值。
要求图片/PDF经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP、PDF格式。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片/PDF的 Url 地址。
要求图片/PDF经Base64编码后不超过 7M，分辨率建议600*800以上，支持PNG、JPG、JPEG、BMP、PDF格式。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
    /**
      * 语言，zh：中英文（默认）jap：日文
      */
    TableLanguage?: string;
}
/**
 * EstateCertOCR请求参数结构体
 */
export interface EstateCertOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 3M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 3M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * VerifyBasicBizLicense请求参数结构体
 */
export interface VerifyBasicBizLicenseRequest {
    /**
      * 用于入参是营业执照图片的场景，ImageBase64和ImageUrl必须提供一个，如果都提供，只使用 ImageUrl。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
      */
    ImageBase64?: string;
    /**
      * 用于入参是营业执照图片的场景，ImageBase64和ImageUrl必须提供一个，如果都提供，只使用 ImageUrl。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
      */
    ImageUrl?: string;
    /**
      * 用于入参是营业执照图片的场景，表示需要校验的参数：RegNum（注册号或者统一社会信用代码），Name（企业名称），Address（经营地址）。选择后会返回相关参数校验结果。RegNum为必选，Name和Address可选。
格式为{RegNum: true, Name:true/false, Address:true/false}

设置方式参考：
Config = Json.stringify({"Name":true,"Address":true})
API 3.0 Explorer 设置方式参考：
Config = {"Name":true,"Address":true}
      */
    ImageConfig?: string;
    /**
      * 用于入参是文本的场景，RegNum表示注册号或者统一社会信用代码。若没有传入营业执照图片，则RegNum为必选项，若图片和RegNum都传入，则只使用RegNum。
      */
    RegNum?: string;
    /**
      * 用于入参是文本的场景，Name表示企业名称。Name为可选项，填写后会返回Name的校验结果。
      */
    Name?: string;
    /**
      * 用于入参是文本的场景，Address表示经营地址。Address为可选项，填写后会返回Address的校验结果。
      */
    Address?: string;
    /**
      * 1表示输出注册资本字段（单位：万元），其他值表示不输出。默认不输出。
      */
    RegCapital?: number;
    /**
      * true表示展示成立/注册日期
      */
    EstablishTime?: boolean;
}
/**
 * BizLicenseOCR返回参数结构体
 */
export interface BizLicenseOCRResponse {
    /**
      * 统一社会信用代码（三合一之前为注册号）
      */
    RegNum?: string;
    /**
      * 公司名称
      */
    Name?: string;
    /**
      * 注册资本
      */
    Capital?: string;
    /**
      * 法定代表人
      */
    Person?: string;
    /**
      * 地址
      */
    Address?: string;
    /**
      * 经营范围
      */
    Business?: string;
    /**
      * 主体类型
      */
    Type?: string;
    /**
      * 营业期限
      */
    Period?: string;
    /**
      * 组成形式
      */
    ComposingForm?: string;
    /**
      * 成立日期
      */
    SetDate?: string;
    /**
      * Code 告警码列表和释义：
-20001 非营业执照
-9102 黑白复印件告警
注：告警码可以同时存在多个
      */
    RecognizeWarnCode?: Array<number>;
    /**
      * 告警码说明：
OCR_WARNING_TYPE_NOT_MATCH 非营业执照
WARN_COPY_CARD 黑白复印件告警
注：告警信息可以同时存在多个
      */
    RecognizeWarnMsg?: Array<string>;
    /**
      * 是否为副本。1为是，-1为不是。
      */
    IsDuplication?: number;
    /**
      * 登记日期
      */
    RegistrationDate?: string;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * VatInvoiceOCR返回参数结构体
 */
export interface VatInvoiceOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    VatInvoiceInfos?: Array<TextVatInvoice>;
    /**
      * 明细条目。VatInvoiceInfos中关于明细项的具体条目。
      */
    Items?: Array<VatInvoiceItem>;
    /**
      * 默认值为0。如果图片为PDF时，返回PDF的总页数。
      */
    PdfPageSize?: number;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负。点击查看<a href="https://cloud.tencent.com/document/product/866/45139">如何纠正倾斜文本</a>
      */
    Angle?: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * QuotaInvoiceOCR请求参数结构体
 */
export interface QuotaInvoiceOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 3M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 3M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 是否开启PDF识别，默认值为true，开启后可同时支持图片和PDF的识别。
      */
    IsPdf?: boolean;
    /**
      * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，当上传文件为PDF且IsPdf参数值为true时有效，默认值为1。
      */
    PdfPageNumber?: number;
}
/**
 * BankCardOCR返回参数结构体
 */
export interface BankCardOCRResponse {
    /**
      * 卡号
      */
    CardNo: string;
    /**
      * 银行信息
      */
    BankInfo: string;
    /**
      * 有效期，格式如：07/2023
      */
    ValidDate: string;
    /**
      * 卡类型
      */
    CardType: string;
    /**
      * 卡名字
      */
    CardName: string;
    /**
      * 切片图片数据
注意：此字段可能返回 null，表示取不到有效值。
      */
    BorderCutImage: string;
    /**
      * 卡号图片数据
注意：此字段可能返回 null，表示取不到有效值。
      */
    CardNoImage: string;
    /**
      * WarningCode 告警码列表和释义：
-9110:银行卡日期无效;
-9111:银行卡边框不完整;
-9112:银行卡图片反光;
-9113:银行卡复印件;
-9114:银行卡翻拍件
（告警码可以同时存在多个）
注意：此字段可能返回 null，表示取不到有效值。
      */
    WarningCode: Array<number>;
    /**
      * 图片质量分数，请求EnableQualityValue时返回（取值范围：0-100，分数越低越模糊，建议阈值≥50）。
注意：此字段可能返回 null，表示取不到有效值。
      */
    QualityValue: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * BusinessCardOCR请求参数结构体
 */
export interface BusinessCardOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
    /**
      * 可选字段，根据需要选择是否请求对应字段。
目前支持的字段为：
RetImageType-“PROPROCESS” 图像预处理，string 类型。
图像预处理功能为，检测图片倾斜的角度，将原本倾斜的图片围绕中心点转正，最终输出一张正的名片抠图。

SDK 设置方式参考：
Config = Json.stringify({"RetImageType":"PROPROCESS"})
API 3.0 Explorer 设置方式参考：
Config = {"RetImageType":"PROPROCESS"}
      */
    Config?: string;
}
/**
 * RecognizePhilippinesDrivingLicenseOCR返回参数结构体
 */
export interface RecognizePhilippinesDrivingLicenseOCRResponse {
    /**
      * 人像照片Base64后的结果
      */
    HeadPortrait: TextDetectionResult;
    /**
      * 姓名
      */
    Name: TextDetectionResult;
    /**
      * 姓氏
      */
    LastName: TextDetectionResult;
    /**
      * 首姓名
      */
    FirstName: TextDetectionResult;
    /**
      * 中间姓名
      */
    MiddleName: TextDetectionResult;
    /**
      * 国籍
      */
    Nationality: TextDetectionResult;
    /**
      * 性别
      */
    Sex: TextDetectionResult;
    /**
      * 地址
      */
    Address: TextDetectionResult;
    /**
      * 证号
      */
    LicenseNo: TextDetectionResult;
    /**
      * 有效期
      */
    ExpiresDate: TextDetectionResult;
    /**
      * 机构代码
      */
    AgencyCode: TextDetectionResult;
    /**
      * 出生日期
      */
    Birthday: TextDetectionResult;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * FinanBillOCR请求参数结构体
 */
export interface FinanBillOCRRequest {
    /**
      * 图片的 Base64 值。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经Base64编码后不超过 7M。图片下载时间不超过 3 秒。
图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
      */
    ImageBase64?: string;
    /**
      * 图片的 Url 地址。
支持的图片格式：PNG、JPG、JPEG，暂不支持 GIF 格式。
支持的图片大小：所下载图片经 Base64 编码后不超过 7M。图片下载时间不超过 3 秒。
图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，建议图片存储于腾讯云。
非腾讯云存储的 Url 速度和稳定性可能受一定影响。
      */
    ImageUrl?: string;
}
/**
 * 二手车销售统一发票
 */
export interface UsedCarPurchaseInvoice {
    /**
      * 发票名称
      */
    Title?: string;
    /**
      * 是否存在二维码（0：没有，1：有）
      */
    QRCodeMark?: number;
    /**
      * 发票代码
      */
    Code?: string;
    /**
      * 发票号码
      */
    Number?: string;
    /**
      * 开票日期
      */
    Date?: string;
    /**
      * 价税合计（小写）
      */
    Total?: string;
    /**
      * 价税合计（大写）
      */
    TotalCn?: string;
    /**
      * 销货单位名称
      */
    Seller?: string;
    /**
      * 销售方电话
      */
    SellerTel?: string;
    /**
      * 销售方单位代码/个人身份证号
      */
    SellerTaxID?: string;
    /**
      * 销售方地址
      */
    SellerAddress?: string;
    /**
      * 购买方名称
      */
    Buyer?: string;
    /**
      * 购买方单位代码/个人身份证号
      */
    BuyerID?: string;
    /**
      * 购买方地址
      */
    BuyerAddress?: string;
    /**
      * 购买方电话
      */
    BuyerTel?: string;
    /**
      * 二手车市场
      */
    CompanyName?: string;
    /**
      * 二手车市场纳税人识别号
      */
    CompanyTaxID?: string;
    /**
      * 二手车市场开户银行和账号
      */
    CompanyBankAccount?: string;
    /**
      * 二手车市场电话
      */
    CompanyTel?: string;
    /**
      * 二手车市场地址
      */
    CompanyAddress?: string;
    /**
      * 转入地车辆管理所名称
      */
    TransferAdministrationName?: string;
    /**
      * 车牌号
      */
    LicensePlate?: string;
    /**
      * 登记证号
      */
    RegistrationNumber?: string;
    /**
      * 车辆识别代码
      */
    VIN?: string;
    /**
      * 厂牌型号
      */
    VehicleModel?: string;
    /**
      * 发票消费类型
      */
    Kind?: string;
    /**
      * 省
      */
    Province?: string;
    /**
      * 市
      */
    City?: string;
    /**
      * 车辆类型
      */
    VehicleType?: string;
    /**
      * 备注
      */
    Remark?: string;
    /**
      * 发票联次
      */
    FormType?: string;
    /**
      * 发票联名
      */
    FormName?: string;
    /**
      * 是否有公司印章（0：没有，1：有）
      */
    CompanySealMark?: number;
}
/**
 * VerifyEnterpriseFourFactors返回参数结构体
 */
export interface VerifyEnterpriseFourFactorsResponse {
    /**
      * 核验一致性（1:一致，2:不一致，3:查询无记录）
      */
    State?: number;
    /**
      * 核验结果明细，7：企业法人/负责人，6：企业股东，5：企
业管理人员，-21：企业名称与企业标识不符，-22：姓名不一致，-23：证件号码不一致，-24：企业名称不一致，-25：企业标识不一致
注意：此字段可能返回 null，表示取不到有效值。
      */
    Detail?: Detail;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * GeneralFastOCR返回参数结构体
 */
export interface GeneralFastOCRResponse {
    /**
      * 检测到的文本信息，具体内容请点击左侧链接。
      */
    TextDetections: Array<TextDetection>;
    /**
      * 检测到的语言，目前支持的语种范围为：简体中文、繁体中文、英文、日文、韩文。未来将陆续新增对更多语种的支持。
返回结果含义为：zh - 中英混合，jap - 日文，kor - 韩文。
      */
    Language: string;
    /**
      * 图片旋转角度（角度制），文本的水平方向为0°；顺时针为正，逆时针为负
      */
    Angel: number;
    /**
      * 图片为PDF时，返回PDF的总页数，默认为0
      */
    PdfPageSize: number;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;
}
/**
 * 二维码/条形码坐标信息
 */
export interface QrcodePositionObj {
    /**
      * 左上顶点坐标（如果是条形码，X和Y都为-1）
      */
    LeftTop: Coord;
    /**
      * 右上顶点坐标（如果是条形码，X和Y都为-1）
      */
    RightTop: Coord;
    /**
      * 右下顶点坐标（如果是条形码，X和Y都为-1）
      */
    RightBottom: Coord;
    /**
      * 左下顶点坐标（如果是条形码，X和Y都为-1）
      */
    LeftBottom: Coord;
}
