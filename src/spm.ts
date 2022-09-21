import { SPMHandler } from './spmHandler';
import { SPMNode } from './spmNode';
import { InitOption } from './type';
import { getSpmPre, getSpmUrl } from './utils';

export class SPM {
    private exposeOnce = true;
    private reportUrl = '';
    private spmPre = '';
    private spmUrl = '';
    private threshold = 0.5;
    private io?: IntersectionObserver;
    private multipleExpose: any[] = [];
    //TODO  need cache
    private cache: WeakMap<Element | EventTarget, SPMNode> = new WeakMap();
    private spmA = '';
    private spmB = '';


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
        let cachedSpmNode = this.cache.get(element);
        if (!cachedSpmNode) {
            cachedSpmNode = new SPMNode(element);
            this.cache.set(element, cachedSpmNode);
        }
        //TODO reaction
        cachedSpmNode.reportClick();
    }
    initExposeMonitor() {
        this.io = new IntersectionObserver(this.exposeHandler.bind(this), { root: document.body, threshold: this.threshold })
        const exposeEleArr = Array.from(document.querySelectorAll('[data-spm-expose]'));
        if (!this.exposeOnce) {
            this.multipleExpose = this.multipleExpose.concat(...exposeEleArr);
        } else {
            exposeEleArr.forEach(ele => {
                if ((ele as HTMLElement).dataset.hasOwnProperty('spmForceExpose')) {
                    this.multipleExpose.push(ele);
                }
            })
        }
        exposeEleArr.forEach(ele => {
            this.io!.observe(ele);
        });
    }
    exposeHandler(entries: IntersectionObserverEntry[]) {
        entries.forEach(entry => {
            const element = entry.target;
            // if (this.isValidSpmNode(element)) {
            //     const spmId = this.generateSpmId(element as HTMLElement);
            //     // fetch()
            //     // this.hooks.expose.call({ spmId });
            // }
        })
    }
    initSpecificElementClickMonitor() {

    }
    fillWindow() {
        window.spmInfo = { reportUrl: this.reportUrl, spmPre: this.spmPre, spmUrl: this.spmUrl };
        window.spmExternal = {
            spmClick: this.spmClick.bind(this),
            spmExpose: this.spmExpose.bind(this)
        };
    }
    spmClick(spm = '', params: string) {
        console.log(spm, params)
    }
    spmExpose(spm = '', params?: string, forceExpose = false) {
        console.log(spm, params, forceExpose)
    }
    getSourceParams() {
        const spmPre = this.spmPre ? `spm_pre=${this.spmPre}` : '';
        const spmUrl = this.spmUrl ? `spm_url=${this.spmUrl}` : '';
        const spmCnt = `spm_cnt=${this.spmA}.${this.spmB}`;
        const params = [spmPre, spmUrl, spmCnt].filter(item => item).join('&');
        return `${params}`;
    }
    getSpmParams(spmInfo: any, data = '') {
        const { spmA, spmB, spmC, spmD } = spmInfo;
        console.log(spmA);
        // const spm = `spm=${[this.spmA, this.spmB, this.spmC, this.spmD].filter(item => item).join('.')}`;
        // const spmData = data ? `spm-ext=${data}` : '';
        // return `${[spm, spmData].filter(item => item).join('&')}`
        return '';
    }
    reportPV() {
        // fetch(`${this.reportUrl}?${this.getSourceParams()}`)
    }
    report() {
        // fetch(`${this.reportUrl}?${this.getSourceParams()}${this.getSpmParams()}`)
    }

}