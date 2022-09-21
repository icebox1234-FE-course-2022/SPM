import { SPMNode } from './spmNode';
import { InitOption } from './type';
import { getSpmPre, getSpmUrl, report } from './utils';

export class SPM {
    private exposeOnce = true;
    private reportUrl = '';
    private spmPre = '';
    private spmUrl = '';
    private threshold = 0.5;
    private io?: IntersectionObserver;
    //TODO  need cache
    private clickEleCache: WeakMap<HTMLElement | EventTarget, SPMNode> = new WeakMap();
    private exposeEleCache: WeakMap<HTMLElement | EventTarget, SPMNode> = new WeakMap();
    private functionExposeCache: Set<string> = new Set();


    constructor(initOptions: InitOption) {
        if (!initOptions.spmA || !initOptions.reportUrl) {
            console.error('spmA or reportUrl is null');
            return;
        }
        this.initWindow();
        this.initOptions(initOptions)
        this.initSource();
        this.initClickMonitor();
        this.initExposeMonitor();
        this.initSpecificElementClickMonitor();
        this.fillWindow();
        report('PV');
    }
    initWindow() {
        window.spmExternal = {};
        window.spmInfo = {};
    }
    initOptions(initOptions: InitOption) {
        this.exposeOnce = initOptions?.exposeOnce || this.exposeOnce;
        this.threshold = initOptions?.threshold || this.threshold;
        this.reportUrl = initOptions?.reportUrl || this.reportUrl;
        document.body.setAttribute('data-spma', initOptions.spmA);
    }
    initSource() {
        this.spmPre = getSpmPre();
        this.spmUrl = getSpmUrl();
    }
    initClickMonitor() {
        document.addEventListener('click', this.clickHandler.bind(this));
    }
    clickHandler(event: Event) {
        const element = event.target!;
        let cachedSpmNode = this.clickEleCache.get(element);
        if (!cachedSpmNode) {
            cachedSpmNode = new SPMNode(element);
            this.clickEleCache.set(element, cachedSpmNode);
        }
        //TODO reaction
        cachedSpmNode.reportClick();
    }
    initExposeMonitor() {
        this.io = new IntersectionObserver(this.exposeHandler.bind(this), { root: document.body, threshold: this.threshold })
        const exposeEleArr = Array.from(document.querySelectorAll('[data-spm-expose]'));
        exposeEleArr.forEach(ele => {
            let cachedSpmNode = this.exposeEleCache.get(ele);
            if (!cachedSpmNode) {
                cachedSpmNode = new SPMNode(ele);
                cachedSpmNode.setExpose({ exposeOnce: this.exposeOnce });
                this.exposeEleCache.set(ele, cachedSpmNode);
            }
        })
        exposeEleArr.forEach(ele => {
            this.io!.observe(ele);
        });
    }
    exposeHandler(entries: IntersectionObserverEntry[]) {
        entries.forEach(entry => {
            const element = entry.target;
            const cachedSpmNode = this.exposeEleCache.get(element);
            if (cachedSpmNode) {
                cachedSpmNode.reportExpose();
            }
        })
    }
    initSpecificElementClickMonitor() {
        //TODO 处理被stopPropagation包裹的埋点元素
    }
    fillWindow() {
        window.spmInfo = { reportUrl: this.reportUrl, spmPre: this.spmPre, spmUrl: this.spmUrl };
        window.spmExternal = {
            spmClick: this.spmClick.bind(this),
            spmExpose: this.spmExpose.bind(this)
        };
    }
    spmClick(spm = '', params: string) {
        report('expose', { spmCnt: `${spm.split('.').slice(0, 2).join('.')}`, spm, spmExt: params || '' });
    }
    spmExpose(spm = '', params?: string, forceExpose = false) {
        if (this.exposeOnce) {
            if (!forceExpose) {
                if (this.functionExposeCache.has(spm)) {
                    return;
                } else {
                    this.functionExposeCache.add(spm);
                }
            }
        }
        report('expose', { spmCnt: `${spm.split('.').slice(0, 2).join('.')}`, spm, spmExt: params || '' });
    }
}