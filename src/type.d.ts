declare global {
    interface Window {
        spmExternal: {
            spmExpose?: Function;
            spmClick?: Function
        };
        spmInfo: {
            reportUrl?: string;
            spmPre?: string;
            spmUrl?: string;
        };
    }
}

export type MonitorElement = HTMLElement | EventTarget;

export interface InitOption {
    spmA: string;
    exposeOnce?: boolean;
    reportUrl: string;
    threshold?: number
}

