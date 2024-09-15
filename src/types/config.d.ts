export declare interface Config {
    autoUpdateConfig: boolean;
    cqws: Cqw;
    bot: Bot;
    saucenaoHost: string;
    saucenaoApiKey: string;
    whatanimeHost: string;
    whatanimeToken: string;
    ascii2dHost: string;
}

declare interface Bot {
    debug: boolean;
    admin: number;
    adminTinyId: string;
    whiteGroup: Set<number | string>;
    enablePM: boolean;
    enableGM: boolean;
    enableGuild: boolean;
    autoAddFriend: boolean;
    addFriendAnswers: any[];
    autoAddGroup: boolean;
    spaceAfterAt: boolean;
    antiShielding: number;
    handleBannedHosts: boolean;
    handleBannedHostsWithLegacyMethod: boolean;
    stopSearchingHWRatioGt: number;
    hideImg: boolean;
    hideImgWhenSaucenaoNSFW: number;
    hideImgWhenLowAcc: boolean;
    hideImgWhenWhatanimeR18: boolean;
    whatanimeSendVideo: boolean;
    whatanimeLocalUpload: boolean;
    saucenaoDefaultDB: string;
    saucenaoLowAcc: number;
    saucenaoLocalUpload: boolean;
    useAscii2dWhenQuotaExcess: boolean;
    useAscii2dWhenLowAcc: boolean;
    useAscii2dWhenFailed: boolean;
    ascii2dLocalUpload: boolean;
    ascii2dUsePuppeteer: boolean;
    getDoujinDetailFromNhentai: boolean;
    getDoujinDetailFromNhentaiMirrorSite: string;
    nHentaiUsePuppeteer: boolean;
    searchFeedback: boolean;
    searchLimit: number;
    searchModeTimeout: number;
    pmSearchResult: boolean;
    pmSearchResultTemp: boolean;
    privateForwardSearchResult: boolean;
    groupForwardSearchResult: boolean;
    proxy: string;
    cfTLSVersion: string;
    checkUpdate: number;
    ignoreOfficialBot: boolean;
    canvasLibrary: string;
    disableMessageEscape: boolean;
    cache: Cache;
    repeat: Repeat;
    setu: Setu;
    regs: Reg;
    replys: Reply;
    ocr: Ocr;
    akhr: Akhr;
    reminder: Reminder;
    bilibili: Bilibili;
    corpus: any[];
    chatgpt: Chatgpt;
    like: Like;
    vits: Vit;
}

declare interface Vit {
    enable: boolean;
    command: string;
    apiUrl: string;
    defaultModelId: string;
    userDailyLimit: number;
    noFFmpeg: boolean;
    blackGroup: Set<number | string>;
    whiteGroup: Set<number | string>;
}

declare interface Like {
    enable: boolean;
    regexp: string;
    defaultTimes: number;
    maxTimes: number;
    adminDailyLike: number;
}

declare interface Chatgpt {
    enable: boolean;
    regexp: string;
    model: string;
    useChatAPI: boolean;
    maxTokens: number;
    prependMessages: any[];
    additionParams: AdditionParam;
    apiKey: string;
    organization: string;
    userDailyLimit: number;
    blackGroup: Set<number | string>;
    whiteGroup: Set<number | string>;
    overrides: any[];
}

declare type AdditionParam = Push;

declare interface Bilibili {
    despise: boolean;
    getVideoInfo: boolean;
    getDynamicInfo: boolean;
    getArticleInfo: boolean;
    getLiveRoomInfo: boolean;
    dynamicImgPreDl: boolean;
    dynamicMergeImgs: boolean;
    imgPreDlTimeout: number;
    dynamicLinkPosition: string;
    dynamicImgLimit: number;
    push: Push;
    pushCheckInterval: number;
    pushIgnoreForwardingSelf: boolean;
    useFeed: boolean;
    feedCheckInterval: number;
    cookie: string;
    respondRecall: boolean;
    recallMiniProgram: boolean;
    blackGroup: Set<number | string>;
    whiteGroup: Set<number | string>;
}

declare interface Push {
}

declare interface Reminder {
    enable: boolean;
    onlyPM: boolean;
    onlyAdmin: boolean;
}

declare interface Akhr {
    enable: boolean;
    updateInterval: number;
    ocr: string;
    ocrFallback: any[];
}

declare interface Ocr {
    use: string;
    fallback: any[];
    "ocr.space": OcrSpace;
    baidubce: Baidubce;
    tencent: Tencent;
}

declare interface Tencent {
    SecretId: string;
    SecretKey: string;
    Region: string;
    useApi: string[];
}

declare interface Baidubce {
    useApi: string;
    apiKey: string;
    secretKey: string;
}

declare interface OcrSpace {
    defaultLANG: string;
    apikey: string;
}

declare interface Reply {
    default: string;
    debug: string;
    personLimit: string;
    failed: string;
    searching: string;
    searchFeedback: string;
    searchModeOn: string;
    searchModeAlreadyOn: string;
    searchModeOff: string;
    searchModeAlreadyOff: string;
    searchModeTimeout: string;
    setuLimit: string;
    setuNotFind: string;
    setuError: string;
    setuReject: string;
    setuQuotaExceeded: string;
    stopSearchingByHWRatio: string;
}

declare interface Reg {
    ignore: string;
    searchModeOn: string;
    searchModeOff: string;
    setu: string;
}

declare interface Setu {
    enable: boolean;
    apikey: string;
    antiShielding: number;
    allowPM: boolean;
    pximgServerHost: string;
    pximgServerPort: number;
    usePximgAddr: string;
    pximgProxy: string;
    sendUrls: boolean;
    sendPximgProxies: any[];
    shortenPximgProxy: string;
    size1200: boolean;
    deleteTime: number;
    cd: number;
    limit: number;
    blackGroup: Set<number | string>;
    whiteGroup: Set<number | string>;
    whiteOnly: boolean;
    whiteCd: number;
    whiteDeleteTime: number;
    r18OnlyUrl: R18OnlyUrl;
    r18OnlyPrivate: boolean;
    r18OnlyPrivateAllowTemp: boolean;
    r18OnlyInWhite: boolean;
    r18AllowInGuild: boolean;
}

declare interface R18OnlyUrl {
    private: boolean;
    group: boolean;
    temp: boolean;
    guild: boolean;
}

declare interface Repeat {
    enable: boolean;
    times: number;
    probability: number;
    commonProb: number;
}

declare interface Cache {
    enable: boolean;
    expire: number;
}

declare interface Cqw {
    host: string;
    port: number;
    enableAPI: boolean;
    enableEvent: boolean;
    accessToken: string;
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
}