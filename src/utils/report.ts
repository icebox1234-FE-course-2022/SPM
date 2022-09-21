export function report(action: 'click' | 'expose' | 'PV', data?: { spmCnt: string, spm: string, spmExt: string }) {
    const { spmPre, spmUrl, reportUrl } = window.spmInfo;
    const { spmCnt = '', spmExt = '', spm = '' } = data ?? {};
    const reportSpmPre = spmPre ? `spm_pre=${spmPre}` : '';
    const reportSpmUrl = spmUrl ? `spm_url=${spmUrl}` : '';
    if (action === 'PV') {
        fetch(`${reportUrl}?${[reportSpmPre, reportSpmUrl, spmCnt].filter(item => item).join('&')}`);
    } else {
        const reportSpmExt = spmExt ? `&${spmExt}` : '';
        fetch(`${reportUrl}?${[reportSpmPre, reportSpmUrl, spmCnt].filter(item => item).join('&')}&spm_action=${action}$spm=${spm}${reportSpmExt}`);
    }
}