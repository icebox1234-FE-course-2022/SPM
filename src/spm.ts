import { SPMNode } from './spmNode.js';
export class SPM extends SPMNode {
    spmA = '';
    spmB = '';
    spmC = '';
    spmD = '';
    forceExpose = false;
    reportUrl = '';
    spmPre = '';
    spmUrl = '';
    threshold = 0.5;


    constructor() {
        super();
        this.initPrevious();
        this.initClickMonitor();
        this.initExposeMonitor();
        this.initSpecificElementClickMonitor();
        this.fillWindow();
    }
    initPrevious() {
        const { search = '' } = window.location;
        const spmPreRes = search.match(/spm_pre\=([A-Za-z0-9]+)/g);
        const spmUrlRes = search.match(/spm_url\=([A-Za-z0-9]+)/g);
        this.spmPre = spmPreRes ? (spmPreRes[1] || '') : '';
        this.spmUrl = spmUrlRes ? (spmUrlRes[1] || '') : ''
    }
    initClickMonitor() {
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    clickHandler(event: Event) {
        const element = event.target!;
        if (this.isValidSpmNode(element as HTMLElement)) {
            // const spmId = this.generateSpmId(element as HTMLElement);
            // this.hooks.click.call({ spmId });
            fetch('');
        }
    }
    initExposeMonitor() { }
    initSpecificElementClickMonitor() { }
    fillWindow() {
        // const spmClick = this.spmClick.bind(this);
        // const spmExpose = this.spmExpose.bind(this);
        // window['spm'] = {
        //     spmClick,
        //     spmExpose
        // };
    }
    spmClick(spm = '', params: string) {
        console.log(spm, params)
    }
    spmExpose(spm = '', params?: string, forceExpose = false) {
        console.log(spm, params, forceExpose)
    }

}