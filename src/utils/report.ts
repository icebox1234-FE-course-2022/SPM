export function report(action: 'click' | 'expose' | 'PV', data?: { spmCnt: string, spm: string, spmExt: string }) {
    const { spmPre, spmUrl, reportUrl } = window.spmInfo;
    const { spmCnt = '', spmExt = '', spm = '' } = data ?? {};
    const reportSpmPre = spmPre ? `spm_pre=${spmPre}` : '';
    const reportSpmUrl = spmUrl ? `spm_url=${spmUrl}` : '';
    const common = `${reportUrl}?${[reportSpmPre, reportSpmUrl, spmCnt].filter(item => item).join('&')}`;
    if (action === 'PV') {
        fetch(`${common}`);
    } else {
        const reportSpmExt = spmExt ? `&${spmExt}` : '';
        fetch(`${common}&spm_action=${action}$spm=${spm}${reportSpmExt}`);
    }
}