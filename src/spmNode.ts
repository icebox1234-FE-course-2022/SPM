import { report } from "./utils";


type SPMElement = EventTarget | HTMLElement;
export class SPMNode {
    spmA = '';
    spmB = '';
    spmC = '';
    spmD = '';
    exposeOnce = false;
    exposed = false;
    forceExpose = false;
    constructor(element: SPMElement) {
    }
    generateSpmId(element: HTMLElement) {
        let ids = Array.from<string>({ length: 4 });
        let curEle = element;
        const isEmpty = (obj: any) => {
            return Object.keys(obj).length === 0;
        }
        const SPM_LOCATION = ['spma', 'spmb', 'spmc', 'spmd'];
        const findSpmPath = (spmLocationIndex: number) => {
            if (spmLocationIndex < 0) {
                return;
            }
            while (curEle !== document.body.parentElement) {
                const spmInfo = this.filterSpmInfo(curEle);
                if (!isEmpty(spmInfo)) {
                    break;
                }
                curEle = curEle.parentElement!;
            }
            if (curEle === document.body.parentElement) {
                return;
            }
            const spm: any = this.filterSpmInfo(curEle);
            const spmLocation = spm[SPM_LOCATION[spmLocationIndex]];
            if (!spmLocation) {
                findSpmPath(spmLocationIndex - 1);
            } else {
                ids[spmLocationIndex] = spmLocation;
                curEle = curEle.parentElement!;
                findSpmPath(spmLocationIndex - 1);
            }
        }
        findSpmPath(3);
        if (this.isValidSpmInfo(ids)) {
            const [_spmA, _spmB, _spmC, _spmD] = ids;
            this.spmA = _spmA || '';
            this.spmB = _spmB || '';
            this.spmC = _spmC || '';
            this.spmD = _spmD || '';
            return ids.filter(item => item).join('.');
        }
        return '';
    }
    isValidSpmNode(spmInfo: any) {
        const { spmc, spmd, spmExpose } = spmInfo;
        return spmd || spmc || spmExpose;
    }
    isValidSpmInfo(ids: string[] = []) {
        if (ids.length <= 0) {
            return false;
        }
        if (!ids[0] || !ids[1]) {
            return false;
        }
        return true;
    }
    filterSpmInfo(element: SPMElement) {
        const spmInfo: any = {};
        Object.keys((element as HTMLElement).dataset).filter(item => {
            return item.indexOf('spm') !== -1;
        }).forEach(item => {
            spmInfo[item] = (element as HTMLElement).dataset[item];
        });
        return spmInfo;
    }
    setExpose(exposeOptions: { exposeOnce: boolean }) {
        this.exposeOnce = exposeOptions.exposeOnce;
    }
    reportClick() {
        // const spmInfo = this.filterSpmInfo()
        report('click')
    }
    reportExpose() {
        if (this.exposeOnce && this.exposed) {
            return;
        }

    }
}